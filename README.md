<div align="center">
<h1>use-context-menu</h1>

<p>A React hook for easily creating custom Context Menus! The hooks takes care of the logic and creating the a11y attributes, you take care of the UI!</p>

</div>

<hr />

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [API](#api)
- [Examples](#examples)

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save react-use-context-menu
```

or

```
yarn add react-use-context-menu
```

## Features

 - Supports Keyboard navigation
 - Fully customizable
 - Fully accessible
 - No dependencies
 - Only 1kb gzipped
 - RTL support
 - supports touch screen with hold to display!
 - Detects the size of the menu and always places it inside the viewport when clicking near the borders.
 - ESM and CommonJS dist

## Usage

Basic usage:

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import useContextMenu from 'react-use-context-menu'

function App() {
  const [
    bindMenu,
    bindMenuItems,
    useContextTrigger
  ] = useContextMenu();
  const [bindTrigger] = useContextTrigger(});
  return (
    <div className="App">
      <h1>useContextMenu</h1>
      <h2 {...bindTrigger}>Right click me to see some magic happen!</h2>
      <nav {...bindMenu}>
        <div {...bindMenuItems}>First action</div>
        <div {...bindMenuItems}>Second action</div>
        <hr/>
        <div {...bindMenuItems}>Last action</div>
      </nav>
    </div>
  );
}
```

## API

```jsx
const [
    bindMenu,
    bindMenuItems,
    useContextTrigger,
    {
        data, // the data collected by the collect function of useContextTrigger
        coords, // a 2d Array [x, y] returning the coords of the point where the right click was triggered
        setCoords, // manually set the coords of the menu
        isVisible, // Boolean indicating if the menu is visible or not
        setVisible, // manually set the context menu visible with setVisible(true) or hidden with setVisible(false)
    }
  ] = useContextMenu({
      rtl: false, // Optional, set to true to enable RightToLeft menu,
      handleElementSelect: el => el.focus() // Handles the element being selected with keyboard. Optional, focus is the default behaviour
  });
```

### bindMenu
The first element of the result array is an Object used to bind the context menu element.
It has 4 properties:
```js
{
    style, // Mandatory
    ref, // Mandatory
    role: "menu", // Optional, if you don't care about a11y 😠
    tabIndex: -1 // same as above, also this is needed for keayboard navigation
}
```
Keep in mind that you need to spread this over an actual element (like a div or a nav), if you spread it to a Component, then the Component should take care of passing the props to the underlying wrapper element.
If you as well need to access the ref of the element you can simply do:
```jsx
<div {...bindMenu} ref={(el) => {
    bindMenu.ref(el);
    // you logic here
}}
```

### bindMenuItems

The second element is an Object with 3 props:
```js
{
    ref, // Mandatory
    role: "menuitem", // Optional, if you don't care about a11y 😠
    tabIndex: -1 // same as above, also this is needed for keayboard navigation
}
```
used to bind the menu items. You can spread it or assign the props one by one. Same as above applies.

### useContextTrigger
The third element of the result array is another hook which you should use to bind the trigger component(s), which is the component which will trigger the context menu when right clicked.
It accepts an optional config object for fine tuning and advanced usage
```js
const [bindTrigger] = useContextTrigger({
// those are the default values 
  disable: false, // disable the trigger
  holdToDisplay: 1000, // time in ms after which the context menu will appear when holding the touch
  posX: 0, // distance in pixel from which the context menu will appear related to the right click X coord
  posY: 0, // distance in pixel from which the context menu will appear related to the right click y coord
  mouseButton: MOUSE_BUTTON.RIGHT, // set to 0 for triggering the context menu with the left click
  disableIfShiftIsPressed: false, // Self explanatory 😺
  collect: () => 'useContextMenu is cool!' // collect data to be passed to the context menu, see the example to see this in action
});
```

## Examples:

You can check the example folder or [this codesandbox][codesandbox-example] for more advanced examples.

## Comparison with other similar packages

This is the first package implemented using hooks so far for what I've seen!
Other packages are using components which requires lot of configuration and are way bigger in size.
Also this is the smallest and most configurable 💃

## Gratitude
This package have been deeply inspired by https://github.com/vkbansal/react-contextmenu, thanks a lot to @vkbansal! 🙏

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[codesandbox-example]: https://codesandbox.io/s/hopeful-hopper-v4zzv?fontsize=14

## LICENSE

MIT