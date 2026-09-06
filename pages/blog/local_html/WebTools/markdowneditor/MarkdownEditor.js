console.log("DDS Markdown Editor loading...");

const DDS_LEARNED_WORDS_KEY = "ddsMarkdownEditor.learnedWords";
const DDS_SPELLCHECK_OWNER = "dds-spellcheck";

let ddsEditor = null;
let ddsDictionary = null;
let spellcheckTimer = null;
let spellcheckMenu = null;

const statusElement = document.getElementById("dds-status");
const downloadButton = document.getElementById("dds-download");
const clearButton = document.getElementById("dds-clear");
const previewElement = document.getElementById("dds-preview");
const fontDecreaseButton = document.getElementById("dds-font-decrease");
const fontIncreaseButton = document.getElementById("dds-font-increase");
const fontSizeElement = document.getElementById("dds-font-size");


const DDS_FONT_SIZE_KEY = "ddsMarkdownEditor.fontSize";

let ddsFontSize = Number(localStorage.getItem(DDS_FONT_SIZE_KEY)) || 100;



/* ============================================================
   View Rendering
   ============================================================ */
function renderPreview() {
    if (!ddsEditor || !previewElement) {
        return;
    }

    const markdown = ddsEditor.getValue();
    const renderedHtml = marked.parse(markdown);

    previewElement.innerHTML = DOMPurify.sanitize(renderedHtml);

    previewElement.querySelectorAll("pre code").forEach(codeBlock => {
        hljs.highlightElement(codeBlock);
    });
}


/* ============================================================
   Learned Words
   ============================================================ */

function getLearnedWords() {
    try {
        const stored = localStorage.getItem(DDS_LEARNED_WORDS_KEY);

        if (!stored) {
            return new Set();
        }

        const words = JSON.parse(stored);

        return new Set(
            words.map(word => word.toLowerCase())
        );
    } catch (error) {
        console.error("DDS: Failed to load learned words.", error);

        return new Set();
    }
}


function saveLearnedWords(words) {
    localStorage.setItem(
        DDS_LEARNED_WORDS_KEY,
        JSON.stringify([...words].sort())
    );
}


function learnWord(word) {
    if (!word) {
        return;
    }

    const learnedWords = getLearnedWords();

    learnedWords.add(word.toLowerCase());

    saveLearnedWords(learnedWords);

    console.log(`DDS learned word: ${word}`);

    runSpellcheck();
}


function clearLearnedWords() {
    localStorage.removeItem(DDS_LEARNED_WORDS_KEY);

    runSpellcheck();
}


/* ============================================================
   Dictionary
   ============================================================ */

async function loadDictionary() {
    statusElement.textContent = "Loading spellcheck dictionary...";

    const dictionaryBase = "https://cdn.jsdelivr.net/npm/dictionary-en@4.0.0";

    const affResponse = await fetch(`${dictionaryBase}/index.aff`);
    const dicResponse = await fetch(`${dictionaryBase}/index.dic`);

    if (!affResponse.ok || !dicResponse.ok) {
        throw new Error("Failed to load dictionary files.");
    }

    const affData = await affResponse.text();
    const dicData = await dicResponse.text();

    ddsDictionary = new Typo("en_US", affData, dicData);

    console.log("DDS: Dictionary loaded.");
    console.log("DDS: misspeled =", ddsDictionary.check("misspeled"));
    console.log("DDS: sentence =", ddsDictionary.check("sentence"));

    statusElement.textContent = "Spellcheck ready.";
}


/* ============================================================
   Spellcheck Rules
   ============================================================ */

function shouldCheckWord(word) {
    if (!word) {
        return false;
    }

    if (word.length <= 1) {
        return false;
    }

    if (/^\d+$/.test(word)) {
        return false;
    }

    if (/^[A-Z0-9_]+$/.test(word)) {
        return false;
    }

    if (/https?:\/\//i.test(word)) {
        return false;
    }

    return true;
}


