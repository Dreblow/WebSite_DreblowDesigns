import html
import re

import markdown


def render(
    content: str,
    formatted_version: str = "",
) -> str:
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
        '<main class="markdown-body command-card-section '
        'command-card-one-row-section">\n'
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

        for line in lines:
            if line.startswith(">"):
                note_text = re.sub(
                    r"^>\s*",
                    "",
                    line,
                )

                rows.append(
                    '<tr>'
                    '<td class="cmd one-row command-card-note">'
                    f'<blockquote>{html.escape(note_text)}</blockquote>'
                    '</td>'
                    '</tr>'
                )

                continue

            rendered_line = render_one_row_line(
                line
            )

            rows.append(
                '<tr>'
                '<td class="cmd one-row">'
                '<code class="hljs language-bash">'
                f'{rendered_line}'
                '</code>'
                '</td>'
                '</tr>'
            )

        return (
            '<div class="card-container">\n'
            '  <div class="title-container">\n'
            f'    {heading}\n'
            '  </div>\n'
            '  <div class="info-container">\n'
            '    <table class="command-table command-table-one-row">\n'
            f'      {"".join(rows)}\n'
            '    </table>\n'
            '  </div>\n'
            '</div>'
        )

    return pattern.sub(
        replace_card,
        content,
    )


def render_one_row_line(line: str) -> str:
    escaped_line = html.escape(
        line,
        quote=True,
    )

    escaped_line = re.sub(
        r"\*\*([^*]+)\*\*",
        r"<strong>\1</strong>",
        escaped_line,
    )

    escaped_line = re.sub(
        r"`([^`]+)`",
        r'<span class="inline-code">\1</span>',
        escaped_line,
    )

    return escaped_line


def open_external_links_in_new_tab(html_content: str) -> str:
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