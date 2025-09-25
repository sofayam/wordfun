// filepath: /Users/mark/repos/wordfun/server.js
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5050;

app.set('strict routing', false);

// Serve the React app
app.use(express.static(path.join(__dirname, 'ui/build')));

// Define the /choose endpoint
app.get('/choose', (req, res) => {
  const wordutilsPath = path.join(__dirname, 'wordutils');
  const anagramsFile = path.join(wordutilsPath, 'allanagrams.txt');
  const wordsFile = path.join(wordutilsPath, 'words.txt');

  // Read the files
  const anagrams = fs.readFileSync(anagramsFile, 'utf-8').split('\n').filter(Boolean);
  const wordsData = fs.readFileSync(wordsFile, 'utf-8').split('\n').filter(Boolean);

  // Parse the words.txt into a dictionary
  const definitions = {};
  wordsData.forEach(line => {
    // find the first word in the line up to the first space or tab
    const key = line.split(/\s+/)[0];
    definitions[key] = line; // Use the first word as the key, store the whole line as the value
  });



  // Pick a random line from allanagrams.txt, repeat the process until we find one with less than
  // MAXWORDS words
  const MAXWORDS = 24;
  let randomLine;
  let wordList;
  let letters;
  do {
    randomLine = anagrams[Math.floor(Math.random() * anagrams.length)];
    [ , wordList] = randomLine.split(':');
  } while (wordList.split(' ').length > MAXWORDS);
  // const randomLine = anagrams[Math.floor(Math.random() * anagrams.length)];
  [letters, wordList] = randomLine.split(':');
  const shuffledLetters = letters.split('').sort(() => Math.random() - 0.5).join('');

  // Create the words dictionary
  const words = {};
  wordList.split(' ').map(word => word.trim()).forEach(word => {
    if (definitions[word]) {
      words[word] = definitions[word]; // Include the full line from words.txt
    }
  });

  // Debugging logs
  console.log('Chosen letters:', shuffledLetters);
  console.log('Words:', words);

  // Return the response
  res.json({
    letters: shuffledLetters,
    words: words,
  });
});

// Catch-all to serve React's index.html for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'ui/build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});