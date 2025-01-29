
let pythonCode = `

import asyncio
import sys
import pygame
import js

async def main():

    pygame.init()
    pygame.display.init()
    screen = pygame.display.set_mode([640, 480], vsync = "-vsync" in sys.argv)
    screen.fill([0, 0, 0])
    pygame.display.flip()

    screen_rect = screen.get_rect()
    green_rect = pygame.Rect(0, 0, screen_rect.w // 2, screen_rect.h // 2)
    green_rect.center = screen_rect.center

    fps = 60
    tick = 1 / fps
    running = True

    while running:

        screen.fill([0, 0, 0])

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                running = False

        pygame.draw.rect(screen, (0, 255, 0), green_rect)
        pygame.display.flip()
        await asyncio.sleep(tick)

    js.alert("running = False")

    pygame.quit()

main()

`

async function main(){
  let pyodide = await loadPyodide();
  await pyodide.loadPackage(["pygame-ce"], { checkIntegrity: false })

  canvas = document.getElementById("canvas");
  pyodide.canvas.setCanvas2D(canvas);
  pyodide.runPythonAsync(pythonCode)
  
}

main()