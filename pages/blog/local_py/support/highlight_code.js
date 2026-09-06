const path = require("path");

const localDevPath = path.resolve(
    __dirname,
    "../../../../local_dev"
);

const hljs = require(
    require.resolve(
        "highlight.js",
        { paths: [localDevPath] }
    )
);

let input = "";

process.stdin.setEncoding("utf8");

process.stdin.on("data", chunk => {
    input += chunk;
});

process.stdin.on("end", () => {
    const blocks = JSON.parse(input);

    const highlighted = blocks.map(block => {
        return hljs.highlight(
            block.code,
            { language: block.language }
        ).value;
    });

    process.stdout.write(
        JSON.stringify(highlighted)
    );
});