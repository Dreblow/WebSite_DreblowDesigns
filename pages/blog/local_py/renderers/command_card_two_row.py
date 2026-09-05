import html
import re

import markdown
import subprocess
from pathlib import Path

from pygments import lex
from pygments.lexers.shell import BashLexer
from pygments.token import (
    Comment,
    Keyword,
    Name,
    Number,
    Operator,
    String,
)


SCRIPT_DIR = Path(__file__).resolve().parent
HIGHLIGHT_SCRIPT = (
    SCRIPT_DIR.parent
    / "support"
    / "highlight_bash.js"
)


def render(content: str, formatted_version: str = "") -> str:
    rendered_content = markdown.markdown(
        content,
        extensions=[
            "fenced_code",
        ],
    )

    rendered_content = convert_command_cards(
        rendered_content
    )

    rendered_content = open_external_links_in_new_tab(
        rendered_content
    )

    version_html = ""

    if formatted_version:
        version_html = (
            '<p><em class="blogVersion">'
            f'Version: {formatted_version}'
            '</em></p>'
        )

    return (
        '<main class="markdown-body command-card-section">\n'
        '    <article>\n'
        f'        {version_html}\n\n'
        '        <div class="cards-flex-container">\n'
        '            <div class="cards-container">\n'
        f'                {rendered_content}\n'
        '            </div>\n'
        '        </div>\n'
        '    </article>\n'
        '</main>'
    )


def convert_command_cards(content: str) -> str:
    pattern = re.compile(
        r'(<h2>[\s\S]*?</h2>)\s*'
        r'<pre><code class="language-bash">'
        r'([\s\S]*?)'
        r'</code></pre>'
    )

    def replace_card(match):
        heading = match.group(1)

        code_content = html.unescape(
            match.group(2)
        )

        lines = [
            line.strip()
            for line in code_content.splitlines()
            if line.strip()
        ]

        rows = []

        index = 0

        while index < len(lines):
            description = ""
            command = ""

            if lines[index].startswith("#"):
                description = lines[index]

                if index + 1 < len(lines):
                    command = lines[index + 1]

                index += 2

            else:
                command = lines[index]
                index += 1

            rows.append(
                build_row(
                    description,
                    command,
                )
            )

        return (
            '<div class="card-container">\n'
            '  <div class="title-container">\n'
            f'    {heading}\n'
            '  </div>\n'
            '  <div class="info-container">\n'
            '    <table class="command-table">\n'
            f'      {"".join(rows)}\n'
            '    </table>\n'
            '  </div>\n'
            '</div>'
        )

    return pattern.sub(
        replace_card,
        content,
    )


def build_row(description: str, command: str) -> str:
    highlighted_description = highlight_bash(
        description
    )

    highlighted_command = highlight_bash(
        command
    )

    return (
        '<tr>'
        '<td class="desc">'
        '<code class="hljs language-bash">'
        f'{highlighted_description}'
        '</code>'
        '</td>'
        '<td class="cmd">'
        '<code class="hljs language-bash">'
        f'{highlighted_command}'
        '</code>'
        '</td>'
        '</tr>'
    )


def highlight_bash(text: str) -> str:
    if not text:
        return ""

    result = subprocess.run(
        [
            "node",
            str(HIGHLIGHT_SCRIPT),
            text,
        ],
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        raise RuntimeError(
            "Highlight.js failed:\n"
            f"{result.stderr}"
        )

    return result.stdout


def get_highlight_class(
    token_type,
) -> str | None:
    if token_type in Comment:
        return "hljs-comment"

    if token_type in Name.Builtin:
        return "hljs-built_in"

    if token_type in Name.Function:
        return "hljs-title"

    if token_type in Name.Variable:
        return "hljs-variable"

    if token_type in Keyword:
        return "hljs-keyword"

    if token_type in String:
        return "hljs-string"

    if token_type in Number:
        return "hljs-number"

    if token_type in Operator:
        return "hljs-operator"

    return None


def open_external_links_in_new_tab(
    html_content: str,
) -> str:
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
        html_content,
    )