const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.js')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk('./client/src');
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const regex = /\.toLocaleString\(\s*"it-IT"\s*,\s*\{\s*style\s*:\s*"currency"\s*,\s*currency\s*:\s*"VND"\s*,?\s*\}\s*\)/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, '.toLocaleString("vi-VN") + " VND"');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
    changedFiles++;
  }
});

console.log('Total files changed: ' + changedFiles);
