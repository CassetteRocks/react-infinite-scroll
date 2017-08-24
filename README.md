React Infinite Scroller
=======================

[![Travis](https://img.shields.io/travis/CassetteRocks/react-infinite-scroller.svg?style=flat-square)](https://travis-ci.org/CassetteRocks/react-infinite-scroller)
[![npm](https://img.shields.io/npm/dt/react-infinite-scroller.svg?style=flat-square)](https://www.npmjs.com/package/react-infinite-scroller)
[![React Version](https://img.shields.io/badge/React-%5E0.14.9%20%7C%7C%20%5E15.3.0-blue.svg?style=flat-square)](https://www.npmjs.com/package/react)
[![npm](https://img.shields.io/npm/v/react-infinite-scroller.svg?style=flat-square)](https://www.npmjs.com/package/react-infinite-scroller)
[![npm](https://img.shields.io/npm/l/react-infinite-scroller.svg?style=flat-square)](https://github.com/CassetteRocks/react-infinite-scroller/blob/master/LICENSE)

Infinitely load content using a React Component. This fork maintains a simple, lightweight infinite scroll package that supports both `window` and scrollable elements.

- [Demo](https://cassetterocks.github.io/react-infinite-scroller/demo/)
- [Demo Source](https://github.com/CassetteRocks/react-infinite-scroller/blob/master/docs/src/index.js)

## Installation

```
npm install react-infinite-scroller --save
```
```
yarn add react-infinite-scroller
```

## How to use

```js
import InfiniteScroll from 'react-infinite-scroller';
```

### Window scroll events

```js
<InfiniteScroll
    pageStart={0}
    loadMore={loadFunc}
    hasMore={true || false}
    loader={<div className="loader">Loading ...</div>}
>
    {items} // <-- This is the content you want to load
</InfiniteScroll>
```

### DOM scroll events

```html
<div style="height:700px;overflow:auto;">
    <InfiniteScroll
        pageStart={0}
        loadMore={loadFunc}
        hasMore={true || false}
        loader={<div className="loader">Loading ...</div>}
        useWindow={false}
    >
        {items}
    </InfiniteScroll>
</div>
```

## Props

| Name             | Type          | Default    | Description|
|:----             |:----          |:----       |:----|
| `element`        | `String`      | `'div'`    | Name of the element that the component should render as.|
| `className`      | `String`      | `'InfiniteScroll'`    | The `className` property to use on the rendered element.|
| `hasMore`        | `Boolean`     | `false`    | Whether there are more items to be loaded. Event listeners are removed if `false`.|
| `initialLoad`    | `Boolean`     | `true`     | Whether the component should load the first set of items.|
| `isReverse`      | `Boolean`     | `false`    | Whether new items should be loaded when user scrolls to the top of the scrollable area.|
| `loadMore`       | `Function`    |            | A callback when more items are requested by the user.|
| `pageStart`      | `Number`      | `0`        | The number of the first page to load, With the default of `0`, the first page is `1`.|
| `threshold`      | `Number`     | `250`      | The distance in pixels before the end of the items that will trigger a call to `loadMore`.|
| `useCapture`     | `Boolean`     | `false`     | Proxy to the `useCapture` option of the added event listeners.|
| `useWindow`      | `Boolean`     | `true`     | Add scroll listeners to the window, or else, the component's `parentNode`.|
