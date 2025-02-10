# StickyNotes (Lite Version)
- This is a permanent version of the lite branch of `StickyNotes` which hopefully still exists at
    - Repository: https://github.com/scarletti-ben/StickyNotes
    - Lite Branch: https://github.com/scarletti-ben/StickyNotes/tree/lite
    - Page: https://scarletti-ben.github.io/StickyNotes/

# Why is this Permanent?
I need consistent access to a lite version of `StickyNotes` for general note keeping as it is useful to me in its current state, but as I will likely be making changes to the repository, and often changing which branch is deployed to `GitHub Pages`, I cannot guarantee a consistent experience. Creating a 'permanent' version in `html-demos` means that only small bug fixes are needed and functionality will be consistent at the same `URL`.

## Overview
Project to create a simple StickyNotes app with persistent local storage.

Reduced functionality to reduce visual clutter and be fit for sharing, and altered cloud storage to be a simple share function via `One Time Link` (`OTL`).

Docstrings for functions auto-generated so I assume some issues.

# Features
- Notes are autosaved to `localstorage`
- Notes load from `localstorage` when page loads
- Notes can be manually saved to user device as `.json` file
- Notes can be loaded from `.json` file from user device
- New notes can be added
- Notes can be deleted
- All notes can be removed in a hard reset
- All notes can be shared via a `One Time Link` or `OTL`
    - Opening an `OTL` will load a copy of all notes to the new device
        - The two devices are not in sync with each other, and the `OTL` is deleted on use
- There is a setting called `Toggle Expanding Notes` which will make notes go near fullscreen when being edited
- User prompts are given for important actions

# Testing Locally
- The easiest method is to clone into this repository and run `python -m http.server`