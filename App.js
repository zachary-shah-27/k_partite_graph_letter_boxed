/*
* Zachary Shah
* Cosc 30
* K-Partite Recreation of Letter Boxed
* June 2025
* 
* Created for Cosc 30 as an extra credit assignment
* For instructions to run, see README
* Implementation described through in-line comments of this file, App.js
* No assumptions, game is made from my own design, not following a spec
* For questions and trouble-shooting, contact me directly
*/
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Dimensions,
} from 'react-native';
import Svg, { Line, Polygon } from 'react-native-svg'; // for shape of graph and visualising edges
import wordList from 'an-array-of-english-words'; // comprehensive package of common words


/* 
* An example of various puzzles
* 
* It is important to note that not all combinations of 
* k, n, and choice of letters produce a solvable puzzle.
* The real NYT daily puzzle is actually maintained by an editor,
* and designed to always be solvable in 2 words.
* Thus, It makes the most logical sense for me to construct my own puzzles.
* See a few examples below (comment out the ones NOT in use)
*/

const puzzleData = {
  k: 6,
  n: 3,
  sides: [
    ['C', 'A', 'T'],   // Side 0
    ['D', 'O', 'G'],   // Side 1
    ['B', 'I', 'R'],   // Side 2
    ['F', 'L', 'E'],   // Side 3
    ['S', 'U', 'N'],   // Side 4
    ['M', 'P', 'H'],   // Side 5
  ],
};


/*
const puzzleData = {
  k: 4,
  n: 3,
  sides: [
    ['G', 'A', 'T'],  // Side 0
    ['L', 'E', 'F'],  // Side 1
    ['I', 'N', 'D'],  // Side 2
    ['R', 'O', 'S'],  // Side 3
  ],
};
*/

/*
const puzzleData = {
  k: 3,
  n: 4,
  sides: [
    ['S', 'T', 'R', 'A'],  // Side 0
    ['E', 'L', 'P', 'N'],  // Side 1
    ['C', 'O', 'M', 'D'],  // Side 2
  ],
};
*/


