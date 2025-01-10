// // API Key setup - Make sure to use your API Key 
// const MY_GEMINI_API_KEY = ""; // Get it for free at https://aistudio.google.com/app/apikey

// let is_busy = false;
// let model = 'gemini-1.5-flash';
// let tot_generation = 0; // Keeps track of the number of generations

// // List of all supported languages, including regional Indian languages
// const all_languages = {
//     en: 'English',
//     hi: 'Hindi',
//     bn: 'Bengali',
//     pa: 'Punjabi',
//     ur: 'Urdu',
//     ta: 'Tamil',
//     te: 'Telugu',
//     kn: 'Kannada',
//     ml: 'Malayalam',
//     mr: 'Marathi',
//     gu: 'Gujarati',
//     or: 'Odia',
//     as: 'Assamese',
//     kok: 'Konkani',
//     pt: 'Portuguese',
//     es: 'Spanish',
//     fr: 'French',
//     de: 'German',
//     ja: 'Japanese',
//     zh: 'Chinese',
//     ru: 'Russian',
//     ar: 'Arabic',
//     ko: 'Korean'
// };

// if (MY_GEMINI_API_KEY === "") {
//     showResult("<h2 class='warning'>API Key not set up! Please add your API key.</h2>");
// }

// // Detecting the browser's language
// let lang_code = navigator.language.substring(0, 2);
// let browser_lang = all_languages[lang_code] ?? 'the same language as the text';
// let generated_content = '';
// let page_content = '';

// // Markdown converter for better formatting
// showdown.setFlavor('github');
// let converter = new showdown.Converter();

// function start() {
//     $(document).ready(function () {
//         window.onkeydown = (event) => {
//             let is_input_area = ['TEXTAREA', 'INPUT'].includes(document.activeElement.tagName);
//             if (!is_input_area) {
//                 is_input_area = document.activeElement.isContentEditable;
//             }
//             if (event.key === 'q' && event.ctrlKey && !is_input_area) {
//                 if (!is_busy) {
//                     page_content = getReadableContent();
//                     showResult('Generating summary, please wait...', 2, 'ext_generating');
//                     let prompt = `Provide a detailed summary of the text: <text>${page_content}</text>. The summary should be in ${browser_lang}.`;
//                     summarize(prompt);
//                 } else {
//                     showResult('Currently busy generating a summary. Please wait!', 2, 'ext_generating');
//                 }
//             }
//         };
//     });
// }

// function getReadableContent() {
//     if (document.URL.includes("wikipedia.org")) {
//         // Extract the main content area on Wikipedia
//         let content = document.querySelector("#mw-content-text").innerText;
//         let title = document.querySelector("#firstHeading").innerText;
//         return `<h1>${title}</h1>\n<article>${content}</article>`;
//     } else {
//         let documentClone = document.cloneNode(true);
//         let parsed = new Readability(documentClone).parse();
//         let content = stripHtml(parsed.content);
//         let title = stripHtml(parsed.title);
//         return `<h1>${title}</h1>\n<article>${content}</article>`;
//     }
// }

// function stripHtml(html) {
//     const tmp = document.createElement('div');
//     tmp.innerHTML = html;
//     return tmp.textContent || tmp.innerText || '';
// }

// document.onreadystatechange = (() => {
//     let r_state = document.readyState;
//     if (r_state === "complete" || r_state === "interactive") {
//         start();
//     }
// });

// function summarize(prompt) {
//     if (!is_busy) {
//         is_busy = true;

//         // Character limit for content to prevent large inputs
//         const MAX_CONTENT_LENGTH = 10000;
//         prompt = prompt.length > MAX_CONTENT_LENGTH ? prompt.substring(0, MAX_CONTENT_LENGTH) + "..." : prompt;

//         const data = {
//             "contents": [{
//                 "parts": [{
//                     "text": prompt
//                 }]
//             }],
//             safetySettings: [
//                 { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
//                 { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
//                 { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
//                 { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
//             ],
//             generationConfig: {
//                 "maxOutputTokens": 10000000, // Reasonable token limit
//                 "temperature": 0.9
//             }
//         };

