import {LitElement, html, css} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

export class ImageCompare extends LitElement {
  static styles = css`
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

  static properties = {
    alt: {type: String},
    direction: {type: String},
  };

  #drag;

  constructor() {
    super();
    this.direction = "horizontal";
    this.alt = "";
    this.#drag = false;
  }

  render() {
    return html`
      <style>
        #comparer {
          cursor: ${this.direction === "vertical" ? "row-resize" : "col-resize"};
        }
        .${this.direction === "vertical" ? "vertical" : "horizontal"}-line {
          display: none;
        }
        slot[name="image-2"]::slotted(*) {
          clip-path: polygon(${this.direction !== "vertical" ? 
                        `var(--offsetX) 0, 100% 0, 100% 100%, var(--offsetX) 100%` : 
                        `0 var(--offsetY), 100% var(--offsetY), 100% 100%, 0 100%`
                      });
        }
      </style>

      <span id="comparer" @mousedown=${this.mouseDown} @mouseup=${this.mouseUp} @mousemove=${this.mouseMove}
                          @touchstart=${this.touchStart} @touchend=${this.touchEnd} @touchmove=${this.touchMove}
            aria-label=${this.alt}>
        <slot name="image-1"></slot>
        <slot name="image-2"></slot>
        <span class="vertical-line">
          <span class="thumb-wrapper"> <span class="thumb"></span> </span>
        </span>
        <span class="horizontal-line">
        <span class="thumb-wrapper"> <span class="thumb rotate"></span> </span>
        </span>
      </span>
    `;
  }

  mouseDown(event) {
    this.#drag = true;
    this.updateOffsets(event);
  }

  mouseUp(event) {
    this.#drag = false;
  }

  mouseMove(event) {
    this.updateOffsets(event);
  }

  touchStart(event) {
    event.preventDefault();
    this.mouseDown(this.touchToMouseEvent(event));
  }
  
  touchEnd(event) {
    event.preventDefault();
    this.mouseUp();
  }

  touchMove(event) {
    event.preventDefault();
    this.mouseMove(this.touchToMouseEvent(event));
  }

  updateOffsets(event) {
    if (!this.#drag) return;
    const x = event.offsetX, y = event.offsetY;
    const width = event.target.clientWidth, height = event.target.clientHeight;
    const newX = Math.max(0, Math.min(100, x / width * 100));
    const newY = Math.max(0, Math.min(100, y / height * 100));
    this.style.setProperty("--offsetX", `${newX}%`);
    this.style.setProperty("--offsetY", `${newY}%`);
  }

  touchToMouseEvent(event) {
    const r = event.target.getBoundingClientRect();
    return {
      target: event.target,
      offsetX: event.targetTouches[0].pageX - event.target.offsetLeft,
      offsetY: event.targetTouches[0].pageY - event.target.offsetTop,
    }
  }
}

customElements.define('image-compare', ImageCompare);