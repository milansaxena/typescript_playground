const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Directory containing TypeScript files
const filesDir = path.join(__dirname, 'files');

// CORS setup (allow all origins for testing)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// API endpoint to get list of TypeScript files
app.get('/api/files', (req, res) => {
    fs.readdir(filesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading files' });
        }
        // Only return .ts files
        const tsFiles = files.filter(file => file.endsWith('.ts'));
        res.json(tsFiles);
    });
});

// API endpoint to get the content of a specific file
app.get('/api/files/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(filesDir, fileName);

    // Read file content
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }
        res.json({ content: data });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
