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
            const decodedLine = decodeHtmlEntities(line).trim();

            if (decodedLine.startsWith('>')) {
                const noteText = decodedLine.replace(/^>\s*/, '');

                return `
                    <tr>
                    <td class="cmd one-row command-card-note">
                        <blockquote>${escapeHtml(noteText)}</blockquote>
                    </td>
                    </tr>`;
            }
            const renderedLine = renderOneRowLine(decodedLine);
            return `<tr><td class="cmd one-row"><code class="hljs language-bash">${renderedLine}</code></td></tr>`;
        });

        return `
            <div class="card-container">
            <div class="title-container">
                ${h2}
            </div>
            <div class="info-container">
                <table class="command-table command-table-one-row">
                ${rows.join('')}
                </table>
            </div>
            </div>
            `;
    });

    return `
<main class="markdown-body command-card-section command-card-one-row-section">
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

function decodeHtmlEntities(value) {
    return String(value)
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function renderOneRowLine(line) {
    const escapedLine = escapeHtml(line);

    return escapedLine
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<span class="inline-code">$1</span>');
}

module.exports = { renderCommandCardOneRow };