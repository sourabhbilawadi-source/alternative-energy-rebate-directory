const fs = require('fs');
const path = require('path');

function replaceHeaderInAstro(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Calculate relative path for Navbar import
  const depth = filePath.split(path.sep).length - 3; // src/pages/index.astro is 3
  const relativePrefix = '../'.repeat(depth + 1);
  const importStatement = `import Navbar from '${relativePrefix}components/Navbar.astro';`;
  
  // Since we already injected imports with wrong paths, let's fix them:
  content = content.replace(/import Navbar from '.*components\/Navbar\.astro';/g, importStatement);

  fs.writeFileSync(filePath, content);
  console.log('Fixed import in ' + filePath);
}

function findAstroFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      findAstroFiles(path.join(dir, file), fileList);
    } else if (file.endsWith('.astro')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const files = findAstroFiles('src/pages');
for (const file of files) {
  replaceHeaderInAstro(file);
}
