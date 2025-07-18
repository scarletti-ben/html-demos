// script.js v1.0.1 iife [modified]
// < ======================================================
// < Imports
// < ======================================================

import {
    TerminalWidget,
    TerminalShell,
    TerminalCommand,
    TerminalHijacker
} from "./components/terminal-widget.js";

import {
    Myodide
} from "./libs/myodide.js";

// < ======================================================
// < Element Queries
// < ======================================================

const page = /** @type {HTMLDivElement} */
    (document.getElementById('page'));

const main = /** @type {HTMLDivElement} */
    (document.getElementById('main'));

// ~ ======================================================
// ~ Entry Point
// ~ ======================================================

/**
 * Entry point for the application (IIFE)
 */
(() => {

    /** @type {Myodide | null} */
    let myodide = null;

    const widget = new TerminalWidget();
    const shell = new TerminalShell('SHELL');

    shell.attachTo(widget);

    const commands = [
        new TerminalCommand('clear', (widget, shell, command, ...args) => {
            widget.clearScreen();
        }),
        new TerminalCommand('help', (widget, shell, command, ...args) => {
            shell.showHelp();
        }),
        new TerminalCommand('toggleScrollbar', (widget, shell, command, ...args) => {
            const disabled = widget.toggleScrollbar();
            widget.echo(`Scrollbar ${disabled ? 'disabled' : 'enabled'}`);
        }),
        new TerminalCommand('toggleFullscreen', (widget, shell, command, ...args) => {
            if (document.fullscreenElement === widget) {
                document.exitFullscreen();
            } else {
                widget.requestFullscreen();
            }
        }),
        new TerminalCommand('maximise', (widget, shell, command, ...args) => {
            main.style.height = '100%';
            main.style.width = '100%';
        }),
        new TerminalCommand('minimise', (widget, shell, command, ...args) => {
            main.style.height = '';
            main.style.width = '';
        }),
        new TerminalCommand('myodide', async (widget, shell, command, ...args) => {

            if (args.length > 0) {
                widget.echo('myodide does not take arguments');
                return;
            }

            const hijacker = new TerminalHijacker('myodide');

            if (!myodide) {

                widget.echo('Initialising Myodide, this may take a few seconds...')

                myodide = new Myodide((message) => {
                    widget.echo(message);
                });

                await myodide.init();

                const pyodide = myodide.pyodide;

                pyodide.setStdout({
                    batched: (message) => {
                        widget.echo(`>>> ${message}`);
                    }
                });

                pyodide.setStderr({
                    batched: (message) => {
                        widget.echo(message, 'error');
                    }
                });

                pyodide.setStdin({
                    stdin: () => {
                        return prompt("input requested") || "";
                    }
                });

            }

            hijacker.handleSubmit = (code) => {

                let result;
                try {
                    result = myodide.run(code);
                } catch (error) {
                    console.warn(error.type);
                    if (error.type === 'SystemExit') {
                        hijacker.detatch();
                        return;
                    }
                    const message = error.message.trim().split('\n').pop();
                    result = `${message}`;
                    widget.echo(`${result}`);
                }

            }

            hijacker.onEnter = (shell) => {

                widget.setPrompt('>>>', 1);

                widget.setTheme('green');
                widget.clearScreen();
                widget.echo('Welcome to Myodide v0.0.19', 'success');

                shell.widget.parseToScreen(`<div class='output'>Hotkeys: <span class="info">Shift + Enter</span> for multi-line input, <span class="info">Enter</span> to execute</div>`);

                shell.widget.parseToScreen(`<div class='output'>Type <span class="themed">quit()</span> to return to shell</div>`);

                widget.clearText(0);

            };

            hijacker.onExit = (shell) => {

                widget.setPrompt('$', 2);

                widget.setTheme();
                widget.clearScreen();
                widget.echo('Exited Myodide...', 'themed');
                widget.clearText(0);

            };

            hijacker.attachTo(shell);

        })
    ]

    shell.commands.push(...commands);

    main.appendChild(widget);

    widget.toggleScrollbar();

    widget.textarea.value = 'myodide';
    widget.textarea.focus();

})();