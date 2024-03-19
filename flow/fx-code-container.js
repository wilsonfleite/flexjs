import { LitElement, html, css } from "../refs/lit.js";
const TAG_NAME = "fx-code-container";

class CustomWebComponent extends LitElement {

    static styles = css`
    :host {
        display: block;
        border: 0.2rem solid orange;
        width: 30rem;
        height: 20rem;
    }

    :host ::slotted(*) {
        
    }

    .slot {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }
    `

    constructor() {
        super();
    }

    moveBlock(e){
        const movedBlock = this.querySelector(`fx-code-block[id='${e.detail.blockId}']`)
        e.target.insertAdjacentElement('beforeend', movedBlock);
    }

    firstUpdated(){
        this.addEventListener('blockMoved', this.moveBlock)
    }

    render() {
        return html`<div class="slot"><slot></slot></div>`;
    }
}

customElements.define(TAG_NAME, CustomWebComponent);
