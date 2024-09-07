const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import the cors package
const app = express();
const port = 3000;

// Directory where TypeScript files are stored
const filesDirectory = path.join(__dirname, 'files');

// Middleware to serve static files (e.g., for the front-end)
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS middleware
app.use(cors());

// Helper function to check if a file has a .ts extension
const isTypeScriptFile = (fileName) => path.extname(fileName) === '.ts';

// Endpoint to get the file tree
app.get('/api/files', (req, res) => {
    const getFileTree = (dir) => {
        return fs.readdirSync(dir, { withFileTypes: true }).map(dirent => {
            const fullPath = path.join(dir, dirent.name);
            if (dirent.isDirectory()) {
                return {
                    name: dirent.name,
                    children: getFileTree(fullPath)
                };
            } else if (isTypeScriptFile(dirent.name)) {
                return {
                    name: dirent.name,
                    path: path.relative(filesDirectory, fullPath)
                };
            }
            return null;  // Exclude non-TypeScript files
        }).filter(node => node !== null); // Remove null entries
    };

    try {
        const fileTree = getFileTree(filesDirectory);
        res.json(fileTree);
    } catch (error) {
        console.error('Error getting file tree:', error);
        res.status(500).send('Server error');
    }
});

// Endpoint to get the content of a specific file
app.get('/api/files/:filePath', (req, res) => {
    const filePath = path.join(filesDirectory, req.params.filePath);

    if (!isTypeScriptFile(filePath)) {
        return res.status(400).send('Invalid file type');
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Server error');
        }
        res.json({ content: data });
    });
});

// Endpoint to save a new file
app.post('/api/files', (req, res) => {
    const { filePath, content } = req.body;
    const fullPath = path.join(filesDirectory, filePath);

    if (!isTypeScriptFile(filePath)) {
        return res.status(400).send('Invalid file type');
    }

    fs.writeFile(fullPath, content, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Server error');
        }
        res.status(200).send('File saved successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
