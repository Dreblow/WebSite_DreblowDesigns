from pathlib import Path

import frontmatter

from support.css import build_renderer_css
from support.paths import get_path_prefixes
from support.metadata import (
    build_canonical_url,
    build_json_ld,
    get_image,
)


# ---------------------------------------------------------
# Paths
# ---------------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
BLOG_DIR = SCRIPT_DIR.parent

INPUT_DIR = BLOG_DIR / "local_markdown"
OUTPUT_DIR = BLOG_DIR / "local_html"
TEMPLATE_FILE = SCRIPT_DIR / "templates" / "hello_blog.html"


# ---------------------------------------------------------
# Render Types
# ---------------------------------------------------------

GIT_WIKI_STYLE_BLOG = "git-wiki-style-blog"
COMMAND_CARD_ONE_ROW = "command-card-one-row"
COMMAND_CARD_TWO_ROW = "command-card-two-row"
BLANK_TEMPLATE = "blank-template"

SUPPORTED_RENDERERS = {
    GIT_WIKI_STYLE_BLOG,
    COMMAND_CARD_ONE_ROW,
    COMMAND_CARD_TWO_ROW,
    BLANK_TEMPLATE,
}


# ---------------------------------------------------------
# Main
# ---------------------------------------------------------

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for markdown_file in INPUT_DIR.rglob("*.md"):
        process_markdown_file(markdown_file)

    print("✅ Completed generating blog")


# ---------------------------------------------------------
# File Processing
# ---------------------------------------------------------

def process_markdown_file(markdown_file: Path):
    relative_path = markdown_file.relative_to(INPUT_DIR)

    output_file = (
        OUTPUT_DIR
        / relative_path.parent
        / f"{markdown_file.stem}.html"
    )

    output_file.parent.mkdir(parents=True, exist_ok=True)

    post = frontmatter.load(markdown_file)

    metadata = post.metadata
    markdown_content = post.content

    print()
    print(f"📄 Source: {markdown_file}")
    print(f"🎯 Output: {output_file}")

    sections = split_render_sections(markdown_content)

    root_path, blog_path = get_path_prefixes(
        output_file,
        OUTPUT_DIR,
    )

    renderer_css = build_renderer_css(
        sections,
        blog_path,
    )

    canonical_url = build_canonical_url(
        output_file,
        BLOG_DIR,
    )

    image = get_image(metadata)

    json_ld = build_json_ld(
        metadata,
        canonical_url,
        image,
    )

    template = load_template()

    template_values = {
        "title": metadata.get(
            "title",
            "Dreblow Designs Blog",
        ),
        "description": metadata.get(
            "description",
            "",
        ),
        "author": metadata.get(
            "author",
            "Derek Dreblow",
        ),
        "keywords": metadata.get(
            "keywords",
            "",
        ),
        "canonical_url": canonical_url,
        "image": image,
        "root_path": root_path,
        "blog_path": blog_path,
        "json_ld": json_ld,
        "renderer_css": renderer_css,
        "render_sections": "<!-- render sections TODO -->",
    }

    generated_html = fill_template(
        template,
        template_values,
    )

    print()
    print("=" * 80)
    print(f"GENERATED PAGE: {markdown_file.name}")
    print("=" * 80)
    print(generated_html)
    print("=" * 80)

    for section in sections:
        print(f"   ↳ renderer: {section['renderer']}")

    # Next step:
    #
    # 1. Load existing HTML if present
    # 2. Render each section
    # 3. Preserve blank-template sections
    # 4. Generate header/footer
    # 5. Write reconstructed HTML


# ---------------------------------------------------------
# Template Rendering
# ---------------------------------------------------------

def load_template():
    return TEMPLATE_FILE.read_text(encoding="utf-8")


def fill_template(template: str, values: dict[str, str]) -> str:
    html = template

    for key, value in values.items():
        placeholder = f"{{{{ {key} }}}}"

        lines = html.splitlines()

        for index, line in enumerate(lines):
            if placeholder not in line:
                continue

            indent = line[:len(line) - len(line.lstrip())]

            replacement = str(value).replace(
                "\n",
                f"\n{indent}"
            )

            lines[index] = line.replace(
                placeholder,
                replacement,
            )

        html = "\n".join(lines)

    return html


# ---------------------------------------------------------
# Render Section Parsing
# ---------------------------------------------------------

def split_render_sections(content: str):
    import re

    pattern = re.compile(
        r"<!--\s*render:\s*([a-zA-Z0-9-]+)\s*-->",
        re.IGNORECASE,
    )

    matches = list(pattern.finditer(content))

    sections = []

    if not matches:
        return [
            {
                "renderer": GIT_WIKI_STYLE_BLOG,
                "content": content.strip(),
            }
        ]

    for index, match in enumerate(matches):
        renderer = match.group(1)

        assert_supported_renderer(renderer)

        content_start = match.end()

        if index + 1 < len(matches):
            content_end = matches[index + 1].start()
        else:
            content_end = len(content)

        section_content = content[
            content_start:content_end
        ].strip()

        sections.append(
            {
                "renderer": renderer,
                "content": section_content,
            }
        )

    return sections


# ---------------------------------------------------------
# Validation
# ---------------------------------------------------------

def assert_supported_renderer(renderer: str):
    if renderer not in SUPPORTED_RENDERERS:
        supported = "\n".join(
            f"- {name}"
            for name in sorted(SUPPORTED_RENDERERS)
        )

        raise ValueError(
            f"Unsupported renderer: {renderer}\n\n"
            f"Supported renderers:\n{supported}"
        )


# ---------------------------------------------------------
# Entry Point
# ---------------------------------------------------------

if __name__ == "__main__":
    main()