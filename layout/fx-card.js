import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-card'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            border: 1px solid var(--fx-primary);
            border-radius: 0.3rem;
            overflow: hidden;
            width: 12rem;
            height: 16rem;
        }

        .header {
            flex: 0 1 auto;
            height: fit-content;
        }

        .content {
            flex: 1 1 auto;
        }

        .footer {
            flex: 0 1 auto;
            height: fit-content;
        }
    `

    constructor(){
        super()
    }

    static properties = {}

    render() {
        return html`<div class="header" part="header"><slot name="header"></slot></div>
        <div class="content" part="content"><slot></slot></div>
        <div class="footer" part="footer"><slot name="footer"></slot></div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);