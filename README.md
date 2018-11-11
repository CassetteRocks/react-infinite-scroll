# React Infinite Scroller

[![Travis](https://img.shields.io/travis/CassetteRocks/react-infinite-scroller.svg?style=flat-square)](https://travis-ci.org/CassetteRocks/react-infinite-scroller)
[![npm](https://img.shields.io/npm/dt/react-infinite-scroller.svg?style=flat-square)](https://www.npmjs.com/package/react-infinite-scroller)
[![React Version](https://img.shields.io/badge/React-%5E0.14.9%20%7C%7C%20%5E15.3.0%20%7C%7C%20%5E16.0.0-blue.svg?style=flat-square)](https://www.npmjs.com/package/react)
[![npm](https://img.shields.io/npm/v/react-infinite-scroller.svg?style=flat-square)](https://www.npmjs.com/package/react-infinite-scroller)
[![npm](https://img.shields.io/npm/l/react-infinite-scroller.svg?style=flat-square)](https://github.com/CassetteRocks/react-infinite-scroller/blob/master/LICENSE)

Infinitely load a grid or list of items in React. This component allows you to
create a simple, lightweight infinite scrolling page or element by supporting
both `window` and scrollable elements.

* ⏬ Ability to use window or a scrollable element
* 📏 No need to specify item heights
* 💬 Support for "chat history" (reverse) mode
* ✅ Fully unit tested and used in hundreds of production sites around the
  world!
* 📦 Lightweight alternative to other available React scroll libs ~ 1.9KB
  minified & gzipped

---

* [Demo](https://cassetterocks.github.io/react-infinite-scroller/demo/)
* [Demo
  Source](https://github.com/CassetteRocks/react-infinite-scroller/blob/master/docs/src/index.js)

## Installation

```
npm install react-infinite-scroller --save
```

```
yarn add react-infinite-scroller
```

## How to use

```js
import InfiniteScroll from "react-infinite-scroller";
```

### Window scroll events

```html
<InfiniteScroll
    pageStart={0}
    loadMore={loadFunc}
    hasMore={true || false}
    loader={() => <div className="loader">Loading ...</div>}
>
    {items} // <-- This is the content you want to load
</InfiniteScroll>
```

### DOM scroll events

```html
<div style="height:700px;overflow:auto;" ref={c => this.scrollParentRef = c}>
    <div>
        <InfiniteScroll
            pageStart={0}
            loadMore={loadFunc}
            hasMore={true || false}
            loader={() => <div className="loader">Loading ...</div>}
            useWindow={false}
            getScrollParent={() => this.scrollParentRef}
        >
            {items}
        </InfiniteScroll>
    </div>
</div>
```

## Props

| Name              | Type                  | Default      | Description                                                                                |
| ----------------- | --------------------- | ------------ | ------------------------------------------------------------------------------------------ |
| `container`       | `node`                | `'div'`      | Container component or HTML tag that the component should render as.                       |
| `direction`       | `string`              | `'down'`     | Which direction the user needs to scroll to load more items. `up` or `down`.               |
| `getScrollParent` | `func`                |              | Return a custom element to calculate the scroll position from. Expects a DOM node.         |
| `hasMore`         | `bool`                | `false`      | Whether there are more items to be loaded. Scroll event listeners are removed if `false`.  |
| `initialLoad`     | `bool`                | `true`       | Whether the component should load the first set of items on mount.                         |
| `loadMore`        | `func`                |              | A callback when more items are requested by the user.                                      |
| `loader`          | `func` or `Component` |              | A component to show whilst loading items.                                                  |
| `loaderKey`       | `any`                 | `'ISLoader'` | In case the default key of the loader conflicts with your app.                             |
| `pageStart`       | `number`              | `0`          | The number of the first page to load, With the default of `0`, the first page is `1`.      |
| `threshold`       | `number`              | `250`        | The distance in pixels before the end of the items that will trigger a call to `loadMore`. |
| `useCapture`      | `bool`                | `false`      | The `useCapture` option of the scroll event listeners.                                     |
| `useWindow`       | `bool`                | `true`       | Add scroll listeners to the window instead of the container.                               |

## Troubleshooting

### Double or non-stop calls to `loadMore`

If you experience double or non-stop calls to your `loadMore` callback, make
sure you have your CSS layout working properly before adding this component in.
Calculations are made based on the height of the container (the element the
component creates to wrap the items), so the height of the container must equal
the entire height of the items.

### But you should just add an `isLoading` prop!

This component doesn't make any assumptions about what you do in terms of API
calls. It's up to you to store whether you are currently loading items from an
API in your state/reducers so that you don't make overlapping API calls.

```js
loadMore() {
    if(!this.state.isLoading) {
        this.props.fetchItems();
    }
}
```

## Alternatives

If you plan to use this component to render thousands of items, I recommend
taking a looking at [react-infinite](https://github.com/seatgeek/react-infinite)
(item element heights required) or
[react-virtualized](https://github.com/bvaughn/react-virtualized) (larger
package size).
