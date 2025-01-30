
let pythonCode = `

import asyncio
import sys
import pygame
import js

js.console.log("inside python code")

async def main():

    pygame.init()
    pygame.display.init()
    screen = pygame.display.set_mode([640, 480], vsync = "-vsync" in sys.argv)
    screen.fill([0, 0, 0])
    pygame.display.flip()

    screen_rect = screen.get_rect()
    green_rect = pygame.Rect(0, 0, screen_rect.w // 2, screen_rect.h // 2)
    green_rect.center = screen_rect.center

    fps = 30
    tick = 1 / fps
    running = True

    while running:

        screen.fill([0, 0, 0])

        mouse = pygame.mouse.get_pos()
        green_rect.center = mouse

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                running = False

        pygame.draw.rect(screen, (0, 255, 0), green_rect)
        # pygame.display.flip()
        pygame.display.update(green_rect)
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