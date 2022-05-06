import { css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

export const styles = css`
* {margin: 0;}
:host {
  display: block;
  --offsetX: var(--initial, 50%);
  --offsetY: var(--initial, 50%);
  --divider-size: 2px;
  --divider-color: white;
  --thumb: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2' height='1' viewBox='0 0 398 216' fill='none'%3E%3Cpath d='M297.51 0.019989L270.518 27.012L332.553 89.055H65.453L127.492 27.016L100.5 0.0239868L6.25399 94.739C-1.32411 102.317 -1.32411 114.157 6.25399 121.731L100.496 215.973L127.488 188.981L65.453 126.942H333.023L270.507 188.981L297.499 215.973L391.741 121.731C399.319 114.153 399.319 102.313 391.741 94.739L297.51 0.019989Z' fill='black'/%3E%3C/svg%3E");
  --thumb-size: 2em;
  --thumb-background-color: white;
  --thumb-opacity: 0.9;
  --thumb-border: 2px solid black;
}
#comparer {
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  width: max-content;
  height: max-content;
}
slot[name="image-1"]::slotted(*) {
  filter: var(--image-1-filter, none);
}
slot[name="image-2"]::slotted(*) {
  filter: var(--image-2-filter, none);
  position: absolute;
  width: 100%;
  height: 100%;
}
::slotted(*) {
  pointer-events: none;
}
.vertical-line, .horizontal-line {
  pointer-events: none;
  background-color: var(--divider-color);
  position: absolute;
}
.vertical-line {
  width: var(--divider-size);
  height: 100%;
  left: calc(var(--offsetX) - var(--divider-size) / 2);
}
.horizontal-line {
  width: 100%;
  height: var(--divider-size);
  top: calc(var(--offsetY) - var(--divider-size) / 2);
}
.thumb-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
.thumb {
  z-index: 1000; 
  position: absolute;
  display: inline-block;
  filter: var(--thumb-filter);
  background: var(--thumb);
  background-size: 80%;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: var(--thumb-background-color);
  height: var(--thumb-size); 
  width: var(--thumb-size);
  border-radius: 50%;
  border: var(--thumb-border);
  opacity: var(--thumb-opacity);
}
.rotate {
  transform: rotate(90deg);
}
`;
