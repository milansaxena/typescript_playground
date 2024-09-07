const apiBaseUrl = 'http://localhost:3000/api';

// Define TypeScript files
const tsFiles = [
    {
        name: 'hello.ts',
        content: `function helloWorld() {
            console.log("Hello, TypeScript!");
        }

        helloWorld();`
    }
];

// Initialize Monaco Editor
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
require(['vs/editor/editor.main'], function () {
    window.editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: tsFiles[0].content, // Load the first file by default
        language: 'typescript',
        theme: 'vs-dark',
        automaticLayout: true
    });
});

// Function to fetch and display the list of TypeScript files dynamically
async function fetchFileList() {
    try {
        const response = await fetch(`${apiBaseUrl}/programs`);
        const files = await response.json();

        const fileNamesList = document.getElementById('file-list');
        fileNamesList.innerHTML = '';  // Clear the list

        // Loop through each file and display it
        files.forEach((fileName) => {
            const li = document.createElement('li');
            li.textContent = fileName;

            // On click, load the corresponding file content into the editor
            li.addEventListener('click', function () {
                loadFileContent(fileName);
            });

            fileNamesList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching file list:', error);
    }
}

// Function to load the content of a clicked file into the Monaco editor
async function loadFileContent(fileName) {
    try {
        const response = await fetch(`${apiBaseUrl}/programs/${fileName}`);
        const fileData = await response.json();
        window.editor.setValue(fileData.content);  // Set the file content in Monaco editor
    } catch (error) {
        console.error('Error fetching file content:', error);
    }
}

// Function to compile and run TypeScript code
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

// Save the current code from the editor as a new file
function saveFile() {
    const tsCode = window.editor.getValue();  // Get the current code from the editor
    const fileName = prompt('Enter the file name:', 'newFile.ts');  // Ask the user for a file name
    
    if (fileName) {
        const blob = new Blob([tsCode], { type: 'text/plain' });  // Create a Blob with the file content

        // Create an anchor element to trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;  // Set the file name for the download

        // Append the link to the body, trigger the click, and remove the link
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}


// Initialize the file list on page load
window.onload = fetchFileList;
