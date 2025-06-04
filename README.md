# K-Partite Graph Recreation of "Letter Boxed" by **NYT**

## Zachary Shah  
### COSC 30  
### Extra Credit / Personal Project  

---

This project is a custom recreation of the popular **"Letter Boxed"** puzzle game by the New York Times, implemented as a **K-Partite graph** puzzle in React Native (web). It was built for COSC 30 as an extra credit assignment and designed from scratch without following an official spec.

---

## Play Online

Try the game live in your browser here:

**https://zachary-shah-27.github.io/k_partite_graph_letter_boxed/**

---

## About the Game

- The puzzle consists of a polygon with `k` sides, each side containing `n` letters.
- Players build words by selecting letters from different sides, respecting K-Partite graph rules.
- Words must be at least 3 letters long and found in a standard English dictionary.
- The goal is to use all letters on the board in valid words.
- The game visualizes both the polygon and the connections between letters in each submitted word.

For a detailed description, see the inline comments in `App.js`.

---

## Running Locally

To run this project on your local machine, you need to have [Node.js](https://nodejs.org/) and [npm](https://npmjs.com) installed.

### Steps:

1. **Clone the repository**

   ```bash
   git clone https://github.com/zachary-shah-27/k_partite_graph_letter_boxed.git
   cd k_partite_graph_letter_boxed```
2. **Install packages and run**

    ```bash
    npm install
    npm run web```
