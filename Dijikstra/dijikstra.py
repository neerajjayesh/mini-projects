import pygame
import heapq

WIDTH, HEIGHT = 600, 600
ROWS, COLS = 20, 20
CELL_SIZE = WIDTH // COLS #coloumn and row sizes and square sizes

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
BLUE = (50, 150, 255)
RED = (255, 50, 50)
GREEN = (50, 255, 100)
GRAY = (200, 200, 200)
YELLOW = (255, 255, 0)

pygame.init()  #pygame initilization
win = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Dijkstra Pathfinding Visualizer")


grid = [[0 for _ in range(COLS)] for _ in range(ROWS)]  #0=empty and 1=wall
start, goal = None, None
path = [] #storing final path


def draw_grid(): #draw grid fn
    for r in range(ROWS):
        for c in range(COLS):
            color = WHITE
            if grid[r][c] == 1:
                color = BLACK
            pygame.draw.rect(win, color, (c*CELL_SIZE, r*CELL_SIZE, CELL_SIZE, CELL_SIZE))
            pygame.draw.rect(win, GRAY, (c*CELL_SIZE, r*CELL_SIZE, CELL_SIZE, CELL_SIZE), 1)

    # Draw path (if exists)
    for r, c in path:
        pygame.draw.rect(win, YELLOW, (c*CELL_SIZE, r*CELL_SIZE, CELL_SIZE, CELL_SIZE))

    if start:
        pygame.draw.rect(win, GREEN, (start[1]*CELL_SIZE, start[0]*CELL_SIZE, CELL_SIZE, CELL_SIZE))
    if goal:
        pygame.draw.rect(win, RED, (goal[1]*CELL_SIZE, goal[0]*CELL_SIZE, CELL_SIZE, CELL_SIZE))

def neighbors(r, c):
    for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
        rr, cc = r+dr, c+dc
        if 0 <= rr < ROWS and 0 <= cc < COLS and grid[rr][cc] == 0:
            yield rr, cc

def dijkstra(start, goal): #main function
    dist = {start: 0}
    prev = {}
    pq = [(0, start)]
    visited = set()

    while pq:
        d, node = heapq.heappop(pq)
        if node in visited:
            continue
        visited.add(node)

        # Visualization step
        pygame.draw.rect(win, BLUE, (node[1]*CELL_SIZE, node[0]*CELL_SIZE, CELL_SIZE, CELL_SIZE))
        pygame.display.update()
        pygame.time.delay(30)

        if node == goal:
            break

        for nbr in neighbors(*node):
            new_cost = d + 1
            if new_cost < dist.get(nbr, float('inf')):
                dist[nbr] = new_cost
                prev[nbr] = node
                heapq.heappush(pq, (new_cost, nbr))

    #reconstruct path
    p = []
    node = goal
    while node in prev:
        p.append(node)
        node = prev[node]
    p.reverse()
    return p

#Loop Main
running = True
while running:
    draw_grid()
    pygame.display.update()

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        if pygame.mouse.get_pressed()[0]:  #Left click = walls
            x, y = pygame.mouse.get_pos()
            grid[y//CELL_SIZE][x//CELL_SIZE] = 1

        if pygame.mouse.get_pressed()[2]:  #Right click = erase walls
            x, y = pygame.mouse.get_pos()
            grid[y//CELL_SIZE][x//CELL_SIZE] = 0

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_s:  #Press S to set start
                x, y = pygame.mouse.get_pos()
                start = (y//CELL_SIZE, x//CELL_SIZE)
            if event.key == pygame.K_g:  #Press G to set goal
                x, y = pygame.mouse.get_pos()
                goal = (y//CELL_SIZE, x//CELL_SIZE)
            if event.key == pygame.K_SPACE and start and goal:  #Run Dijkstra fn
                path = dijkstra(start, goal)
            if event.key == pygame.K_r: 
                grid = [[0 for _ in range(COLS)] for _ in range(ROWS)]
                start, goal, path = None, None, []

pygame.quit()
