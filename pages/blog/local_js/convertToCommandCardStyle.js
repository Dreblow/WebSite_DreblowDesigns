import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

export function renderCommandCard(head, header, footer, formattedVersion, content){
    let renderedContent = md.render(content);

    // Replace <pre><code class="language-bash">...</code></pre> blocks with .command-card divs for each command line
    renderedContent = renderedContent.replace(/<pre><code class="language-bash">([\s\S]*?)<\/code><\/pre>/g, (match, p1) => {
        // Split the content by lines and trim each line
        const lines = p1.trim().split('\n');
        // Wrap each line in a div with class command-card
        const commandCards = lines.map(line => `<div class="command-card">${line}</div>`).join('');
        return commandCards;
    });

    return `<!DOCTYPE html>
<html lang="en">
${head}
<body>
    ${header}
    <main class="markdown-body">
        <article>
            <p><em class="blogVersion">Version: ${formattedVersion}</em></p>
            ${renderedContent}
        </article>
    </main>
    ${footer}
</body>
</html>`;
}