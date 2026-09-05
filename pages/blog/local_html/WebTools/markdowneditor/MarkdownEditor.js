const markdownInput =
    document.getElementById("markdown-input");

const markdownPreview =
    document.getElementById("markdown-preview");

const clearButton =
    document.getElementById("clear-markdown");


function renderMarkdown() {
    const markdown =
        markdownInput.value;

    const renderedHtml =
        marked.parse(markdown);

    markdownPreview.innerHTML =
        DOMPurify.sanitize(renderedHtml);
}


markdownInput.addEventListener(
    "input",
    renderMarkdown
);


clearButton.addEventListener(
    "click",
    () => {
        markdownInput.value = "";
        renderMarkdown();
        markdownInput.focus();
    }
);


markdownInput.value =
`# Hello Markdown!

Start typing on the **left**.

Your rendered Markdown will appear on the right.

## Code

\`\`\`swift
func hello() {
    print("Hello from Dreblow Designs!")
}
\`\`\`
`;

renderMarkdown();