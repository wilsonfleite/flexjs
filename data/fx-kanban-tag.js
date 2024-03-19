import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-kanban-tag'

import { pickTextColorBasedOnBgColor } from '../fx-core.js';

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            display: flex;
            box-sizing: border-box;
            border-radius: 0.2rem;
            font-size: 0.8rem;
            font-weight: 500;
            color: var(--color);
            padding: 0.1rem 0.3rem 0 0.3rem;
            width: fit-content;
            height: 1.1rem;
            background-color: var(--bgcolor);
            flex-wrap: nowrap;
        }
    `

    constructor(){
        super()
        this.group = ''
        this.color = 'black'
    }

    static properties = {
        group: {attribute: true, type: String},
        color: {attribute: true, type: String},
    }

    updated() {
        this.style.setProperty('--bgcolor', this.color);
        this.style.setProperty('--color', pickTextColorBasedOnBgColor(this.color, 'white', 'black'));
    }

    render() {
        return html`<slot></slot>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);