function getWordsFromLine(line) {
    const words = [];
    const wordPattern = /[A-Za-z][A-Za-z'’-]*/g;

    let match;

    while ((match = wordPattern.exec(line)) !== null) {
        words.push({
            word: match[0],
            startIndex: match.index,
            endIndex: match.index + match[0].length
        });
    }

    return words;
}


/* ============================================================
   Marker Generation
   ============================================================ */

function getSpellcheckMarkers(model) {
    const markers = [];
    const learnedWords = getLearnedWords();

    let insideCodeFence = false;

    for (let lineNumber = 1; lineNumber <= model.getLineCount(); lineNumber++) {
        const line = model.getLineContent(lineNumber);
        const trimmed = line.trim();

        if (trimmed.startsWith("```")) {
            insideCodeFence = !insideCodeFence;
            continue;
        }

        if (insideCodeFence) {
            continue;
        }

        if (trimmed.startsWith("<!--")) {
            continue;
        }

        if (/^https?:\/\//i.test(trimmed)) {
            continue;
        }

        const words = getWordsFromLine(line);

        for (const wordInfo of words) {
            const word = wordInfo.word;
            const normalized = word.toLowerCase();

            if (!shouldCheckWord(word)) {
                continue;
            }

            if (learnedWords.has(normalized)) {
                continue;
            }

            if (ddsDictionary.check(word)) {
                continue;
            }

            const suggestions = ddsDictionary.suggest(word).slice(0, 5);

            let message = `Possible spelling mistake: "${word}"`;

            if (suggestions.length > 0) {
                message += `\nSuggestions: ${suggestions.join(", ")}`;
            }

            markers.push({
                severity: monaco.MarkerSeverity.Warning,
                message: message,
                startLineNumber: lineNumber,
                startColumn: wordInfo.startIndex + 1,
                endLineNumber: lineNumber,
                endColumn: wordInfo.endIndex + 1,
                source: "DDS Spellcheck",
                code: "spelling"
            });
        }
    }

    return markers;
}


/* ============================================================
   Spellcheck Execution
   ============================================================ */

function runSpellcheck() {
    if (!ddsEditor || !ddsDictionary) {
        return;
    }

    const model = ddsEditor.getModel();
    const markers = getSpellcheckMarkers(model);

    monaco.editor.setModelMarkers(
        model,
        DDS_SPELLCHECK_OWNER,
        markers
    );

    const learnedCount = getLearnedWords().size;

    statusElement.textContent = `${markers.length} spelling issue(s) · ${learnedCount} learned word(s)`;
}


function scheduleSpellcheck() {
    clearTimeout(spellcheckTimer);

    spellcheckTimer = setTimeout(
        runSpellcheck,
        250
    );
}


/* ============================================================
   Cursor Helpers
   ============================================================ */

function getWordAtCursor() {
    const model = ddsEditor.getModel();
    const position = ddsEditor.getPosition();

    if (!position) {
        return null;
    }

    const wordInfo = model.getWordAtPosition(position);

    if (!wordInfo) {
        return null;
    }

    return wordInfo.word;
}


/* ============================================================
   Spellcheck Context Menu
   ============================================================ */

function closeSpellcheckMenu() {
    if (!spellcheckMenu) {
        return;
    }

    spellcheckMenu.remove();
    spellcheckMenu = null;
}


function replaceWord(wordInfo, lineNumber, replacement) {
    const range = new monaco.Range(
        lineNumber,
        wordInfo.startColumn,
        lineNumber,
        wordInfo.endColumn
    );

    ddsEditor.executeEdits("dds-spellcheck", [
        {
            range: range,
            text: replacement,
            forceMoveMarkers: true
        }
    ]);

    ddsEditor.focus();
}


function createSpellcheckMenuItem(label, action) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "dds-spellcheck-menu-item";
    button.textContent = label;

    button.addEventListener("click", () => {
        closeSpellcheckMenu();
        action();
    });

    return button;
}


function showSpellcheckMenu(event) {
    event.preventDefault();
    closeSpellcheckMenu();

    if (!ddsEditor || !ddsDictionary) {
        return;
    }

    const target = ddsEditor.getTargetAtClientPoint(event.clientX, event.clientY);

    if (!target || !target.position) {
        return;
    }

    const model = ddsEditor.getModel();
    const position = target.position;
    const wordInfo = model.getWordAtPosition(position);

    if (!wordInfo) {
        return;
    }

    ddsEditor.setPosition(position);

    const word = wordInfo.word;
    const normalized = word.toLowerCase();
    const learnedWords = getLearnedWords();
    const isLearned = learnedWords.has(normalized);
    const isCorrect = ddsDictionary.check(word);
    const suggestions = !isLearned && !isCorrect ? ddsDictionary.suggest(word).slice(0, 5) : [];

    spellcheckMenu = document.createElement("div");
    spellcheckMenu.className = "dds-spellcheck-menu";

    const title = document.createElement("div");
    title.className = "dds-spellcheck-menu-title";
    title.textContent = word;

    spellcheckMenu.appendChild(title);

    if (suggestions.length > 0) {
        for (const suggestion of suggestions) {
            spellcheckMenu.appendChild(
                createSpellcheckMenuItem(suggestion, () => {
                    replaceWord(wordInfo, position.lineNumber, suggestion);
                })
            );
        }
    } else {
        const noSuggestions = document.createElement("div");
        noSuggestions.className = "dds-spellcheck-menu-empty";
        noSuggestions.textContent = "No suggestions";

        spellcheckMenu.appendChild(noSuggestions);
    }

    const separator = document.createElement("div");
    separator.className = "dds-spellcheck-menu-separator";

    spellcheckMenu.appendChild(separator);

    if (!isLearned) {
        spellcheckMenu.appendChild(
            createSpellcheckMenuItem(`Learn "${word}"`, () => {
                learnWord(word);
            })
        );
    }

    spellcheckMenu.appendChild(
        createSpellcheckMenuItem("Clear Learned Words", () => {
            clearLearnedWords();
        })
    );

    spellcheckMenu.style.left = `${event.clientX}px`;
    spellcheckMenu.style.top = `${event.clientY}px`;

    document.body.appendChild(spellcheckMenu);

    const menuBounds = spellcheckMenu.getBoundingClientRect();

    if (menuBounds.right > window.innerWidth) {
        spellcheckMenu.style.left = `${window.innerWidth - menuBounds.width - 8}px`;
    }

    if (menuBounds.bottom > window.innerHeight) {
        spellcheckMenu.style.top = `${window.innerHeight - menuBounds.height - 8}px`;
    }
}


