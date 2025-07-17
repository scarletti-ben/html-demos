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
        new TerminalCommand('scroll', (widget, shell, command, ...args) => {
            const disabled = widget.toggleScrollbar();
            widget.echo(`Scrollbar ${disabled ? 'disabled' : 'enabled'}`);
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

                myodide._pyodide.setStdout({
                    batched: (message) => {
                        widget.echo(`>>> ${message}`);
                    }
                });

                myodide._pyodide.setStderr({
                    batched: (message) => {
                        widget.echo(message, 'error')
                    }
                });

                myodide._pyodide.setStdin({
                    readline: () => prompt("input requested") || ""
                });

            }

            hijacker._handleKeyDown = (event) => {

                if (event.key === 'Enter' && !event.shiftKey) {

                    // Do not add a newline character
                    event.preventDefault();

                    const code = widget.textarea.value;

                    let result;
                    try {
                        result = myodide.run(code);
                    } catch (error) {
                        // const name = error.name;

                        console.log(error.type);

                        if (error.type === 'SystemExit') {
                            hijacker.detatch();
                            return;
                        }

                        const message = error.message.trim().split('\n').pop();
                        result = `${message}`;
                        widget.echo(`${result}`);
                    }

                    setTimeout(() => {
                        widget.textarea.value = '';
                    }, 0);

                } else if (event.key === 'Enter' && event.shiftKey) {

                    setTimeout(() => widget._autoResize(), 0);

                }

            };

            hijacker.onEnter = (shell) => {

                widget.setPrompt('>>>', 1);

                widget.shadowRoot.host.className = 'green';
                widget.clearScreen();
                widget.echo('Welcome to Myodide v0.0.19', 'success');

                let div = document.createElement('div');
                div.className = 'output';
                div.innerHTML = `Use <span class="info">Shift + Enter</span> for multi-line input, <span class="info">Enter</span> to execute`;
                shell.widget.addToScreen(div);


                div = document.createElement('div');
                div.className = 'output';
                div.innerHTML = `Type <span class="themed">quit()</span> to return to shell`;
                shell.widget.addToScreen(div);

                setTimeout(() => {
                    widget.textarea.value = '';
                }, 0);

            };

            hijacker.onExit = (shell) => {

                widget.setPrompt('$', 2);

                widget.shadowRoot.host.className = '';
                widget.echo('Exiting Myodide...', 'info');

                setTimeout(() => {
                    widget.textarea.value = '';
                }, 0);

            };

            hijacker.attachTo(shell);

        })
    ]

    shell.commands.push(...commands);

    main.appendChild(widget);

    widget.toggleScrollbar();

    widget.textarea.focus();

})();