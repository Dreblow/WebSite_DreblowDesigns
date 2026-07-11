const hljs = require("highlight.js");
const MarkdownIt = require("markdown-it");

const md = new MarkdownIt();

// Open external links in new tab
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const href = token.attrGet('href');

    if (href && /^https?:\/\//.test(href)) {
        token.attrSet('target', '_blank');
        token.attrSet('rel', 'noopener noreferrer');
    }

    return self.renderToken(tokens, idx, options);
};

function renderCommandCardOneRow(formattedVersion, content) {
    let renderedContent = md.render(content);

    renderedContent = renderedContent.replace(/(<h2>[\s\S]*?<\/h2>)\s*<pre><code class="language-bash">([\s\S]*?)<\/code><\/pre>/g, (match, h2, codeContent) => {
        const lines = codeContent.trim().split('\n').filter(line => line.trim() !== '');

        const rows = lines.map(line => {
            const highlightedLine = hljs.highlight(line, { language: "bash" }).value;

            return `<tr><td class="cmd"><code class="hljs language-bash">${highlightedLine}</code></td></tr>`;
        });

        return `
<div class="card-container">
  <div class="title-container">
    ${h2}
  </div>
  <div class="info-container">
    <table class="command-table">
      ${rows.join('')}
    </table>
  </div>
</div>
`;
    });

    return `
<main class="markdown-body command-card-section">
    <article>
        ${formattedVersion ? `<p><em class="blogVersion">Version: ${formattedVersion}</em></p>` : ""}

        <div class="cards-flex-container">
            <div class="cards-container">
                ${renderedContent}
            </div>
        </div>
    </article>
</main>`;
}

module.exports = { renderCommandCardOneRow };