function registerSpellcheckContextMenu() {
    const editorElement = document.getElementById("dds-monaco");

    editorElement.addEventListener("contextmenu", showSpellcheckMenu);

    document.addEventListener("click", closeSpellcheckMenu);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeSpellcheckMenu();
        }
    });

    window.addEventListener("resize", closeSpellcheckMenu);
}


/* ============================================================
   Monaco Initialization
   ============================================================ */

require.config({
    paths: {
        vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs"
    }
});


require(
    ["vs/editor/editor.main"],

    async function () {
        const startingMarkdown =
`# Intuition

<!-- Describe your first thoughts on how to solve this problem. -->

This sentnce has a misspeled wurd.

# Approach

<!-- Describe your approach to solving the problem. -->

The MarchHMI application communicates with the EPC.

# Complexity

- Time complexity:

- Space complexity:

# Code

\`\`\`swift
class Solution {

    func addBinary(_ a: String, _ b: String) -> String {
        return ""
    }

}
\`\`\`
`;

        ddsEditor = monaco.editor.create(
            document.getElementById("dds-monaco"),
            {
                value: startingMarkdown,
                language: "markdown",
                theme: "vs-dark",
                automaticLayout: true,
                wordWrap: "on",
                contextmenu: false,

                minimap: {
                    enabled: false
                },

                fontSize: 14,
                lineHeight: 22,

                padding: {
                    top: 16,
                    bottom: 16
                },

                scrollBeyondLastLine: false,
                renderWhitespace: "selection"
            }
        );

        registerSpellcheckContextMenu();

        ddsEditor.onDidChangeModelContent(() => {
            scheduleSpellcheck();
            renderPreview();
        });

        if (downloadButton) {
            downloadButton.addEventListener(
                "click",
                downloadMarkdown
            );
        }

        if (clearButton) {
            clearButton.addEventListener(
                "click",
                clearEditor
            );
        }

        if (fontDecreaseButton) {
            fontDecreaseButton.addEventListener("click", decreaseFontSize);
        }

        if (fontIncreaseButton) {
            fontIncreaseButton.addEventListener("click", increaseFontSize);
        }

        applyFontSize();
        renderPreview();

        try {
            await loadDictionary();
            runSpellcheck();
        } catch (error) {
            console.error("DDS spellcheck initialization failed:", error);

            if (statusElement) {
                statusElement.textContent = "Spellcheck failed to load.";
            }
        }
    }
);


/* ============================================================
   Font Size, Clear, Download Actions
   ============================================================ */

function clearEditor() {
    if (!ddsEditor) {
        return;
    }

    ddsEditor.setValue("");
    ddsEditor.focus();
}

function downloadMarkdown() {
    if (!ddsEditor) {
        return;
    }

    const markdown = ddsEditor.getValue();
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "DDS-Markdown.md";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
}

function applyFontSize() {
    const scale = ddsFontSize / 100;

    ddsEditor.updateOptions({
        fontSize: 14 * scale,
        lineHeight: 22 * scale
    });

    previewElement.style.setProperty("--dds-font-scale", scale);
    fontSizeElement.textContent = `${ddsFontSize}%`;

    localStorage.setItem(DDS_FONT_SIZE_KEY, ddsFontSize);
}

function decreaseFontSize() {
    ddsFontSize = Math.max(ddsFontSize - 10, 60);
    applyFontSize();
}

function increaseFontSize() {
    ddsFontSize = Math.min(ddsFontSize + 10, 160);
    applyFontSize();
}