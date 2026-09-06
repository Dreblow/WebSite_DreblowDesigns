GIT_WIKI_STYLE_BLOG = "git-wiki-style-blog"
COMMAND_CARD_ONE_ROW = "command-card-one-row"
COMMAND_CARD_TWO_ROW = "command-card-two-row"


def get_required_css_files(sections) -> list[str]:
    css_files = []

    uses_git_wiki = any(
        section["renderer"] == GIT_WIKI_STYLE_BLOG
        for section in sections
    )

    uses_command_card = any(
        section["renderer"] in {
            COMMAND_CARD_ONE_ROW,
            COMMAND_CARD_TWO_ROW,
        }
        for section in sections
    )

    if uses_git_wiki:
        css_files.append("git-wiki-style-blog")

    if uses_command_card:
        css_files.append("command-card-blog")

    return css_files


def build_renderer_css(sections) -> str:
    css_files = get_required_css_files(
        sections
    )

    return "\n".join(
        (
            '<link rel="stylesheet" '
            f'href="/pages/blog/local_css/{css_file}.css?v=3">'
        )
        for css_file in css_files
    )