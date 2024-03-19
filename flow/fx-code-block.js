import { LitElement, html, css } from "../refs/lit.js";
const TAG_NAME = "fx-code-block";

class CustomWebComponent extends LitElement {

    static styles = css`
    :host {
        display: flex;
        flex-direction: row;
        width: fit-content;
        border: 0.1rem solid white;
        position: absolute;
    }

    .body {
        height: 2.5rem;
        width: 2.5rem;
    }

    .slot {
        height: 2.5rem;
        min-width: 2.5rem;
        background-color: lightslategrey;
    }
    `

    x1 = 0
    y1 = 0
    x2 = 0
    y2 = 0

    constructor() {
        super();
    }

    static properties = {
        color: {attribute: true, type: String},
    }

    firstUpdated(){
        this.draggable = true
        this.addEventListener('dragstart', this.dragStart)
        this.addEventListener('dragend', this.dragEnd)
        this.addEventListener('drag', this.drag)

        const slot = this.renderRoot.querySelector('.slot')
        slot.addEventListener('dragover', this.dragOver);
        slot.addEventListener('drop', this.drop);
    }

    dragStart(e){
        this.x2 = e.clientX;
        this.y2 = e.clientY;
        this.style.opacity = 0.2
        e.dataTransfer.setData('text/plain', this.id)
    }

    dragEnd(e){
        this.style.opacity = 1
    }

    drag(e){
        this.x1 = this.x2 - e.clientX;
        this.y1 = this.y2 - e.clientY;
        this.x2 = e.clientX;
        this.y2 = e.clientY;

        this.style.left = this.offsetLeft - this.x1 + 'px';
        this.style.top = this.offsetTop - this.y1 + 'px';   
    }

    dragOver(e){
        e.preventDefault()
    }

    drop(e){
        var blockId = e.dataTransfer.getData('text/plain')
        const customEvent = new CustomEvent('blockMoved', {
            bubbles: true,
            composed: true,
            detail: {
                blockId: blockId
            }
        })
        this.dispatchEvent(customEvent)
    }

    render() {
        return html`
            <div class="body" style="background-color: ${this.color};"></div>
            <div class="slot"><slot></slot></div>
        `;
    }
}

customElements.define(TAG_NAME, CustomWebComponent);
