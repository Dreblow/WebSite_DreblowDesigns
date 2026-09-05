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

const input = process.argv[2] || "";

const result = hljs.highlight(
    input,
    { language: "bash" }
);

process.stdout.write(result.value);