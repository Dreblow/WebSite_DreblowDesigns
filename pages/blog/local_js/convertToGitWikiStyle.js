const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const markdownItAnchor = require('markdown-it-anchor');

// Initialize Markdown-it with highlight.js
const md = new MarkdownIt({
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre><code class="hljs ${lang}">` +
                    hljs.highlight(str, { language: lang }).value +
                    `</code></pre>`;
            } catch (_) {}
        }

        return `<pre><code class="hljs">` + md.utils.escapeHtml(str) + `</code></pre>`;
    }
});

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

md.use(markdownItAnchor, { 
  slugify: s => s.trim().toLowerCase().replace(/\./g, '').replace(/[^\w]+/g, '-')
});


function renderGitWikiStyle(head, header, footer, formattedVersion, content){
    return `<!DOCTYPE html>
<html lang="en">
${head}
<body>
    ${header}
    <main class="markdown-body">
        <article>
            <p><em class="blogVersion">Version: ${formattedVersion}</em></p>
            ${md.render(content)}
        </article>
    </main>
    ${footer}
</body>
</html>`;
}

module.exports = { renderGitWikiStyle };