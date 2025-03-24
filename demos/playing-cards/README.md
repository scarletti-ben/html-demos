# Playing Cards

## Overview
Attempt to learn how to make custom `HTML` elements, and make a deck of 52 `SVG` cards. I was prompted to do this as an overhaul of [Cardmeister](https://github.com/cardmeister/cardmeister.github.io) which was overly complicated for my needs, and didn't have a simple feature to flip the cards. In the end it felt like it would be easiest for me to create my own custom `HTML` element that I could interface with exactly as I need.

## Learnings
- Created a `PlayingCard` custom element / class by extending `HTMLElement` via `class PlayingCard extends HTMLElement`
- Redefined `magic methods` for the custom element which are called by DOM events
  - `connectedCallback()`: Runs when the element is added to the DOM
  - `attributeChangedCallback()`: Detects attribute changes and updates accordingly
- Custom elements should not have children in the constructor, and it is best to encapsulate in `connectedCallback()`
- Custom elements need to be registered via `customElements.define('playing-card', PlayingCard)`

## Features
- Custom HTML element: `<playing-card>`
- Custom attributes `<playing-card rank='2' suit='clubs' flipped='false'>`
- Auto-updating `SVG` image file when attributes change

## Miscellaneous
- Cards don't have explicit height and width and instead fill parent, and the svg img does the same, aspect ratio is maintained by svg but you need to give width / height in css to playing-card unless in grid.

## Other Useful Links
- [Cardmeister Demo](https://cardmeister.github.io/index.html)
- [Deck of Cards](https://deck.of.cards/old/)

## ! CHANGES
Added codes.js and removed dependency on .svg files

> [!IMPORTANT]  
> PlayingCard custom element constructor should not have arguments as per HTML specification