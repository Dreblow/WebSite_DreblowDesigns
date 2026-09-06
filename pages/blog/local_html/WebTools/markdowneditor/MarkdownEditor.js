console.log("DDS Markdown Editor loading...");

const DDS_LEARNED_WORDS_KEY = "ddsMarkdownEditor.learnedWords";
const DDS_SPELLCHECK_OWNER = "dds-spellcheck";

let ddsEditor = null;
let ddsDictionary = null;
let spellcheckTimer = null;

const statusElement = document.getElementById("dds-status");
const clearLearnedButton = document.getElementById("dds-clear-learned");
const previewElement = document.getElementById("dds-preview");



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

    const [affResponse, dicResponse] = await Promise.all([
        fetch(`${dictionaryBase}/index.aff`),
        fetch(`${dictionaryBase}/index.dic`)
    ]);

    if (!affResponse.ok || !dicResponse.ok) {
        throw new Error("Failed to load Hunspell dictionary.");
    }

    const [affData, dicData] = await Promise.all([
        affResponse.text(),
        dicResponse.text()
    ]);

    ddsDictionary = new Typo("en_US", affData, dicData);

    console.log("DDS: Dictionary loaded.");

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
   Monaco Actions
   ============================================================ */

function registerEditorActions() {
    ddsEditor.addAction({
        id: "dds-learn-word",
        label: "DDS: Learn Word",
        contextMenuGroupId: "navigation",
        contextMenuOrder: 1.5,

        run: function () {
            const word = getWordAtCursor();

            if (!word) {
                return;
            }

            learnWord(word);
        }
    });
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

        renderPreview();

        registerEditorActions();

        ddsEditor.onDidChangeModelContent(() => {
            scheduleSpellcheck();
            renderPreview();
        });

        if (clearLearnedButton) {
            clearLearnedButton.addEventListener(
                "click",
                clearLearnedWords
            );
        }

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