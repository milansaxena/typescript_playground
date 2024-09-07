const apiBaseUrl = 'http://localhost:3000/api'; // Adjust this to your server's URL

// Load TypeScript Compiler
const tsScript = document.createElement('script');
tsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/typescript/4.5.4/typescript.min.js'; // Adjust version as needed
document.head.appendChild(tsScript);

tsScript.onload = () => {
    // Initialize Monaco Editor
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
    console.log("Welcome to TypeScript-Playground! -- Milan");
}

helloWorld();`,
            language: 'typescript',
            theme: editorTheme
        });

        // Fetch file tree
        fetchFileTree();
    });
};

// Theme toggle function
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');
    const editorTheme = body.classList.contains('dark-theme') ? 'custom-dark' : 'custom-light';
    monaco.editor.setTheme(editorTheme);
}

// Fetch and display the tree of TypeScript files
async function fetchFileTree() {
    try {
        const response = await fetch(`${apiBaseUrl}/files`);
        const fileTree = await response.json();

        const fileTreeContainer = document.getElementById('file-tree');
        fileTreeContainer.innerHTML = '';  // Clear the list

        // Render file tree
        renderFileTree(fileTree, fileTreeContainer);
    } catch (error) {
        console.error('Error fetching file tree:', error);
    }
}

// Recursive function to render file tree
function renderFileTree(tree, container) {
    tree.forEach(node => {
        const li = document.createElement('li');
        const icon = document.createElement('i');
        const text = document.createElement('span');

        // Add icon based on node type
        // if (node.children && node.children.length > 0) {
        //     icon.classList.add('fas', 'fa-folder');
        // } else {
        //     icon.classList.add('fas', 'fa-file');
        // }

        // Add text and icon to list item
        text.textContent = node.name;
        li.appendChild(icon);
        li.appendChild(text);

        if (node.children && node.children.length > 0) {
            li.classList.add('collapsed');
            const ul = document.createElement('ul');
            renderFileTree(node.children, ul);
            li.appendChild(ul);
        }

        li.addEventListener('click', function (e) {
            e.stopPropagation();
            if (node.children && node.children.length > 0) {
                li.classList.toggle('collapsed');
            } else {
                loadFileContent(encodeURIComponent(node.path)); // URL encode the file path
            }
        });

        container.appendChild(li);
    });
}

// Load the content of the selected file
async function loadFileContent(filePath) {
    try {
        const response = await fetch(`${apiBaseUrl}/files/${filePath}`);
        if (response.ok) {
            const fileData = await response.json();
            window.editor.setValue(fileData.content);  // Set the file content in Monaco editor
        } else {
            console.error('Error fetching file content:', response.statusText);
        }
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
                    // self.postMessage({ type: 'success', data: 'Code executed successfully.' });
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
async function saveFile() {
    const tsCode = window.editor.getValue();
    const fileName = prompt('Enter the file name:', 'newFile.ts');

    if (fileName && fileName.endsWith('.ts')) {
        try {
            const response = await fetch(`${apiBaseUrl}/files`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filePath: fileName, content: tsCode })
            });

            if (response.ok) {
                alert('File saved successfully');
            } else {
                alert('Failed to save file: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error saving file:', error);
        }
    } else {
        alert('Invalid file name. Please make sure the file name ends with .ts');
    }
}
