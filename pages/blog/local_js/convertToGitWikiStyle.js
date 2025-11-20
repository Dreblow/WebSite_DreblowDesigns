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