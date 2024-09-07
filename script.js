const apiBaseUrl = 'http://localhost:3000/api'; // Adjust this to your server's URL

// Theme toggle function
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');
}

// Load Monaco Editor
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
require(['vs/editor/editor.main'], function () {
    // Define custom themes for Monaco Editor
    monaco.editor.defineTheme('custom-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#1E1E1E',
            'editor.foreground': '#FFFFFF'
        }
    });
    monaco.editor.defineTheme('custom-light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#F5F5F5',
            'editor.foreground': '#000000'
        }
    });

    // Set default editor theme
    const editorTheme = document.body.classList.contains('dark-theme') ? 'custom-dark' : 'custom-light';
    window.editor = monaco.editor.create(document.getElementById('editor'), {
        value: `function helloWorld() {
    console.log("Hello, TypeScript!");
}

helloWorld();`,
        language: 'typescript',
        theme: editorTheme
    });

    // Fetch file list
    fetchFileList();
});

// Handle theme switching in Monaco Editor
document.getElementById('themeSwitch').addEventListener('change', function () {
    const theme = document.body.classList.contains('dark-theme') ? 'custom-dark' : 'custom-light';
    monaco.editor.setTheme(theme);
});

// Fetch and display the list of TypeScript files
async function fetchFileList() {
    try {
        const response = await fetch(`${apiBaseUrl}/files`);
        const files = await response.json();

        const fileNamesList = document.getElementById('file-names');
        fileNamesList.innerHTML = '';  // Clear the list

        files.forEach((fileName) => {
            const li = document.createElement('li');
            li.textContent = fileName;
            li.classList.add('list-group-item', 'list-group-item-action');

            li.addEventListener('click', function () {
                loadFileContent(fileName);
            });

            fileNamesList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching file list:', error);
    }
}

// Load the content of the selected file
async function loadFileContent(fileName) {
    try {
        const response = await fetch(`${apiBaseUrl}/files/${fileName}`);
        const fileData = await response.json();
        window.editor.setValue(fileData.content);  // Set the file content in Monaco editor
    } catch (error) {
        console.error('Error fetching file content:', error);
    }
}

// Compile and run the TypeScript code
function runCode() {
    const tsCode = window.editor.getValue();
    let jsCode;
    try {
        jsCode = ts.transpile(tsCode, { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2015 });
    } catch (err) {
        document.getElementById('output').textContent = 'TypeScript Compilation Error: ' + err.message;
        return;
    }

    try {
        const workerBlob = new Blob([`
            self.onmessage = function(event) {
                try {
                    const console = {
                        log: function(...args) {
                            self.postMessage({ type: 'log', data: args.join(' ') });
                        },
                        error: function(...args) {
                            self.postMessage({ type: 'error', data: args.join(' ') });
                        }
                    };
                    ${jsCode}
                    self.postMessage({ type: 'success', data: 'Code executed successfully.' });
                } catch (error) {
                    self.postMessage({ type: 'error', data: error.message });
                }
            };
        `], { type: 'application/javascript' });

        const worker = new Worker(URL.createObjectURL(workerBlob));

        const outputElement = document.getElementById('output');
        outputElement.textContent = ''; // Clear previous output

        worker.onmessage = function(e) {
            const { type, data } = e.data;
            if (type === 'log') {
                outputElement.textContent += data + '\n';
            } else if (type === 'error') {
                outputElement.textContent += 'Error: ' + data + '\n';
            } else if (type === 'success') {
                if (!data.includes('Error')) { // Avoid duplicating success messages
                    outputElement.textContent += data + '\n';
                }
            }
        };

        worker.postMessage(jsCode); // Send compiled JS code to the worker

    } catch (err) {
        document.getElementById('output').textContent = 'Runtime Error: ' + err.message;
    }
}

// Save the current code as a new file
function saveFile() {
    const tsCode = window.editor.getValue();
    const fileName = prompt('Enter the file name:', 'newFile.ts');

    if (fileName) {
        const blob = new Blob([tsCode], { type: 'text/plain' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}


