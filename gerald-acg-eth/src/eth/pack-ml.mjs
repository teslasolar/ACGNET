/**
 * @fileoverview PackML State Machine — ISA-88 / TR88.00.02
 *
 * Maps PackML (Packaging Machine Language) state model to community
 * work orders. A work order (RFC, refactor, governance proposal) moves
 * through defined states with explicit transitions.
 *
 * PackML States:
 *   Idle -> Starting -> Execute -> Completing -> Complete
 *                    -> Held (pause)
 *                    -> Aborting -> Aborted
 *   Aborted -> Resetting -> Idle
 *   Held -> Execute (resume)
 *
 * @module eth/pack-ml
 */

/**
 * Valid PackML states.
 * @enum {string}
 */
export const State = {
  IDLE: 'Idle',
  STARTING: 'Starting',
  EXECUTE: 'Execute',
  COMPLETING: 'Completing',
  COMPLETE: 'Complete',
  HELD: 'Held',
  ABORTING: 'Aborting',
  ABORTED: 'Aborted',
  RESETTING: 'Resetting',
};

/**
 * Valid state transitions per PackML spec.
 * @type {Record<string, string[]>}
 */
const VALID_TRANSITIONS = {
  [State.IDLE]:       [State.STARTING],
  [State.STARTING]:   [State.EXECUTE, State.ABORTING],
  [State.EXECUTE]:    [State.COMPLETING, State.HELD, State.ABORTING],
  [State.COMPLETING]: [State.COMPLETE, State.ABORTING],
  [State.COMPLETE]:   [State.RESETTING],
  [State.HELD]:       [State.EXECUTE, State.ABORTING],
  [State.ABORTING]:   [State.ABORTED],
  [State.ABORTED]:    [State.RESETTING],
  [State.RESETTING]:  [State.IDLE],
};

/**
 * PackML Work Order — tracks a community work item through its lifecycle.
 *
 * @class
 */
export class WorkOrder {
  /**
   * Create a new work order.
   *
   * @param {Object} options
   * @param {string} options.id - Unique work order ID
   * @param {string} options.title - Human-readable title
   * @param {string} options.author - Discord user ID of the author
   * @param {string} [options.description=''] - Description of the work
   */
  constructor({ id, title, author, description = '' }) {
    /** @type {string} */
    this.id = id;

    /** @type {string} */
    this.title = title;

    /** @type {string} */
    this.author = author;

    /** @type {string} */
    this.description = description;

    /** @type {string} */
    this.state = State.IDLE;

    /** @type {Array<{from: string, to: string, timestamp: number, actor: string}>} */
    this.history = [];

    /** @type {number} */
    this.createdAt = Date.now();

    /** @type {number} */
    this.updatedAt = Date.now();
  }

  /**
   * Attempt a state transition.
   *
   * @param {string} targetState - The state to transition to
   * @param {string} actor - Discord user ID performing the transition
   * @returns {{ success: boolean, from: string, to: string, error?: string }}
   */
  transition(targetState, actor) {
    const validTargets = VALID_TRANSITIONS[this.state] || [];

    if (!validTargets.includes(targetState)) {
      return {
        success: false,
        from: this.state,
        to: targetState,
        error: `Invalid transition: ${this.state} -> ${targetState}. Valid targets: ${validTargets.join(', ') || 'none'}.`,
      };
    }

    const from = this.state;
    this.state = targetState;
    this.updatedAt = Date.now();

    this.history.push({
      from,
      to: targetState,
      timestamp: Date.now(),
      actor,
    });

    return { success: true, from, to: targetState };
  }

  /**
   * Start the work order (Idle -> Starting -> Execute).
   *
   * @param {string} actor - Discord user ID
   * @returns {{ success: boolean, from: string, to: string, error?: string }}
   */
  start(actor) {
    const startResult = this.transition(State.STARTING, actor);
    if (!startResult.success) return startResult;
    return this.transition(State.EXECUTE, actor);
  }

  /**
   * Hold / pause the work order (Execute -> Held).
   *
   * @param {string} actor - Discord user ID
   * @returns {{ success: boolean, from: string, to: string, error?: string }}
   */
  hold(actor) {
    return this.transition(State.HELD, actor);
  }

  /**
   * Resume a held work order (Held -> Execute).
   *
   * @param {string} actor - Discord user ID
   * @returns {{ success: boolean, from: string, to: string, error?: string }}
   */
  resume(actor) {
    return this.transition(State.EXECUTE, actor);
  }

  /**
   * Complete the work order (Execute -> Completing -> Complete).
   *
   * @param {string} actor - Discord user ID
   * @returns {{ success: boolean, from: string, to: string, error?: string }}
   */
  complete(actor) {
    const completingResult = this.transition(State.COMPLETING, actor);
    if (!completingResult.success) return completingResult;
    return this.transition(State.COMPLETE, actor);
  }

  /**
   * Abort the work order (any active state -> Aborting -> Aborted).
   *
   * @param {string} actor - Discord user ID
   * @returns {{ success: boolean, from: string, to: string, error?: string }}
   */
  abort(actor) {
    const abortResult = this.transition(State.ABORTING, actor);
    if (!abortResult.success) return abortResult;
    return this.transition(State.ABORTED, actor);
  }

  /**
   * Reset a completed or aborted work order back to Idle.
   *
   * @param {string} actor - Discord user ID
   * @returns {{ success: boolean, from: string, to: string, error?: string }}
   */
  reset(actor) {
    const resetResult = this.transition(State.RESETTING, actor);
    if (!resetResult.success) return resetResult;
    return this.transition(State.IDLE, actor);
  }

  /**
   * Get a summary of the work order.
   *
   * @returns {Object} Work order summary
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      description: this.description,
      state: this.state,
      transitions: this.history.length,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
