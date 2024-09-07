# TypeScript Playground

## Overview

The TypeScript Playground is a web-based IDE that allows you to dynamically load, edit, and execute TypeScript code. It provides a file explorer with a tree view to navigate through your TypeScript files, a code editor powered by Monaco Editor, and a console to view output and errors.

## Features

- **File Explorer**: Displays a tree view of TypeScript files and directories.
- **Code Editor**: Integrated Monaco Editor for editing TypeScript code.
- **Dynamic File Loading**: Load and display files from the server dynamically.
- **Theme Support**: Toggle between light and dark themes.
- **Code Execution**: Transpile TypeScript to JavaScript and execute it in a safe environment using Web Workers.
- **File Saving**: Save the edited TypeScript code as a new file.

## Project Structure

- `index.html`: The main HTML file for the project.
- `styles.css`: Contains styling for the application.
- `script.js`: The main JavaScript file that handles application logic.
- `server.js`: Node.js server to serve files and handle API requests.
- `api/`: Directory containing the TypeScript files and directories.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/milansaxena/typescript_playground
   cd typescript_playground

2. **Install dependencies**

    Ensure you have Node.js installed. Then run:   
    ```bash
    npm install

3. **Start the server:**

    The server will start on http://localhost:3000.
    ```bash  
    node server.js
 
4. **Open the application:**

    Open index.html in your browser or navigate to http://localhost:3000 if serving from the server.


5. **Usage**
    - File Explorer:
        - Navigate through directories and files.
        - Click on a file to load its content into the editor.
    - Code Editor:
        - Edit TypeScript code in the Monaco Editor.
        - Click "Run Code" to transpile and execute the code.
        - Click "Save File" to save the current code as a new TypeScript file.
    - Theme Toggle:
        -Use the "Toggle Theme" button to switch between light and dark themes.

6. **Development**
    + Add New Files: Place new TypeScript files in the api/ directory.
    + Modify Styles: Update styles.css to change the appearance.
    + Extend Functionality: Edit script.js and server.js to add or modify features.

7. **Dependencies**
    + FontAwesome for icons.
    + Monaco Editor for the code editor.
    + TypeScript for transpiling TypeScript code.

8. **License**
    This project is licensed under the MIT License. See the LICENSE file for details.

9. **Contributing**
    Contributions are welcome! Please submit issues or pull requests to improve the project.

10. **Contact**
    For questions or feedback, please contact **`mail.milansaxena@gmail.com`**      
