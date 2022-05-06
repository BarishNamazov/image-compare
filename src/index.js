import {LitElement, html} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
import { styles } from "./index.css.js";

export class ImageCompare extends LitElement {
  static styles = styles;
  
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