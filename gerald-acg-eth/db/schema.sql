-- Gerald L4 Prosthetic — SQLite Schema
-- ACG x ETH x ISA-95

-- Signatories: users who have signed the charter
CREATE TABLE IF NOT EXISTS signatories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    discord_id  TEXT    NOT NULL UNIQUE,
    username    TEXT    NOT NULL,
    role_tier   TEXT    NOT NULL DEFAULT 'L0',  -- L0 Apprentice .. L4 Elder
    signed_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    revoked_at  TEXT,
    notes       TEXT
);

-- Audit log: every significant Gerald action
CREATE TABLE IF NOT EXISTS audit_log (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ts          TEXT    NOT NULL DEFAULT (datetime('now')),
    actor       TEXT    NOT NULL,               -- discord_id or 'gerald'
    action      TEXT    NOT NULL,               -- e.g. 'ring_check', 'reflex_fire', 'eth_translate'
    target      TEXT,                           -- message id, channel id, user id
    ring_id     TEXT,                           -- which ring triggered, if any
    reflex_id   TEXT,                           -- which reflex fired, if any
    input_hash  TEXT,                           -- SHA-256 of input (privacy)
    result      TEXT,                           -- pass | fail | escalate | refuse
    detail      TEXT,                           -- JSON blob with extra context
    channel_id  TEXT,
    guild_id    TEXT
);

-- Work orders: PackML state machine (ISA-88 / ISA-95)
CREATE TABLE IF NOT EXISTS work_orders (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    wo_id       TEXT    NOT NULL UNIQUE,        -- human-readable work order ID
    title       TEXT    NOT NULL,
    description TEXT,
    state       TEXT    NOT NULL DEFAULT 'Idle', -- PackML states
    requestor   TEXT    NOT NULL,               -- discord_id
    assignee    TEXT,                           -- discord_id
    priority    INTEGER NOT NULL DEFAULT 3,     -- 1 (critical) .. 5 (info)
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    completed_at TEXT,
    metadata    TEXT                            -- JSON blob
);

-- Alarms: ISA-18.2 alarm management log
CREATE TABLE IF NOT EXISTS alarms (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ts          TEXT    NOT NULL DEFAULT (datetime('now')),
    channel_id  TEXT    NOT NULL,
    guild_id    TEXT    NOT NULL,
    alarm_type  TEXT    NOT NULL,               -- flood | stale | suppressed | shelved
    severity    TEXT    NOT NULL DEFAULT 'low', -- critical | high | medium | low
    source      TEXT,                           -- what triggered the alarm
    message     TEXT,                           -- alarm description
    state       TEXT    NOT NULL DEFAULT 'active', -- active | acknowledged | cleared | shelved
    ack_by      TEXT,                           -- discord_id who acknowledged
    ack_at      TEXT,
    cleared_at  TEXT,
    metadata    TEXT                            -- JSON blob
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_ts        ON audit_log(ts);
CREATE INDEX IF NOT EXISTS idx_audit_actor     ON audit_log(actor);
CREATE INDEX IF NOT EXISTS idx_audit_action    ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_wo_state        ON work_orders(state);
CREATE INDEX IF NOT EXISTS idx_wo_requestor    ON work_orders(requestor);
CREATE INDEX IF NOT EXISTS idx_alarms_channel  ON alarms(channel_id);
CREATE INDEX IF NOT EXISTS idx_alarms_state    ON alarms(state);
CREATE INDEX IF NOT EXISTS idx_alarms_ts       ON alarms(ts);
