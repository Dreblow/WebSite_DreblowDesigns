const hljs = require("highlight.js");
const MarkdownIt = require("markdown-it");

const md = new MarkdownIt();

// Open external links in new tab
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const href = token.attrGet('href');

    // Only external links (http or https)
    if (href && /^https?:\/\//.test(href)) {
        token.attrSet('target', '_blank');
        token.attrSet('rel', 'noopener noreferrer');
    }

    return self.renderToken(tokens, idx, options);
};

function renderCommandCard(head, header, footer, formattedVersion, content){
    let renderedContent = md.render(content);

    // Replace <h2>...</h2><pre><code class="language-bash">...</code></pre> blocks with .cards-container divs containing the h2 and a command-card div with a table for commands and descriptions
    renderedContent = renderedContent.replace(/(<h2>[\s\S]*?<\/h2>)\s*<pre><code class="language-bash">([\s\S]*?)<\/code><\/pre>/g, (match, h2, codeContent) => {
        // Split the content by lines and trim each line
        const lines = codeContent.trim().split('\n').filter(line => line.trim() !== '');
        let rows = [];
        for (let i = 0; i < lines.length; i++) {
            let desc = '';
            let cmd = '';
            if (lines[i].startsWith('#')) {
                desc = lines[i];
                cmd = lines[i+1] || '';
                i++;
            } else {
                desc = '';
                cmd = lines[i];
            }
            const highlightedDesc = desc ? hljs.highlight(desc, { language: "bash" }).value : "";
            const highlightedCmd = cmd ? hljs.highlight(cmd, { language: "bash" }).value : "";
            rows.push(`<tr><td class="desc"><code class="hljs language-bash">${highlightedDesc}</code></td><td class="cmd"><code class="hljs language-bash">${highlightedCmd}</code></td></tr>`);
        }
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

    return `<!DOCTYPE html>
<html lang="en">
${head}
<body>
    ${header}
    <main class="markdown-body">
        <article>
            <p><em class="blogVersion">Version: ${formattedVersion}</em></p>

            <div class="cards-flex-container">
                <div class="cards-container">
                ${renderedContent}
                </div>
            </div>
        </article>
    </main>
    ${footer}
</body>
</html>`;
}

module.exports = { renderCommandCard };