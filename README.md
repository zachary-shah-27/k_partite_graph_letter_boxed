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
   cd k_partite_graph_letter_boxed
   ```
2. **Install packages and run**

    ```bash
    npm install
    npm run web
    ```


## Combinatorics (for fun!)

This game is built on the idea of a **K-partite graph**, where each edge connects letters from different “sides” (really, partitions). That leads to some interesting combinatorics when thinking about possible words.

Of course, there are technically an infinite number of strings one could create for any `k` partitions and `n` letters per side, so let's constrain the size of a word to 3 letters.

### Total Possible 3-Letter Combinations

Assuming:

- `k` sides (for 2 < k < 14 as constrained by the alphabet)
- `n` letters per side (for 9 > n > 1 as constrained by the alphabet)
- Each letter in a word must come from a **different partition** than the previous letter
- We can revisit a partition after forming an edge to another partition
- **Order matters** (think: `TOP` ≠ `POT`)
- For simplicity, let's say all combinations are considered valid (removes the added hassle of having to filter this list for valid english words)

Then the number of all possible 3-letter words is:

```
Total = k × (k - 1) × (k - 1) × n³
```

For example, if `k = 6` and `n = 3`:

```
Total = 6 × 5 × 5 × 3³ = 6 × 5 × 5 × 27 = 4,050
```

That's over 4,000 possible 3-letter combinations just from one puzzle!

This combinatorial structure is what makes the game constantly replayable. No wonder the NYT can update the puzzle daily and never run out of combinations!

