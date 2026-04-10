#!/usr/bin/env node
/**
 * ACG White Paper Page Generator
 *
 * Generates local white paper HTML pages from a papers data file.
 * Each page uses main.css and follows the charter site template.
 *
 * Usage: node scripts/generate-papers.js
 */

const fs = require('fs');
const path = require('path');

const PAPERS_DATA = require('./papers-data.json');
const OUTPUT_DIR = path.join(__dirname, '..');

function generatePage(paper) {
  const metaBadges = (paper.meta || []).map(m => `                <span>${esc(m)}</span>`).join('\n');
  const navLinks = (paper.nav || []).map(n => `            <a href="#${slugify(n)}">${esc(n)}</a>`).join('\n');

  const sections = (paper.sections || []).map(s => {
    let html = `        <section class="section" id="${slugify(s.title)}">\n`;
    html += `            <h2>${esc(s.title)}</h2>\n`;
    if (s.content) {
      s.content.forEach(block => {
        if (block.type === 'p') {
          html += `            <p>${block.text}</p>\n`;
        } else if (block.type === 'h3') {
          html += `            <h3>${esc(block.text)}</h3>\n`;
        } else if (block.type === 'pre') {
          html += `<pre>${esc(block.text)}</pre>\n`;
        } else if (block.type === 'ul') {
          html += `            <ul>\n`;
          block.items.forEach(li => { html += `                <li>${li}</li>\n`; });
          html += `            </ul>\n`;
        }
      });
    }
    html += `        </section>\n`;
    return html;
  }).join('\n');

  const closingLines = (paper.closing || []).map(l => `                <p><strong>${esc(l)}</strong></p>`).join('\n');
  const closingMark = paper.closing_mark || '&#9874; ACG &#9874;';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(paper.title)} - AI Craftspeople Guild</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Work+Sans:wght@300;400;600&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="main.css">
</head>
<body>
    <header>
        <div class="container">
            <div class="guild-mark">
                <div class="emblem">&#9874; ACG &#9874;</div>
            </div>
            <p class="eyebrow">${esc(paper.type || 'White paper')}</p>
            <h1>${esc(paper.title)}</h1>
            <p class="subtitle">${esc(paper.subtitle || '')}</p>
            <div class="article-meta">
${metaBadges}
            </div>
            <div class="back-link">
                <a href="white-papers.html">&larr; Back to White Papers</a>
            </div>
        </div>
    </header>

    <div class="container">
        <article class="article-shell">
            <nav class="article-nav">
${navLinks}
            </nav>

            <div class="lead">
                <p><strong>${paper.lead_quote ? '&ldquo;' + esc(paper.lead_quote) + '&rdquo;' : ''}</strong></p>
${paper.lead_text ? '                <p>' + paper.lead_text + '</p>' : ''}
            </div>

${sections}
${closingLines ? `            <div class="closing-statement">
${closingLines}
                <p class="paper-mark">${closingMark}</p>
            </div>` : ''}
        </article>

        <div class="cta-section">
            <h2>Read the White Papers</h2>
            <p>This paper joins the Guild's publications on AI-assisted software engineering, institutional safeguards, and risk.</p>
            <div class="cta-buttons">
                <a href="white-papers.html" class="btn btn-secondary">Back to White Papers</a>
                <a href="index.html" class="btn btn-secondary">Back to Home</a>
            </div>
        </div>
    </div>

    <footer>
        <div class="container">
            <p><strong>AI Craftspeople Guild (ACG)</strong></p>
            <p>Advocating for professional standards in AI-assisted software development</p>
            <a href="https://github.com/aicraftspeopleguild" class="github-link">&#9889; github.com/aicraftspeopleguild</a>
            <p style="margin-top:2rem;opacity:0.6">&copy; 2026 AI Craftspeople Guild. Committed to quality, integrity, and human-centered AI.</p>
        </div>
    </footer>
</body>
</html>`;
}

function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Generate all pages
let count = 0;
for (const paper of PAPERS_DATA) {
  const html = generatePage(paper);
  const outPath = path.join(OUTPUT_DIR, paper.filename);
  fs.writeFileSync(outPath, html);
  console.log(`Generated: ${paper.filename}`);
  count++;
}

console.log(`\nDone. Generated ${count} white paper pages.`);