//         let endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${MY_GEMINI_API_KEY}`;

//         fetch(endpoint, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         })
//             .then(response => response.json())
//             .then(data => {
//                 tot_generation++;
//                 generated_content = ''; // Clear cached content to avoid reuse
//                 showResult(data);
//             })
//             .catch(error => {
//                 showResult(`Error occurred: ${error.message || JSON.stringify(error)}`);
//             }).finally(() => {
//                 is_busy = false;
//             });
//     }
// }

// function showResult(result, duration = 0, class_name = '') {
//     let old_result = document.querySelector("#ext_summary");
//     if (old_result) {
//         old_result.remove();
//     }

//     let ele = document.createElement('div');
//     ele.id = 'ext_summary';
//     let close = document.createElement('div');
//     close.id = 'ext_close_summary';
//     close.addEventListener('click', () => {
//         ele.remove();
//     });

//     if (duration >= 1) {
//         duration = duration * 1000;
//         setTimeout(() => {
//             ele.remove();
//         }, duration);
//     }

//     let text = '';
//     if (typeof result === "object") {
//         try {
//             if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts[0]) {
//                 text = result.candidates[0].content.parts[0].text;
//                 text = converter.makeHtml(text);
//             } else {
//                 text = "Error: Unable to process API response. Debug Info: " + JSON.stringify(result);
//             }
//         } catch {
//             showResult('Error processing the result!');
//         }
//     } else {
//         text = result;
//     }

//     let item = document.createElement('div');
//     item.classList.add('ext_item');
//     if (class_name) {
//         item.classList.add(class_name);
//     }
//     item.innerHTML = text;
//     let div_ele = document.createElement('div');
//     div_ele.append(close);
//     item.prepend(div_ele);
//     ele.append(item);

//     let chat = document.createElement('div');
//     chat.id = 'ext_chat';
//     chat.innerHTML = `<textarea id="ext_ta" placeholder="Ask a question"></textarea><button>Ask</button>`;
//     let btn = chat.querySelector("button");
//     item.append(chat);

//     btn.onclick = () => {
//         let question = chat.querySelector("textarea").value.trim();
//         if (question.length > 4) {
//             question = `Question: ${question}\nText: ${page_content}\nResponse in ${browser_lang}`;
//             summarize(question);
//         }
//     };

//     document.body.prepend(ele);
// }

// API Key setup - Make sure to use your API Key 
const MY_GEMINI_API_KEY = ""; // Get it for free at https://aistudio.google.com/app/apikey

let is_busy = false;
let model = 'gemini-1.5-flash';
let tot_generation = 0; // Keeps track of the number of generations

// List of all supported languages, including regional Indian languages
const all_languages = {
    en: 'English',
    hi: 'Hindi',
    bn: 'Bengali',
    pa: 'Punjabi',
    ur: 'Urdu',
    ta: 'Tamil',
    te: 'Telugu',
    kn: 'Kannada',
    ml: 'Malayalam',
    mr: 'Marathi',
    gu: 'Gujarati',
    or: 'Odia',
    as: 'Assamese',
    kok: 'Konkani',
    pt: 'Portuguese',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    ja: 'Japanese',
    zh: 'Chinese',
    ru: 'Russian',
    ar: 'Arabic',
    ko: 'Korean'
};

if (MY_GEMINI_API_KEY === "") {
    showResult("<h2 class='warning'>API Key not set up! Please add your API key.</h2>");
}

// Detecting the browser's language
let lang_code = navigator.language.substring(0, 2);
let browser_lang = all_languages[lang_code] ?? 'the same language as the text';
let generated_content = '';
let page_content = '';

// Markdown converter for better formatting
showdown.setFlavor('github');
let converter = new showdown.Converter();

