
let pythonCode = `

import asyncio
import sys
import pygame

screen_dims = [640, 480]

async def main(
    update_rects = True,
    use_layered_dirty = False,
    screen_dims = [640, 480],
    flags = 0
    ):

    if use_layered_dirty:
        update_rects = True

    pygame.init()
    pygame.display.init()
    screen = pygame.display.set_mode(screen_dims, flags, vsync="-vsync" in sys.argv)

    pygame.joystick.init()
    num_joysticks = pygame.joystick.get_count()
    if num_joysticks > 0:
        stick = pygame.joystick.Joystick(0)
        stick.init()

    screen.fill([0, 0, 0])
    pygame.display.flip()

    frames = 0
    background = pygame.Surface(screen.get_size())
    background = background.convert()
    background.fill([0, 0, 0])

    screen_rect = screen.get_rect()
    green_rect = pygame.Rect(0, 0, screen_rect.w // 2, screen_rect.h // 2)
    green_rect.center = screen_rect.center

    running = True
    while running:

        screen.fill([0, 0, 0])

        pygame.draw.rect(screen, (0,255,0), green_rect)

        pygame.display.flip()

        for event in pygame.event.get():
            if event.type in [
                pygame.QUIT,
                pygame.KEYDOWN,
                pygame.JOYBUTTONDOWN,
            ]:
                running = False

        frames += 1

        await asyncio.sleep(0.01)

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