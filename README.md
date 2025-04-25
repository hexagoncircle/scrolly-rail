# scrolly-rail

A custom element horizontal snap scroller in two parts:

1. Foundational CSS for layout, scroll, and snap styles.
2. Custom element script adds the ability to scroll previous or next set of items into view by connecting to `button` control elements.

## Resources

- Read the [blog post](https://ryanmulligan.dev/blog/scrolly-rail/)
- Check out the [demo on CodePen](https://codepen.io/hexagoncircle/full/yyBMGrL)
- Run the demo locally with `npm start`.

🚧 This is an opinionated experimental concept exploring horizontal scroll patterns with control enhancements.

## Introduction

- Base styles from `scrolly-rail.css` establish the horizontal scrolling and layout of this component and its children. If JavaScript were disabled, the rail can still be scrolled and snap items into place as expected.
  - Be sure that you set `scroll-snap-align: start` on the appropriate snap target.
- The `scrolly-rail.js` script provides enhancements to the custom element if previous/next `button` control elements have been created and targeted using the available attributes (read more below).
- When either control is clicked, the container scrolls based on the amount of fully visible items; For example, if the _next_ control is clicked and three items are visible, the next three items scroll into view.
- A `resizeObserver` keeps track of the component dimensions and visible item count.
- If controls are added, an `IntersectionObserver` listens to the scroll bounds of the first and/or last item. This toggles a `data-bound` attribute on previous/next control elements when their respective bound limit is reached. Useful for applying state styles to a control element.

## Usage

Add the `scrolly-rail.css` stylesheet or copy those default styles into your project.

Add the custom element with a collection of items:

```html
<scrolly-rail>
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <!-- ...and so on -->
</scrolly-rail>
```

Here's another example using an unordered list of items:

```html
<scrolly-rail>
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <!-- ...and so on -->
  </ul>
</scrolly-rail>
```

Add `scroll-snap-align: start;` to each item. For example:

```css
scrolly-rail li {
  scroll-snap-align: start;
}
```

The main reason to use this web component is for the extra powers it gives button controls. Include the `scrolly-rail.js` in the HTML template.

```html
<script type="module" src="scrolly-rail.js"></script>
```

The following attributes target the `button` control elements with those `id` values. These controls auto-scroll elements into view on click.

- `data-control-previous` – Sets up element to scroll the _previous_ set of items into view.
- `data-control-next` – Sets up element to scroll the _next_ set of items into view.

```html
<scrolly-rail data-control-previous="btn-previous" data-control-next="btn-next">
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <!-- ...and so on -->
  </ul>
</scrolly-rail>

<button id="btn-previous">Previous</button>
<button id="btn-next">Next</button>
```

When the first or last element of the collection scrolls into view, a `data-bound` attribute is added to the respective control element. This is useful for changing control styles as visual feedback.

```css
button {
  /* default button styles */
}

button[data-bound] {
  /* styles to apply when respective scroll boundary is active */
}
```
