# 🎯 Pathfinding Visualizer

A beautiful, interactive web application that visualizes popular pathfinding algorithms in real-time. Watch how different algorithms explore a grid to find the shortest path between two points!

## ✨ Demo

https://ezgif.com/video-to-gif/ezgif-7c14d82864ff3219.mp4.html
## 🚀 Features

- **4 Pathfinding Algorithms**
  - A* Search (Heuristic-based, most efficient)
  - Dijkstra's Algorithm (Guaranteed shortest path)
  - Breadth-First Search (Unweighted shortest path)
  - Depth-First Search (Explores deeply)

- **Interactive Grid**
  - Click and drag to draw walls
  - Random maze generation
  - Adjustable animation speed
  - Real-time statistics (nodes visited, path length, time)

- **Beautiful UI**
  - Gradient background with glassmorphism effects
  - Smooth animations
  - Responsive design

## 🎮 How to Use

1. **Select an Algorithm** from the dropdown menu
2. **Draw Walls** by clicking and dragging on the grid
3. **Click "Visualize"** to watch the algorithm find the path
4. **Adjust Speed** with the slider for faster/slower animations
5. **Generate Maze** for a random obstacle pattern
6. **Clear Path** to remove visualization without losing walls
7. **Reset Grid** to start fresh

## 🎨 Color Guide

- 🟢 **Green** - Start Node
- 🔴 **Red** - End Node
- ⬛ **Black** - Walls (obstacles)
- 🔵 **Blue** - Visited Nodes (explored during search)
- 🟡 **Yellow** - Final Path (shortest path found)

## 🛠️ Tech Stack

- **React** - UI Framework
- **JavaScript** - Core Logic
- **CSS-in-JS** - Styling with inline styles
- **Algorithm Implementation** - Custom pathfinding algorithms

## 📊 Algorithm Comparison

| Algorithm | Guarantees Shortest Path | Speed | Use Case |
|-----------|-------------------------|-------|----------|
| A* | ✅ Yes | ⚡ Fast | Best for most cases |
| Dijkstra | ✅ Yes | 🐢 Slower | Weighted graphs |
| BFS | ✅ Yes (unweighted) | ⚡ Fast | Unweighted graphs |
| DFS | ❌ No | ⚡ Fast | Maze generation |

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Blodreina912/MAZE-RUNNER.git

# Navigate to project directory
cd MAZE-RUNNER

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
MAZE-RUNNER/
├── src/
│   ├── App.js              # Main component with pathfinding logic
│   ├── index.js            # Entry point
│   └── ...
├── demo/
│   └── demo.gif            # Demo animation
├── package.json
└── README.md
```

## 🧠 How It Works

1. **Grid Initialization**: Creates a 20x40 grid of nodes
2. **Algorithm Execution**: Selected algorithm explores the grid
3. **Animation**: Visited nodes are animated in sequence
4. **Path Reconstruction**: Traces back from end to start using `previousNode` links
5. **Statistics**: Displays performance metrics

### Algorithm Details

**A* Search**
- Uses `f(n) = g(n) + h(n)` where:
  - `g(n)` = distance from start
  - `h(n)` = Manhattan distance heuristic to goal
- Explores toward the goal intelligently

**Dijkstra's Algorithm**
- Explores all nodes by shortest distance
- Guaranteed to find shortest path
- More nodes visited than A*

**Breadth-First Search (BFS)**
- Uses a queue (FIFO)
- Explores level by level
- Optimal for unweighted graphs

**Depth-First Search (DFS)**
- Uses a stack (LIFO)
- Goes deep before exploring neighbors
- Not guaranteed to find shortest path

## 🎯 Future Enhancements

- [ ] Diagonal movement option
- [ ] Weighted nodes (different terrain costs)
- [ ] More maze generation algorithms
- [ ] Bidirectional search
- [ ] Step-by-step mode with pause/play
- [ ] Mobile touch support
- [ ] Save/load maze patterns

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Blodreina912**

- GitHub: [@Blodreina912](https://github.com/Blodreina912)
- Project Link: [https://github.com/Blodreina912/MAZE-RUNNER](https://github.com/Blodreina912/MAZE-RUNNER)

## 🙏 Acknowledgments

- Inspired by classic pathfinding visualizers
- Built as a learning project to understand graph algorithms
- Thanks to the React community for amazing tools and resources

---

⭐ **Star this repo if you found it helpful!** ⭐
