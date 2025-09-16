# Dijkstra Pathfinding Visualizer 🟩➡️🟥  

This project is a simple **pathfinding visualizer** built with **Python** and **Pygame**.  
It uses **Dijkstra’s Algorithm** to find the shortest path between a chosen start point and goal point on a grid.  

---

## 📚 What I Learned  

### 🎮 Pygame Basics  
- **Initializing Pygame & Creating a Window**  
  - `pygame.init()` to set up the library.  
  - `pygame.display.set_mode((WIDTH, HEIGHT))` to create the main game window.  

- **Drawing Shapes on the Screen**  
  - Using `pygame.draw.rect()` to draw grid cells with different colors.  
  - Mapping **grid coordinates** (rows, cols) to **pixel coordinates** (x, y).  

- **Screen Updates & Animation**  
  - `pygame.display.update()` to refresh the window with new drawings.  
  - `pygame.time.delay()` to slow down updates for smooth visualization.  

- **User Input Detection**  
  - Detecting **keyboard events** (`pygame.KEYDOWN`) for start, goal, reset, and running the algorithm.  
  - Detecting **mouse clicks** (`pygame.mouse.get_pressed()`) to add/remove walls.  

---

### 🧩 Algorithms & Logic  
- **Grid Representation**  
  - A **2D grid (matrix)** to represent empty spaces, walls, start, and goal.  
  - Each cell stores whether it’s walkable or blocked.  

- **Neighbors Function**  
  - Generating valid moves (up, down, left, right).  
  - Ensuring moves stay inside the grid and avoid walls.  

- **Dijkstra’s Algorithm**  
  - Using a **priority queue (`heapq`)** to always expand the closest node first.  
  - Storing distances and keeping track of visited cells.  
  - Using a `prev` dictionary to reconstruct the shortest path.  

- **Path Visualization**  
  - Coloring explored nodes in **blue** during the search.  
  - Highlighting the final path in **yellow** once the goal is found.  

---
