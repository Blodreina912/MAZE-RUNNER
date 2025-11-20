import React, { useState, useEffect } from 'react';

const ROWS = 20;
const COLS = 40;
const START_NODE = { row: 10, col: 5 };
const END_NODE = { row: 10, col: 35 };

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [algorithm, setAlgorithm] = useState('astar');
  const [speed, setSpeed] = useState(50);
  const [stats, setStats] = useState({ visited: 0, pathLength: 0, time: 0 });
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < COLS; col++) {
        currentRow.push(createNode(row, col));
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
    setStats({ visited: 0, pathLength: 0, time: 0 });
  };

  const createNode = (row, col) => ({
    row,
    col,
    isStart: row === START_NODE.row && col === START_NODE.col,
    isEnd: row === END_NODE.row && col === END_NODE.col,
    isWall: false,
    isVisited: false,
    isPath: false,
    distance: Infinity,
    previousNode: null,
  });

  const toggleWall = (row, col) => {
    if (isVisualizing) return;
    const node = grid[row][col];
    if (node.isStart || node.isEnd) return;
    
    const newGrid = grid.slice();
    const newNode = { ...newGrid[row][col], isWall: !newGrid[row][col].isWall };
    newGrid[row][col] = newNode;
    setGrid(newGrid);
  };

  const visualize = async () => {
    if (isVisualizing) return;
    clearPath();
    
    setIsVisualizing(true);
    const startTime = Date.now();
    
    const gridCopy = grid.map(row => row.map(node => ({ ...node, isVisited: false, isPath: false, distance: Infinity, previousNode: null })));
    const startNode = gridCopy[START_NODE.row][START_NODE.col];
    const endNode = gridCopy[END_NODE.row][END_NODE.col];
    
    let visitedNodesInOrder = [];
    
    switch(algorithm) {
      case 'astar':
        visitedNodesInOrder = astar(gridCopy, startNode, endNode);
        break;
      case 'dijkstra':
        visitedNodesInOrder = dijkstra(gridCopy, startNode, endNode);
        break;
      case 'bfs':
        visitedNodesInOrder = bfs(gridCopy, startNode, endNode);
        break;
      case 'dfs':
        visitedNodesInOrder = dfs(gridCopy, startNode, endNode);
        break;
    }
    
    await animateAlgorithm(visitedNodesInOrder, endNode, startTime);
    setIsVisualizing(false);
  };

  const animateAlgorithm = async (visitedNodesInOrder, endNode, startTime) => {
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100 - speed));
      const node = visitedNodesInOrder[i];
      const newGrid = grid.slice();
      newGrid[node.row][node.col] = { ...node, isVisited: true };
      setGrid(newGrid);
    }
    
    const path = getPath(endNode);
    await animatePath(path);
    
    const time = Date.now() - startTime;
    setStats({ visited: visitedNodesInOrder.length, pathLength: path.length, time });
  };

  const animatePath = async (path) => {
    for (let i = 0; i < path.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      const node = path[i];
      const newGrid = grid.slice();
      newGrid[node.row][node.col] = { ...node, isPath: true };
      setGrid(newGrid);
    }
  };

  const getNeighbors = (node, grid) => {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(n => !n.isWall);
  };

  const heuristic = (node, endNode) => {
    return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
  };

  const astar = (grid, startNode, endNode) => {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const openSet = [startNode];
    
    while (openSet.length > 0) {
      openSet.sort((a, b) => (a.distance + heuristic(a, endNode)) - (b.distance + heuristic(b, endNode)));
      const current = openSet.shift();
      
      if (current.isWall) continue;
      if (current.distance === Infinity) break;
      
      current.isVisited = true;
      visitedNodesInOrder.push(current);
      
      if (current === endNode) break;
      
      const neighbors = getNeighbors(current, grid);
      for (const neighbor of neighbors) {
        const tentativeDistance = current.distance + 1;
        if (tentativeDistance < neighbor.distance) {
          neighbor.distance = tentativeDistance;
          neighbor.previousNode = current;
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }
    
    return visitedNodesInOrder;
  };

  const dijkstra = (grid, startNode, endNode) => {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = grid.flat();
    
    while (unvisitedNodes.length > 0) {
      unvisitedNodes.sort((a, b) => a.distance - b.distance);
      const closestNode = unvisitedNodes.shift();
      
      if (closestNode.isWall) continue;
      if (closestNode.distance === Infinity) break;
      
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      
      if (closestNode === endNode) break;
      
      const neighbors = getNeighbors(closestNode, grid);
      for (const neighbor of neighbors) {
        const newDistance = closestNode.distance + 1;
        if (newDistance < neighbor.distance) {
          neighbor.distance = newDistance;
          neighbor.previousNode = closestNode;
        }
      }
    }
    
    return visitedNodesInOrder;
  };

  const bfs = (grid, startNode, endNode) => {
    const visitedNodesInOrder = [];
    const queue = [startNode];
    startNode.isVisited = true;
    
    while (queue.length > 0) {
      const current = queue.shift();
      visitedNodesInOrder.push(current);
      
      if (current === endNode) break;
      
      const neighbors = getNeighbors(current, grid);
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          neighbor.isVisited = true;
          neighbor.previousNode = current;
          queue.push(neighbor);
        }
      }
    }
    
    return visitedNodesInOrder;
  };

  const dfs = (grid, startNode, endNode) => {
    const visitedNodesInOrder = [];
    const stack = [startNode];
    
    while (stack.length > 0) {
      const current = stack.pop();
      
      if (current.isVisited || current.isWall) continue;
      
      current.isVisited = true;
      visitedNodesInOrder.push(current);
      
      if (current === endNode) break;
      
      const neighbors = getNeighbors(current, grid);
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          neighbor.previousNode = current;
          stack.push(neighbor);
        }
      }
    }
    
    return visitedNodesInOrder;
  };

  const getPath = (endNode) => {
    const path = [];
    let current = endNode;
    while (current !== null) {
      path.unshift(current);
      current = current.previousNode;
    }
    return path.length > 1 ? path : [];
  };

  const clearPath = () => {
    const newGrid = grid.map(row => 
      row.map(node => ({ ...node, isVisited: false, isPath: false, distance: Infinity, previousNode: null }))
    );
    setGrid(newGrid);
    setStats({ visited: 0, pathLength: 0, time: 0 });
  };

  const generateMaze = () => {
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isWall: !node.isStart && !node.isEnd && Math.random() < 0.3,
        isVisited: false,
        isPath: false
      }))
    );
    setGrid(newGrid);
    setStats({ visited: 0, pathLength: 0, time: 0 });
  };

  const getNodeStyle = (node) => {
    let backgroundColor = '#fff';
    if (node.isStart) backgroundColor = '#10b981';
    else if (node.isEnd) backgroundColor = '#ef4444';
    else if (node.isWall) backgroundColor = '#1f2937';
    else if (node.isPath) backgroundColor = '#fbbf24';
    else if (node.isVisited) backgroundColor = '#60a5fa';
    
    return {
      width: '24px',
      height: '24px',
      backgroundColor,
      border: '1px solid #e5e7eb',
      display: 'inline-block',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    };
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Pathfinding Visualizer</h1>
        <p style={{ color: '#e5e7eb', marginBottom: '2rem', fontSize: '1.125rem' }}>Visualize popular pathfinding algorithms in action</p>
        
        <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              disabled={isVisualizing}
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', fontSize: '1rem' }}
            >
              <option value="astar">A* Search</option>
              <option value="dijkstra">Dijkstra</option>
              <option value="bfs">Breadth-First Search</option>
              <option value="dfs">Depth-First Search</option>
            </select>
            
            <button
              onClick={visualize}
              disabled={isVisualizing}
              style={{ background: '#3b82f6', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '8px', border: 'none', cursor: isVisualizing ? 'not-allowed' : 'pointer', fontSize: '1rem', opacity: isVisualizing ? 0.5 : 1 }}
            >
              ▶ Visualize
            </button>
            
            <button
              onClick={clearPath}
              disabled={isVisualizing}
              style={{ background: '#f97316', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '8px', border: 'none', cursor: isVisualizing ? 'not-allowed' : 'pointer', fontSize: '1rem', opacity: isVisualizing ? 0.5 : 1 }}
            >
              ↻ Clear Path
            </button>
            
            <button
              onClick={initializeGrid}
              disabled={isVisualizing}
              style={{ background: '#8b5cf6', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '8px', border: 'none', cursor: isVisualizing ? 'not-allowed' : 'pointer', fontSize: '1rem', opacity: isVisualizing ? 0.5 : 1 }}
            >
              ⊞ Reset Grid
            </button>
            
            <button
              onClick={generateMaze}
              disabled={isVisualizing}
              style={{ background: '#f59e0b', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '8px', border: 'none', cursor: isVisualizing ? 'not-allowed' : 'pointer', fontSize: '1rem', opacity: isVisualizing ? 0.5 : 1 }}
            >
              ⚡ Generate Maze
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ color: 'white', fontSize: '0.875rem' }}>Speed:</label>
              <input
                type="range"
                min="0"
                max="90"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                disabled={isVisualizing}
                style={{ width: '8rem' }}
              />
            </div>
          </div>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ display: 'flex', gap: '2rem', color: 'white' }}>
            <div>
              <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Nodes Visited</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{stats.visited}</div>
            </div>
            <div>
              <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Path Length</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{stats.pathLength}</div>
            </div>
            <div>
              <div style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Time</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{stats.time}ms</div>
            </div>
          </div>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.2)', overflowX: 'auto' }}>
          <div
            onMouseLeave={() => setIsDrawing(false)}
          >
            {grid.map((row, rowIdx) => (
              <div key={rowIdx} style={{ lineHeight: 0 }}>
                {row.map((node, nodeIdx) => (
                  <div
                    key={nodeIdx}
                    style={getNodeStyle(node)}
                    onMouseDown={() => {
                      setIsDrawing(true);
                      toggleWall(node.row, node.col);
                    }}
                    onMouseEnter={() => {
                      if (isDrawing) toggleWall(node.row, node.col);
                    }}
                    onMouseUp={() => setIsDrawing(false)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ marginTop: '1.5rem', color: '#d1d5db', fontSize: '0.875rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-block', width: '16px', height: '16px', background: '#10b981', borderRadius: '2px' }}></span> Start
            <span style={{ margin: '0 0.5rem' }}>•</span>
            <span style={{ display: 'inline-block', width: '16px', height: '16px', background: '#ef4444', borderRadius: '2px' }}></span> End
            <span style={{ margin: '0 0.5rem' }}>•</span>
            Click and drag to draw walls
            <span style={{ margin: '0 0.5rem' }}>•</span>
            Built with React
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathfindingVisualizer;