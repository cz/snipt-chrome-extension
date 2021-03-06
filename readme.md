# Snipt Chrome Extension

Easily post text or code to Snipt.net via browser button, context menu, or keyboard shortcut.

![Snipt extension screenshot](http://i.imgur.com/6Geb5.png)

## Installation

### Stable

1. Go to the [extension page](https://chrome.google.com/webstore/detail/bkmpbmdfadelliddjcjglploolikpeej/) on the Chrome Web Store
2. Click 'Add to Chrome'

### Development

1. `git clone https://github.com/cz/snipt-chrome-extension.git`
2. Open Chrome, and browse to your extensions list
3. Check the 'Developer mode' checkbox
4. Click 'Load unpacked extension'
5. Find the folder you just cloned and save

## Setup

1. Click the Snipt browser button
2. Enter your username and API key
3. Save

## Usage

### Invoking the Snipt extension

There are three ways to invoke the extension:

1. Clicking the Snipt browser button
2. Ctrl+Shift+[
3. Select text, right click, and choose 'Snipt' from the context menu

All three options will grab any text you've selected, but for the first two selecting text is optional.

## Changlog

- 1.2: Change keyboard shortcut due to conflicts; allow popup without text selection
- 1.1: Support for blog posts; `tmp` tag hint (for quick pastes)
- 1.0: Initial release