from pathlib import Path
import shutil


def copy_support_files(
    markdown_file: Path,
    input_dir: Path,
    output_dir: Path,
):
    source_dir = markdown_file.parent
    relative_dir = source_dir.relative_to(
        input_dir
    )

    destination_dir = (
        output_dir
        / relative_dir
    )

    for item in source_dir.iterdir():
        if item.suffix.lower() == ".md":
            continue

        destination = (
            destination_dir
            / item.name
        )

        if item.is_dir():
            shutil.copytree(
                item,
                destination,
                dirs_exist_ok=True,
            )
        else:
            shutil.copy2(
                item,
                destination,
            )