import re

import markdown
from markdown.extensions.toc import TocExtension


def slugify(value: str, separator: str) -> str:
    value = value.strip().lower()
    value = value.replace(".", "")
    value = re.sub(r"[^\w]+", "-", value)

    return value.strip("-")


def render(content: str, formatted_version: str = "") -> str:
    html = markdown.markdown(
        content,
        extensions=[
            "fenced_code",
            "codehilite",
            "tables",
            TocExtension(
                slugify=slugify,
            ),
        ],
        extension_configs={
            "codehilite": {
                "guess_lang": False,
                "css_class": "highlight",
            },
        },
    )

    html = open_external_links_in_new_tab(html)

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