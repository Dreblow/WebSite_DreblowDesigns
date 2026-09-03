from pathlib import Path
import frontmatter


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