---
title: "Local Storage File Sytem"
date: "2025-07-07"
# last_modified_at: "2025-07-07"
description: "Mini-project to create a proof of concept in-browser file system using local storage"
categories: [
  miscellaneous
]
tags: [
  coding, webdev, html, javascript, css, json, local storage, localstorage, split.js, split js, cdn, file system, filesystem, font awesome, icons
]
---

# Local Storage File Sytem
The aim for this mini-project was to create a usable UI for an in-browser filesystem. It is mostly a proof of concept but is technically usable.

The file system the user sees is created via vanilla `HTML` / `CSS` / `JavaScript`, and allow them to write text as well as create and delete files. The functionality behind the scenes creating the persistent file system is handled in `JavaScript` using `localStorage` and simply stores all files in a single `JSON` string, the entirity of which is updated when any changes are made to a file the user interacts with.


# Dependencies
**Split.js** - The site uses [`Split.js`](https://split.js.org/) to create a draggable divider between the sidebar and the file text
- The script tag for `Split.js` is `<script src="https://cdnjs.cloudflare.com/ajax/libs/split.js/1.6.2/split.min.js"></script>`
    - In this project I avoided the usual script tag method and instead import via a `dynamic import` method in `JavaScript`

**Font Awesome** - The site uses [`Font Awesome`](https://fontawesome.com/icons) for icon images on buttons
- The script tag for `Font Awesome` is `<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"></script>`

# Miscellaneous
- The code has gotten incredibly messy at the end to add certain quality of life features, mostly in the form of event listeners. Hopefully the gist of the code is understandable as it is mainly a proof of concept / learning piece for personal use