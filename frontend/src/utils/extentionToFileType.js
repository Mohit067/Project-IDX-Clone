const extensionToTypeMap = {
    // Web Development
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'scss',
    'less': 'less',

    // JavaScript & TypeScript
    'js': 'javascript',
    'mjs': 'javascript',
    'cjs': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',

    // JSON & Data Formats
    'json': 'json',
    'jsonc': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'toml': 'toml',
    'csv': 'csv',
    'tsv': 'csv',
    'xml': 'xml',

    // Python
    'py': 'python',
    'pyw': 'python',
    'ipynb': 'python',

    // Java
    'java': 'java',
    'jsp': 'java',

    // C, C++, and C#
    'c': 'c',
    'h': 'c',
    'cpp': 'cpp',
    'hpp': 'cpp',
    'cc': 'cpp',
    'cs': 'csharp',

    // PHP
    'php': 'php',
    'phtml': 'php',

    // Ruby
    'rb': 'ruby',
    'erb': 'ruby',

    // Go
    'go': 'go',

    // Rust
    'rs': 'rust',

    // Swift
    'swift': 'swift',

    // Kotlin
    'kt': 'kotlin',
    'kts': 'kotlin',

    // Dart
    'dart': 'dart',

    // Shell & Scripts
    'sh': 'bash',
    'bash': 'bash',
    'zsh': 'bash',
    'bat': 'batch',
    'cmd': 'batch',
    'ps1': 'powershell',

    // SQL
    'sql': 'sql',

    // Markdown & Documentation
    'md': 'markdown',
    'markdown': 'markdown',
    'mdx': 'markdown',
    'rst': 'restructuredtext',

    // LaTeX
    'tex': 'latex',
    'bib': 'latex',

    // Config & Logs
    'ini': 'ini',
    'log': 'log',
    'conf': 'config',

    // Makefiles & Build Scripts
    'makefile': 'makefile',
    'mk': 'makefile',
    'cmake': 'cmake',
    'gradle': 'gradle',

    // Docker & DevOps
    'dockerfile': 'dockerfile',
    'dockerignore': 'dockerfile',

    // Git
    'gitignore': 'git',
    'gitattributes': 'git',
    'gitmodules': 'git',

    // Misc
    'env': 'config',
    'lock': 'config'
};

export const extensionToFilType = (extension) => {
    if(!extension) return undefined;
    console.log(extensionToTypeMap[extension]);
    return extensionToTypeMap[extension];
}