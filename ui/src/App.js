import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [puzzle, setPuzzle] = useState(null);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [correctWords, setCorrectWords] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const newGame = () => {
    fetch('http://127.0.0.1:5000/generate?min_length=3&max_length=8&max_words=20')
      .then(res => res.json())
      .then(data => {
        setPuzzle(data);
        setSelectedLetters([]);
        setCorrectWords([]);
        setIsGameOver(false);
      });
  }

  useEffect(() => {
    newGame();
  }, []);

  if (!puzzle) {
    return <div>Loading...</div>;
  }

  const words = Object.keys(puzzle.words).sort((a, b) => a.length - b.length);
  const groupedWords = words.reduce((acc, word) => {
    const length = word.length;
    if (!acc[length]) {
      acc[length] = [];
    }
    acc[length].push(word);
    return acc;
  }, {});

  const handleGiveUp = () => {
    setIsGameOver(true);
    setCorrectWords(words);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Word Fun</h1>
      </header>
      <div className="puzzle">
        <div className="word-grids">
          {Object.keys(groupedWords).map(length => (
            <div key={length} className="word-column">
              {groupedWords[length].map((word, index) => (
                <div key={index} className="word-grid">
                  {word.split('').map((letter, i) => (
                    <div key={i} className="grid-cell">
                      {correctWords.includes(word) ? letter : ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="letter-bank">
          {puzzle.letters.split('').map((letter, index) => (
            <button
              key={index}
              className="letter-button"
              onClick={() => setSelectedLetters([...selectedLetters, letter])}
              disabled={isGameOver}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="selected-letters">
          {selectedLetters.map((letter, index) => (
            <span key={index} className="selected-letter">{letter}</span>
          ))}
        </div>
        <div className="controls">
          {isGameOver ? (
            <button onClick={newGame}>New Game</button>
          ) : (
            <>
              <button onClick={() => {
                const selectedWord = selectedLetters.join('');
                if (words.includes(selectedWord) && !correctWords.includes(selectedWord)) {
                  setCorrectWords([...correctWords, selectedWord]);
                }
                setSelectedLetters([]);
              }} disabled={isGameOver}>Submit</button>
              <button onClick={() => setSelectedLetters([])} disabled={isGameOver}>Clear</button>
              <button onClick={handleGiveUp}>Give Up</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;