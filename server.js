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

    // there are two important files in the subdirectory "wordutils"
    // allanagrams.txt and words.txt
    // to create a return value procede as follows:
   // Take a random line from allanagrams.txt
   // - use the first word in the line as the value for letters, but with shuffled letters
   // - use the rest of the words in the line, after the colon to create 
   // the "words" dictionary. That dictionary should have the words as keys 
   // and the values should be the definitions which you can find
   // in words.txt. 

    // allanagrams.txt has lines like this:
    // palmapleap: pal, map, leap, pale, plea, maple, apple
    // words.txt has lines like this:
    // pal A friend
    // map A location guide
    // leap To jump
 
    // return a JSON object with letters and words

  // Example response (for the word "example"):
  //  res.json({
  //  letters: 'pleaamex',
  //  words: { example: 'an illustration'  pal: 'A friend', map: 'A location guide', leap: 'To jump' }
  // });
  let letters, words = getResponse()
  res.json ({letters, words})
});


getResponse = () => {
  // read allanagrams.txt
  allangrams = fs.readFileSync('wordutils/allanagrams.txt', 'utf-8').split('\n');
  // pick a random line
  let randomLine = allangrams[Math.floor(Math.random() * allangrams.length)];
  // split on colon
  let parts = randomLine.split(':');

  // take first word
  let firstWord = parts[0].trim();
  // shuffle letters
  let shuffled = firstWord.split('').sort(() => Math.random() - 0.5).join('');

  // take rest of words
  let wordList = parts[1].split(',').map(w => w.trim());

  // read words.txt into a dictionary
  let wordLines = fs.readFileSync('wordutils/words.txt', 'utf-8').split('\n');
  let wordDict = {};
  wordLines.forEach(line => {
    let [word, ...definitionParts] = line.split(' ');
    wordDict[word] = line;
  });

  // create words dictionary for response
  let words = {};
  wordList.forEach(word => {
    if (wordDict[word]) {
      words[word] = wordDict[word];
    }
  });

  return (shuffled,words)
}

// Catch-all to serve React's index.html for any other routes
app.get('*', (req, res) => {
  try {
    const filePath = path.resolve(__dirname, 'ui/build', 'index.html');
    console.log(`Serving file: ${filePath}`);
    res.sendFile(filePath);
  } catch (err) {
    console.error('Error serving index.html:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});