function start() {
    $(document).ready(function () {
        window.onkeydown = (event) => {
            let is_input_area = ['TEXTAREA', 'INPUT'].includes(document.activeElement.tagName);
            if (!is_input_area) {
                is_input_area = document.activeElement.isContentEditable;
            }
            if (event.key === 'q' && event.ctrlKey && !is_input_area) {
                if (!is_busy) {
                    let selectedText = getSelectedText();
                    if (selectedText) {
                        showResult('Generating summary for the selected text, please wait...', 2, 'ext_generating');
                        let prompt = `Provide a 1 page summary of the following text: <text>${selectedText}</text>. The summary should be in ${browser_lang}.`;
                        summarize(prompt);
                    } else {
                        page_content = getReadableContent();
                        showResult('Generating summary for the page content, please wait...', 2, 'ext_generating');
                        let prompt = `Provide a 1 page summary of the following text: <text>${page_content}</text>. The summary should be in ${browser_lang}.`;
                        summarize(prompt);
                    }
                } else {
                    showResult('Currently busy generating a summary. Please wait!', 2, 'ext_generating');
                }
            }
        };
    });
}

function getSelectedText() {
    let selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        return selection.toString().trim();
    }
    return null;
}

function getReadableContent() {
    if (document.URL.includes("wikipedia.org")) {
        // Extract the main content area on Wikipedia
        let content = document.querySelector("#mw-content-text").innerText;
        let title = document.querySelector("#firstHeading").innerText;
        return `<h1>${title}</h1>\n<article>${content}</article>`;
    } else {
        let documentClone = document.cloneNode(true);
        let parsed = new Readability(documentClone).parse();
        let content = stripHtml(parsed.content);
        let title = stripHtml(parsed.title);
        return `<h1>${title}</h1>\n<article>${content}</article>`;
    }
}

function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

document.onreadystatechange = (() => {
    let r_state = document.readyState;
    if (r_state === "complete" || r_state === "interactive") {
        start();
    }
});

function summarize(prompt) {
    if (!is_busy) {
        is_busy = true;

        // Character limit for content to prevent large inputs
        const MAX_CONTENT_LENGTH = 1000000;
        prompt = prompt.length > MAX_CONTENT_LENGTH ? prompt.substring(0, MAX_CONTENT_LENGTH) + "..." : prompt;

        const data = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
            ],
            generationConfig: {
                "maxOutputTokens": 1000000, // Reasonable token limit
                "temperature": 0.9
            }
        };

        let endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${MY_GEMINI_API_KEY}`;

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                tot_generation++;
                generated_content = ''; // Clear cached content to avoid reuse
                showResult(data);
            })
            .catch(error => {
                showResult(`Error occurred: ${error.message || JSON.stringify(error)}`);
            }).finally(() => {
                is_busy = false;
            });
    }
}

function showResult(result, duration = 0, class_name = '') {
    let old_result = document.querySelector("#ext_summary");
    if (old_result) {
        old_result.remove();
    }

    let ele = document.createElement('div');
    ele.id = 'ext_summary';
    let close = document.createElement('div');
    close.id = 'ext_close_summary';
    close.addEventListener('click', () => {
        ele.remove();
    });

    if (duration >= 1) {
        duration = duration * 1000;
        setTimeout(() => {
            ele.remove();
        }, duration);
    }

    let text = '';
    if (typeof result === "object") {
        try {
            if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts[0]) {
                text = result.candidates[0].content.parts[0].text;
                text = converter.makeHtml(text);
            } else {
                text = "Error: Unable to process API response. Debug Info: " + JSON.stringify(result);
            }
        } catch {
            showResult('Error processing the result!');
        }
    } else {
        text = result;
    }

    let item = document.createElement('div');
    item.classList.add('ext_item');
    if (class_name) {
        item.classList.add(class_name);
    }
    item.innerHTML = text;
    let div_ele = document.createElement('div');
    div_ele.append(close);
    item.prepend(div_ele);
    ele.append(item);

    let chat = document.createElement('div');
    chat.id = 'ext_chat';
    chat.innerHTML = `<textarea id="ext_ta" placeholder="Ask a question"></textarea><button>Ask</button>`;
    let btn = chat.querySelector("button");
    item.append(chat);

    btn.onclick = () => {
        let question = chat.querySelector("textarea").value.trim();
        if (question.length > 4) {
            question = `Question: ${question}\nText: ${page_content}\nResponse in ${browser_lang}`;
            summarize(question);
        }
    };

    document.body.prepend(ele);
}
