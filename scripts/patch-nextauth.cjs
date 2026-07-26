const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'node_modules', 'next-auth', 'react', 'index.js');
let content = fs.readFileSync(target, 'utf8');

if (!content.includes('var React = require')) {
  const line = 'var React = require("react");\n';
  content = line + content;
  fs.writeFileSync(target, content, 'utf8');
  console.log('Patched next-auth/react/index.js with React import');
} else {
  console.log('Already patched');
}
