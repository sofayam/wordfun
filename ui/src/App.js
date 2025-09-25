import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';

const CIRCLE_RADIUS = 120;
const NODE_RADIUS = 30;

function App() {
  const [puzzle, setPuzzle] = useState(null);
  const [correctWords, setCorrectWords] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showDefinition, setShowDefinition] = useState(null);
  const [currentWord, setCurrentWord] = useState([]);
  const [isSwiping, setIsSwiping] = useState(false);
  const [linePath, setLinePath] = useState([]);

  const letterCircleRef = useRef(null);

  const newGame = () => {
    fetch(`/choose`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched puzzle data:', data); // Log the response
        setPuzzle(data);
        setCorrectWords([]);
        setIsGameOver(false);
        setCurrentWord([]);
        setLinePath([]);
      })
      .catch(err => {
        console.error('Error fetching /choose:', err);
      });
  };

  useEffect(() => {
    newGame();
  }, []);

  const letterPositions = useMemo(() => {
    if (!puzzle) return [];
    const letters = puzzle.letters.split('');
    const angleStep = (2 * Math.PI) / letters.length;
    return letters.map((letter, i) => ({
      letter,
      x: CIRCLE_RADIUS * Math.cos(i * angleStep - Math.PI / 2) + CIRCLE_RADIUS,
      y: CIRCLE_RADIUS * Math.sin(i * angleStep - Math.PI / 2) + CIRCLE_RADIUS,
    }));
  }, [puzzle]);

  const words = useMemo(() => {
    if (!puzzle) return [];
    return Object.keys(puzzle.words).sort((a, b) => a.length - b.length);
  }, [puzzle]);

  const groupedWords = useMemo(() => {
    return words.reduce((acc, word) => {
      const length = word.length;
      if (!acc[length]) acc[length] = [];
      acc[length].push(word);
      return acc;
    }, {});
  }, [words]);

  const handleInteractionStart = (e) => {
    if (isGameOver) return;
    setIsSwiping(true);
  };

  const handleInteractionEnd = () => {
    if (isGameOver || !isSwiping) return;
    setIsSwiping(false);
    const selectedWord = currentWord.map(c => c.letter).join('');
    if (words.includes(selectedWord) && !correctWords.includes(selectedWord)) {
      setCorrectWords([...correctWords, selectedWord]);
    }
    setCurrentWord([]);
    setLinePath([]);
  };

  const handleInteractionMove = (e) => {
    if (!isSwiping || isGameOver) return;
    const touch = e.touches ? e.touches[0] : e;
    const rect = letterCircleRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    letterPositions.forEach((pos, index) => {
      const dist = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
      if (dist < NODE_RADIUS && !currentWord.find(c => c.index === index)) {
        setCurrentWord([...currentWord, { letter: pos.letter, index, x: pos.x, y: pos.y }]);
        if (currentWord.length > 0) {
          const lastPos = currentWord[currentWord.length - 1];
          setLinePath([...linePath, { x1: lastPos.x, y1: lastPos.y, x2: pos.x, y2: pos.y }]);
        }
      }
    });
  };

  const handleWordClick = (word) => {
    if (correctWords.includes(word)) {
      setShowDefinition(puzzle.words[word]);
    }
  };

  const handleGiveUp = () => {
    setIsGameOver(true);
    setCorrectWords(words);
  }

  if (!puzzle) {
    return <div>Loading...</div>;
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
                <div key={index} className="word-grid" onClick={() => handleWordClick(word)}>
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

        <div className="current-word">
          {currentWord.map(c => c.letter).join('')}
        </div>

        <div
          className="letter-circle-container"
          ref={letterCircleRef}
          onMouseDown={handleInteractionStart}
          onMouseUp={handleInteractionEnd}
          onMouseMove={handleInteractionMove}
          onMouseLeave={handleInteractionEnd} 
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
          onTouchMove={handleInteractionMove}
        >
          <div className="letter-circle">
            {letterPositions.map((pos, i) => (
              <div
                key={i}
                className={`letter-node ${currentWord.find(c => c.index === i) ? 'selected' : ''}`}
                style={{ left: pos.x - NODE_RADIUS, top: pos.y - NODE_RADIUS }}
              >
                {pos.letter}
              </div>
            ))}
          </div>
          <svg className="line-container">
            {linePath.map((line, i) => {
              const dx = line.x2 - line.x1;
              const dy = line.y2 - line.y1;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * 180 / Math.PI;
              return (
                <div
                  key={i}
                  className="line"
                  style={{
                    left: line.x1,
                    top: line.y1 - 2,
                    width: dist,
                    transform: `rotate(${angle}deg)`,
                  }}
                />
              );
            })}
          </svg>
        </div>

        <div className="controls">
          {isGameOver ? (
            <button onClick={newGame}>New Game</button>
          ) : (
            <>
              <button onClick={() => { setCurrentWord([]); setLinePath([]); }}>Clear</button>
              <button onClick={handleGiveUp}>Give Up</button>
            </>
          )}
        </div>
      </div>
      {showDefinition && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowDefinition(null)}>&times;</span>
            <p>{showDefinition}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;