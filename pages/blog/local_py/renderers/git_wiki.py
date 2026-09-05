import re
import html
import json
import subprocess
import markdown

from pathlib import Path
from markdown.extensions.toc import TocExtension


SCRIPT_DIR = Path(__file__).resolve().parent

HIGHLIGHT_SCRIPT = (
    SCRIPT_DIR.parent
    / "support"
    / "highlight_code.js"
)


def slugify(value: str, separator: str) -> str:
    value = value.strip().lower()
    value = value.replace(".", "")

    value = re.sub(
        r"[^\w]+",
        separator,
        value,
    )

    return value.rstrip(separator)


def render(content: str, formatted_version: str = "") -> str:
    html = markdown.markdown(
        content,
        extensions=[
            "fenced_code",
            "tables",
            TocExtension(
                slugify=slugify,
            ),
        ]
    )

    html = highlight_code_blocks(html)
    html = open_external_links_in_new_tab(html)
    html = add_heading_tabindex(html)

    version_html = ""

    if formatted_version:
        version_html = (
            '<p><em class="blogVersion">'
            f'Version: {formatted_version}'
            '</em></p>\n'
        )

    return (
        '<main class="markdown-body git-wiki-section">\n'
        '    <article>\n'
        f'        {version_html}'
        f'{html}\n'
        '    </article>\n'
        '</main>'
    )


def open_external_links_in_new_tab(html: str) -> str:
    pattern = re.compile(
        r'<a href="(https?://[^"]+)"([^>]*)>'
    )

    def replace_link(match):
        href = match.group(1)
        attributes = match.group(2)

        if 'target=' in attributes:
            return match.group(0)

        return (
            f'<a href="{href}"'
            f'{attributes}'
            f' target="_blank"'
            f' rel="noopener noreferrer">'
        )

    return pattern.sub(
        replace_link,
        html,
    )


def add_heading_tabindex(html: str) -> str:
    return re.sub(
        r'<(h[1-6]) id="([^"]+)">',
        r'<\1 id="\2" tabindex="-1">',
        html,
    )


def highlight_code_blocks(content: str) -> str:
    pattern = re.compile(
        r'<pre><code class="language-([^"]+)">'
        r'([\s\S]*?)'
        r'</code></pre>'
    )

    matches = list(
        pattern.finditer(content)
    )

    if not matches:
        return content

    blocks = []

    for match in matches:
        blocks.append(
            {
                "language": match.group(1),
                "code": html.unescape(
                    match.group(2)
                ),
            }
        )

    result = subprocess.run(
        [
            "node",
            str(HIGHLIGHT_SCRIPT),
        ],
        input=json.dumps(blocks),
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        raise RuntimeError(
            "Highlight.js failed:\n"
            f"{result.stderr}"
        )

    highlighted_blocks = json.loads(
        result.stdout
    )

    replacements = []

    for match, highlighted in zip(
        matches,
        highlighted_blocks,
    ):
        language = match.group(1)

        replacement = (
            f'<pre><code class="hljs {language}">'
            f'{highlighted}'
            '</code></pre>'
        )

        replacements.append(
            (
                match.start(),
                match.end(),
                replacement,
            )
        )

    for start, end, replacement in reversed(
        replacements
    ):
        content = (
            content[:start]
            + replacement
            + content[end:]
        )

    return content