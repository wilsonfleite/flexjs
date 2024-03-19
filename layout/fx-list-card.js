import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-list-card'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            background-color: var(--fx-background-soft);
            padding: 0.3rem;
            gap: 0.3rem;
        }

        .color-bar {
            width: 0.8rem;
            min-height: 4rem;
        }

        .content {
            display: flex;
            flex-direction: row;
            width: 100%;
            gap: 0.3rem;
            box-sizing: border-box;
        }

        .details {
            background-color: var(--fx-background);
            display: none;
        }
    `

    constructor(){
        super()
    }

    static properties = {
        color: {attribute: true, type: String},
    }

    showDetails(){
        const details = this.shadowRoot.querySelector('.details')
        details.style.display = 'flex'
    }

    hideDetails(){
        const details = this.shadowRoot.querySelector('.details')
        details.style.display = 'none'
    }

    render() {
        const colorBar = this.color ? html`<div class="color-bar" style="background-color: ${this.color};"></div>` : html``
        return html`<div class="content">${colorBar}<slot></slot></div><div class="details"><slot name="details"></slot></div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);