# scrolly-rail

A horizontal snap scroller Web Component that targets previous/next control elements enhancements.

- [CodePen demo](https://codepen.io/hexagoncircle/full/yyBMGrL)

## Introduction

🚧 This is an opinionated experimental concept exploring horizontal scroll patterns with control enhancements.

- Base styles from `scrolly-rail.css` establish the horizontal scrolling and layout of this component and its children. If JavaScript were disabled, the rail can still be scrolled and snap items into place as expected.
- The `scrolly-rail.js` script provides enhancements to the custom element if previous/next `button` control elements have been created and targeted using the available attributes (read more below).
- When either control is clicked, the container scrolls based on the amount of fully visible items; If the 'next' control is clicked and three items are visible, the next three items scroll into view.
- A `resizeObserver` keeps track of the component dimensions and visible item count.
- Sentinel elements are inserted (in shadow DOM) at the inline scroll boundaries of the component. Using `IntersectionObserver`, the sentinels will toggle a `data-bound` attribute on their respective controls when a bound limit is reached.

## Usage

- Import or copy the `scrolly-rail.css` default styles into your project.
- Include the `scrolly-rail.js` in your HTML template.

```html
<script type="module" src="scrolly-rail.js"></script>
```

Add a custom element with a collection of items, ideally a `ul` or `ol` element containing `li` elements.

```html
<scrolly-rail data-control-previous="btn-previous" data-control-next="btn-next">
  <ul>
    <li>1</li>
    <li>1</li>
    <!-- ... -->
    <li>11</li>
    <li>12</li>
  </ul>
</scrolly-rail>

<button id="btn-previous">Previous</button>
<button id="btn-previous">Next</button>
```

The following attributes target elements containing `id` values. These become the controls that scroll items into view on click.

- `data-control-previous` – Sets up element to scroll the _previous_ set of items into view.
- `data-control-next` – Sets up element to scroll the _next_ set of items into view.

When the start or end boundary of the scroll container is reached, a `data-bound` attribute is added to the respective control element. This is useful for changing control styles as visual feedback.

```css
button {
  /* default button styles */
}

button[data-bound] {
  /* ... */
}
```
