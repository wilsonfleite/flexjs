import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-select-option'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
            text-wrap: nowrap;
        }
        .option {
            padding: 0.3rem;
            box-sizing: border-box;
            cursor: pointer;
        }
        .option:hover {
            background-color: color-mix(in srgb, var(--fx-secondary), transparent 70%);
            width: 100%;
        }
    `

    static properties = {
        value: {attribute: true, type: String}
    }

    dispatchClickedEvent(){
        let clickEvent = new Event('selectOptionClicked', { bubbles: true })
        this.dispatchEvent(clickEvent)
    }

    render() {
        return html`<div class="option" @click=${this.dispatchClickedEvent}><slot></slot></div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);