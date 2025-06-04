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
import Svg, { Line, Polygon } from 'react-native-svg';
import wordList from 'an-array-of-english-words';




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
    ['G', 'A', 'T'],  // 0
    ['L', 'E', 'F'],  // 1
    ['I', 'N', 'D'],  // 2
    ['R', 'O', 'S'],  // 3
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
  const [statusMessage, setStatusMessage] = useState('');
  const [currentWord, setCurrentWord] = useState([]);
  const [usedSides, setUsedSides] = useState([]);
  const [usedLetters, setUsedLetters] = useState([]);
  const [lastAcceptedLastLetter, setLastAcceptedLastLetter] = useState(null);
  const [wordsAcceptedCount, setWordsAcceptedCount] = useState(0);
  const [completedPaths, setCompletedPaths] = useState([]);




  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  // Layout: Left and Right panel widths
  const leftWidth = windowWidth * 0.4;
  const rightWidth = windowWidth * 0.6;

  // Polygon center inside the right panel (coordinates relative to right panel)
  const centerX = rightWidth / 2;
  const centerY = windowHeight / 2;

  // Radius to fit polygon nicely inside right panel with margin
  const radius = Math.min(rightWidth, windowHeight) / 2 - 40;

  const letterSize = 40;

  // Handle letter press: prevent choosing letters from same side consecutively
  const handleLetterPress = (letter, sideIndex, letterIndex) => {
    if (
      currentWord.length === 0 && 
      lastAcceptedLastLetter !== null && 
      letter.toLowerCase() !== lastAcceptedLastLetter
    ) {
      setStatusMessage(
        `The first letter must be "${lastAcceptedLastLetter.toUpperCase()}".`
      );
      return;
    }
  
    if (usedSides.length === 0 || usedSides[usedSides.length - 1].sideIndex !== sideIndex) {
      setCurrentWord([...currentWord, letter]);
      setUsedSides([...usedSides, { sideIndex, letterIndex }]);
      setStatusMessage('');
    } else {
      setStatusMessage("Can't use two letters from the same side consecutively.");
    }
  };
  

  const handleClear = () => {
    setCurrentWord([]);
    setUsedSides([]);
  };

  const handleSubmit = () => {
    const word = currentWord.join('').toLowerCase();
  
    if (word.length < 3) {
      setStatusMessage("Word must be at least 3 letters.");
      return;
    }
  
    if (!wordList.includes(word)) {
      setStatusMessage(`"${word}" is not in the dictionary.`);
      handleClear();
      return;
    }
  
    const newUsedLetters = [...usedLetters, ...usedSides];
    setUsedLetters(newUsedLetters);
    setWordsAcceptedCount(wordsAcceptedCount + 1);

    setCompletedPaths([
      ...completedPaths,
      [...usedSides], // Save the path of this word
    ]);
    
  
    // Check if all letters are used
    const totalLetters = puzzleData.k * puzzleData.n;
    const uniqueUsedLettersCount = new Set(
      newUsedLetters.map(
        (used) => `${used.sideIndex}-${used.letterIndex}`
      )
    ).size;
  
    if (uniqueUsedLettersCount === totalLetters) {
      setStatusMessage(`You won! All letters used in ${wordsAcceptedCount + 1} words!`);
    } else {
      setStatusMessage(`"${word}" accepted!`);
    }
  
    setLastAcceptedLastLetter(word[word.length - 1]);
    handleClear();
  };
  
  
  

  // Calculate polygon vertices in right panel coordinate space
  const angleStep = (2 * Math.PI) / puzzleData.k;
  const vertices = [];
  for (let i = 0; i < puzzleData.k; i++) {
    const angle = angleStep * i - Math.PI / 2; // start pointing up
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    vertices.push({ x, y });
  }

  // Convert vertices to string points for SVG Polygon
  const polygonPoints = vertices.map(v => `${v.x},${v.y}`).join(' ');

  // Calculate letters positioned evenly on polygon edges
  const letters = [];
  for (let sideIndex = 0; sideIndex < puzzleData.k; sideIndex++) {
    const start = vertices[sideIndex];
    const end = vertices[(sideIndex + 1) % puzzleData.k];
    const sideLetters = puzzleData.sides[sideIndex];

    const edgeVecX = end.x - start.x;
    const edgeVecY = end.y - start.y;

    const maxIndex = puzzleData.n - 1;
    const margin = 0.12; // margin from edge ends

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Left side: word display and buttons */}
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

        {/* Right side: polygon and letters */}
        <View style={[styles.rightPanel, { width: rightWidth }]}>
          <Svg width={rightWidth} height={windowHeight}>
  <Polygon
    points={polygonPoints}
    fill="#ffffff"
    stroke="#000000"
    strokeWidth={3}
    strokeLinejoin="round"
  />

{completedPaths.map((path, wordIndex) =>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faa6a4' },
  content: { flexDirection: 'row', flex: 1 },
  leftPanel: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightPanel: {
    position: 'relative', // important for absolute positioning inside
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
