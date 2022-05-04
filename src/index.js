import {LitElement, html, css} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

export class ImageCompare extends LitElement {
  static styles = css`
    * {margin: 0;}
    :host {
      --offsetX: 50%;
      --offsetY: 50%;
      --divider-size: 2px;
      --divider-color: red;
    }
    span {
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
      top: calc(var(--offsetY) - var(--divider-size) / 2);;
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

      <span @mousedown=${this.mouseDown} @mouseup=${this.mouseUp} @mousemove=${this.mouseMove}>
        <slot name="image-1"></slot>
        <slot name="image-2"></slot>
        <span class="vertical-line"></span>
        <span class="horizontal-line"></span>
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

  updateOffsets(event) {
    if (!this.#drag) return;
    const x = event.offsetX, y = event.offsetY;
    const width = event.target.clientWidth, height = event.target.clientHeight;
    const newX = Math.max(0, Math.min(100, x / width * 100));
    const newY = Math.max(0, Math.min(100, y / height * 100));
    this.style.setProperty("--offsetX", `${newX}%`);
    this.style.setProperty("--offsetY", `${newY}%`);
  }
}

customElements.define('image-compare', ImageCompare);