const fs = require('fs');
const path = require('path');

const breakpointsDir = path.join(__dirname, 'src', 'styles', 'breakpoints');
const files = fs.readdirSync(breakpointsDir);

files.forEach(file => {
  if (file.endsWith('.css')) {
    const filePath = path.join(breakpointsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Regular expression to match .hero-name { ... } even with newlines
    // It looks for .hero-name followed by anything until the first closing brace.
    const regex = /\.hero-name\s*\{[^}]+\}/g;
    
    if (regex.test(content)) {
      console.log(`Removing .hero-name overrides in ${file}`);
      content = content.replace(regex, '/* .hero-name overrides removed for centralized control in Hero.css */');
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
});
console.log('Done.');
