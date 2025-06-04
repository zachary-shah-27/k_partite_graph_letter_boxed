const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'dist', 'index.html');

fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading index.html:', err);
    process.exit(1);
  }

  // Insert absolute base href with leading slash
  const baseHref = '<base href="/k_partite_graph_letter_boxed/">';

  if (!data.includes(baseHref)) {
    const fixed = data.replace(
      /<head>/,
      `<head>\n    ${baseHref}`
    );

    fs.writeFile(indexPath, fixed, 'utf8', (err) => {
      if (err) {
        console.error('Error writing fixed index.html:', err);
        process.exit(1);
      }
      console.log('index.html fixed with base href.');
    });
  } else {
    console.log('base href already present, skipping.');
  }
});
