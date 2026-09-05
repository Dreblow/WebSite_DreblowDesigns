const ddsInput =
    document.getElementById("dds-input");

const ddsMirror =
    document.getElementById("dds-mirror");


function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}


function highlightInlineMarkdown(line) {
    let html = escapeHtml(line);

    // Inline code
    html = html.replace(
        /`([^`]+)`/g,
        '<span class="dds-inline-code">`$1`</span>'
    );

    // Bold
    html = html.replace(
        /\*\*([^*]+)\*\*/g,
        '<span class="dds-bold">**$1**</span>'
    );

    // Markdown links
    html = html.replace(
        /(\[[^\]]+\]\([^)]+\))/g,
        '<span class="dds-link">$1</span>'
    );

    return html;
}


function highlightMarkdown(markdown) {
    const lines = markdown.split("\n");

    let inCodeBlock = false;

    return lines.map(line => {
        const trimmed =
            line.trimStart();


        // Fenced code marker
        if (trimmed.startsWith("```")) {
            inCodeBlock = !inCodeBlock;

            return (
                '<span class="dds-code-fence">'
                + escapeHtml(line)
                + '</span>'
            );
        }


        // Anything inside fenced code
        if (inCodeBlock) {
            return (
                '<span class="dds-code">'
                + escapeHtml(line)
                + '</span>'
            );
        }


        // HTML / Markdown comments
        if (
            trimmed.startsWith("<!--")
            && trimmed.endsWith("-->")
        ) {
            return (
                '<span class="dds-comment">'
                + escapeHtml(line)
                + '</span>'
            );
        }


        // Headings
        if (/^#{1,6}\s/.test(trimmed)) {
            return (
                '<span class="dds-heading">'
                + highlightInlineMarkdown(line)
                + '</span>'
            );
        }


        // Block quotes
        if (trimmed.startsWith(">")) {
            return (
                '<span class="dds-quote">'
                + highlightInlineMarkdown(line)
                + '</span>'
            );
        }


        // Lists
        if (
            /^[-*+]\s/.test(trimmed)
            || /^\d+\.\s/.test(trimmed)
        ) {
            return (
                '<span class="dds-list">'
                + highlightInlineMarkdown(line)
                + '</span>'
            );
        }


        return highlightInlineMarkdown(line);
    }).join("\n");
}


function updateMirror() {
    ddsMirror.innerHTML =
        highlightMarkdown(
            ddsInput.value
        );

    syncMirrorScroll();
}


function syncMirrorScroll() {
    ddsMirror.scrollTop =
        ddsInput.scrollTop;

    ddsMirror.scrollLeft =
        ddsInput.scrollLeft;
}


ddsInput.addEventListener(
    "input",
    updateMirror
);


ddsInput.addEventListener(
    "scroll",
    syncMirrorScroll
);


ddsInput.value =
`# Intuition

<!-- Describe your first thoughts on how to solve this problem. -->

## Approach

Write your **Markdown** here.

- This is a list
- This has \`inline code\`

[LeetCode](https://leetcode.com)

> This is a quote

## Code

\`\`\`swift
class Solution {
    func hello() {
        print("Hello DDS-Mirror!")
    }
}
\`\`\`

This wurd should still get native spellcheck.
`;


updateMirror();