import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-text-field-option'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
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
        let clickEvent = new Event('textfieldOptionClicked', { bubbles: true })
        this.dispatchEvent(clickEvent)
    }

    render() {
        return html`<div class="option" @click=${this.dispatchClickedEvent}><slot></slot></div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);