const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = {
  'bg-background': 'bg-[#F4F4F0]',
  'text-background': 'text-[#F4F4F0]',
  'bg-surface': 'bg-white',
  'text-surface': 'text-white',
  'bg-primary': 'bg-pink-500',
  'text-primary': 'text-pink-500',
  'bg-secondary': 'bg-cyan-400',
  'text-secondary': 'text-cyan-400',
  'bg-accent': 'bg-yellow-400',
  'text-accent': 'text-yellow-500',
  'text-dark': 'text-black',
  'bg-dark': 'bg-black',
  'border-dark': 'border-black',
  'fill-dark': 'fill-black',
  'var(--color-dark)': 'black',
  'var(--color-background)': '#F4F4F0'
};

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else if (filepath.endsWith('.jsx') || filepath.endsWith('.css')) {
      filelist.push(filepath);
    }
  }
  return filelist;
};

const files = walkSync(directoryPath);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  for (const [key, value] of Object.entries(replacements)) {
    if (content.includes(key)) {
      content = content.split(key).join(value);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