export default function App() {
  // various use states to store local save data
  const [statusMessage, setStatusMessage] = useState('');
  const [currentWord, setCurrentWord] = useState([]);
  const [usedSides, setUsedSides] = useState([]);
  const [usedLetters, setUsedLetters] = useState([]);
  const [lastAcceptedLastLetter, setLastAcceptedLastLetter] = useState(null);
  const [wordsAcceptedCount, setWordsAcceptedCount] = useState(0);
  const [completedPaths, setCompletedPaths] = useState([]);

  // get window size to properly display game
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  // create a division between left side (word entry) and right side (graph)
  const leftWidth = windowWidth * 0.4;
  const rightWidth = windowWidth * 0.6;

  // Find center of right side to display graph
  const centerX = rightWidth / 2;
  const centerY = windowHeight / 2;

  // Calculate the maximum radius to fit graph within screen
  const radius = Math.min(rightWidth, windowHeight) / 2 - 40;

  const letterSize = 40;

  // handler for letter presses
  const handleLetterPress = (letter, sideIndex, letterIndex) => {
    if ( 
      // if a word has already been submitted and accepted, 
      // this ensures the next word starts with the trailing word's last character
      currentWord.length === 0 && 
      lastAcceptedLastLetter !== null && 
      letter.toLowerCase() !== lastAcceptedLastLetter
    ) {
      setStatusMessage(
        `The first letter must be "${lastAcceptedLastLetter.toUpperCase()}".`
      );
      return;
    }
  
    // check if the selected word comes from the same partition of the graph
    // this validates our K-Partite configuration!
    if (usedSides.length === 0 || usedSides[usedSides.length - 1].sideIndex !== sideIndex) {
      setCurrentWord([...currentWord, letter]);
      setUsedSides([...usedSides, { sideIndex, letterIndex }]);
      setStatusMessage('');
    } else {
      setStatusMessage("Can't use two letters from the same side consecutively.");
    }
  };
  

  // for clear button
  const handleClear = () => {
    setCurrentWord([]);
    setUsedSides([]);
  };

  // for word submission, runs its own validation
  const handleSubmit = () => {
    // normalize submitted word for ease
    const word = currentWord.join('').toLowerCase();
  
    // a word must be longer than 2 characters, as per NYT rules
    if (word.length < 3) {
      setStatusMessage("Word must be at least 3 letters.");
      return;
    }
  
    // check if submitted word included in imported word list
    if (!wordList.includes(word)) {
      setStatusMessage(`"${word}" is not in the dictionary.`);
      // clear if word is invalid
      handleClear();
      return;
    }
  
    // passing the 2 above checks, our word is valid!

    // store used letters in submitted word, and add 1 to the count of total words
    const newUsedLetters = [...usedLetters, ...usedSides];
    setUsedLetters(newUsedLetters);
    setWordsAcceptedCount(wordsAcceptedCount + 1);

    // store path of letters to visualize graph
    setCompletedPaths([
      ...completedPaths,
      [...usedSides],
    ]);
    
  
    // check for win state, if all letters are used
    const totalLetters = puzzleData.k * puzzleData.n;
    const uniqueUsedLettersCount = new Set(
      newUsedLetters.map(
        (used) => `${used.sideIndex}-${used.letterIndex}`
      )
    ).size;
  
    // if we meet win state, issue a status message and display total count,
    // else confirm a word was accepted
    if (uniqueUsedLettersCount === totalLetters) {
      setStatusMessage(`You won! All letters used in ${wordsAcceptedCount + 1} words!`);
    } else {
      setStatusMessage(`"${word}" accepted!`);
    }
  
    // store last letter of accepted word in use state
    setLastAcceptedLastLetter(word[word.length - 1]);
    // clear for next word
    handleClear();
  };
  
  
  

  // calculate polygon vertices according to right panel coordinate space
  const angleStep = (2 * Math.PI) / puzzleData.k;
  const vertices = [];
  for (let i = 0; i < puzzleData.k; i++) {
    const angle = angleStep * i - Math.PI / 2; // start pointing up
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    vertices.push({ x, y });
  }

  // convert vertices to string points for react SVG Polygon
  const polygonPoints = vertices.map(v => `${v.x},${v.y}`).join(' ');

  // store positions of letters to be distributed evenly on polygon edges
  const letters = [];
  for (let sideIndex = 0; sideIndex < puzzleData.k; sideIndex++) {
    const start = vertices[sideIndex];
    const end = vertices[(sideIndex + 1) % puzzleData.k];
    const sideLetters = puzzleData.sides[sideIndex];

    const edgeVecX = end.x - start.x;
    const edgeVecY = end.y - start.y;

    const maxIndex = puzzleData.n - 1;
    const margin = 0.12; // margin from edge ends, acts as buffer so letters do not overlap

    for (let letterIndex = 0; letterIndex < puzzleData.n; letterIndex++) {
      const t = maxIndex === 0
        ? 0.5
        : margin + ((1 - 2 * margin) * letterIndex) / maxIndex;

      const x = start.x + edgeVecX * t - letterSize / 2;
      const y = start.y + edgeVecY * t - letterSize / 2;

      letters.push({
        letter: sideLetters[letterIndex],
        sideIndex,
        letterIndex,
        x,
        y,
      });
    }
  }

  // now, we write the HTML to display the game
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* left side for word display and buttons */}
        <View style={[styles.leftPanel, { width: leftWidth }]}>
          <Text style={styles.title}>{puzzleData.k}-PARTITE LETTER BOXED</Text>

          <View style={styles.wordBox}>
            <Text style={styles.word}>{currentWord.join('')}</Text>
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusText}>{statusMessage}</Text>
          </View>


          <View style={styles.actions}>
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClear} style={styles.button}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* right side for k-partite graph and letters */}
        <View style={[styles.rightPanel, { width: rightWidth }]}>
          <Svg width={rightWidth} height={windowHeight}>

  {/* this tag displays the shape of the k-partite graph as a readable polygon */}
  <Polygon
    points={polygonPoints}
    fill="#ffffff"
    stroke="#000000"
    strokeWidth={3}
    strokeLinejoin="round"
  />

