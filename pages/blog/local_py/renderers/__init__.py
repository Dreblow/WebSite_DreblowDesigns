from .git_wiki import render as render_git_wiki
from .command_card_one_row import render as render_command_card_one_row
from .command_card_two_row import render as render_command_card_two_row


GIT_WIKI_STYLE_BLOG = "git-wiki-style-blog"
COMMAND_CARD_ONE_ROW = "command-card-one-row"
COMMAND_CARD_TWO_ROW = "command-card-two-row"
BLANK_TEMPLATE = "blank-template"


def render_section(section: dict, formatted_version: str = "") -> str:
    renderer = section["renderer"]
    content = section["content"]

    if renderer == GIT_WIKI_STYLE_BLOG:
        body = render_git_wiki(
            content,
            formatted_version,
        )

    elif renderer == COMMAND_CARD_ONE_ROW:
        body = render_command_card_one_row(
            content,
            formatted_version,
        )

    elif renderer == COMMAND_CARD_TWO_ROW:
        body = render_command_card_two_row(
            content,
            formatted_version,
        )

    elif renderer == BLANK_TEMPLATE:
        body = ""

    else:
        raise ValueError(
            f"Unsupported renderer: {renderer}"
        )

    return (
        f"<!-- DDS:RENDER:{renderer}:START -->\n"
        f"{body}\n"
        f"<!-- DDS:RENDER:{renderer}:END -->"
    )