{completedPaths.map((path, wordIndex) =>
  // loop and construct a path of previous completed words
  path.map((step, i) => {
    if (i === 0) return null;

    const prev = letters.find(
      (l) =>
        l.sideIndex === path[i - 1].sideIndex &&
        l.letterIndex === path[i - 1].letterIndex
    );
    const curr = letters.find(
      (l) =>
        l.sideIndex === step.sideIndex &&
        l.letterIndex === step.letterIndex
    );

    if (!prev || !curr) return null;

    // and display them as lines for each edge
    return (
      <Line
        key={`completed-${wordIndex}-${i}`}
        x1={prev.x + letterSize / 2}
        y1={prev.y + letterSize / 2}
        x2={curr.x + letterSize / 2}
        y2={curr.y + letterSize / 2}
        stroke="#d6cece"
        strokeWidth={3}
        strokeLinecap="round"
      />
    );
  })
)}


  {currentWord.length > 1 &&
    currentWord.map((letter, i) => {
      // loop and construct a path for current word
      if (i === 0) return null;

      const prevLetter = currentWord[i - 1];
      const prevSide = usedSides[i - 1].sideIndex;
      const prevLetterIndex = usedSides[i - 1].letterIndex;

      const currLetter = letter;
      const currSide = usedSides[i].sideIndex;
      const currLetterIndex = usedSides[i].letterIndex;

      const prev = letters.find(
        (l) =>
          l.letter === prevLetter &&
          l.sideIndex === prevSide &&
          l.letterIndex === prevLetterIndex
      );
      const curr = letters.find(
        (l) =>
          l.letter === currLetter &&
          l.sideIndex === currSide &&
          l.letterIndex === currLetterIndex
      );

      if (!prev || !curr) return null;

      // and display a line between edges of current word
      return (
        <Line
          key={`line-${i}`}
          x1={prev.x + letterSize / 2}
          y1={prev.y + letterSize / 2}
          x2={curr.x + letterSize / 2}
          y2={curr.y + letterSize / 2}
          stroke="#faa6a4"
          strokeWidth={5}
          strokeLinecap="round"
        />
      );
    })}
</Svg>

  {letters.map((item, idx) => {
  const isUsed = usedLetters.some(
    (used) =>
      used.sideIndex === item.sideIndex &&
      used.letterIndex === item.letterIndex
  );

  // display the buttons for each letter (we've already calculated positions above)
  return (
    <Pressable
  key={idx}
  onPress={() => handleLetterPress(item.letter, item.sideIndex, item.letterIndex)}
  style={({ pressed }) => [
    styles.letter,
    {
      position: 'absolute',
      left: item.x,
      top: item.y,
      width: letterSize,
      height: letterSize,
      borderRadius: letterSize / 2,
      backgroundColor: isUsed ? '#d6cece' : '#ffffff',
      transform: [{ scale: pressed ? 1.1 : 1 }], // scale up 10% when pressed
    },
  ]}
>
  <Text style={styles.letterText}>{item.letter}</Text>
</Pressable>


  );
})}

        </View>
      </View>
    </SafeAreaView>
  );
}

// the rest of the file is for styles, no need for comments
// the styles closely match the real styles of NYT's own game
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faa6a4' },
  content: { flexDirection: 'row', flex: 1 },
  leftPanel: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightPanel: {
    position: 'relative', 
    height: '100%',
  },
  title: { fontSize: 40, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  letter: {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    position: 'absolute',
  },
  letterText: { fontSize: 23, fontWeight: 'bold' },
  wordBox: {
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  word: { fontSize: 28, fontWeight: '600' },
  actions: { width: '20%' },
  button: {
    backgroundColor: '#faa6a4',
    padding: 12,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 100,
    marginBottom: 15,
    minWidth: '100%',
  },
  buttonText: { color: '#3c3c3c', fontWeight: '300', textAlign: 'center', fontSize: 17 },
  statusBox: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },  
});
