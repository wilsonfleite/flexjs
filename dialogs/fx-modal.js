import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-modal'

class CustomWebComponent extends LitElement {
        
    static styles = css`
    :host {
        box-sizing: border-box;
    }

    .black-mask {
        z-index: 3000;
        position: fixed;
        width: 100%;
        height: 0;
        left: 0;
        top: 0;
        opacity: 0;
        background-color: rgba(0,0,0,.6);
        transition-property: opacity;
        transition-duration: .4s;
        overflow: hidden;
    }

    .box {
        width: fit-content;
        margin: 2rem auto;
        background-color: var(--fx-background);
        border: 1px solid var(--fx-secondary);
        border-radius: 0.8rem;
        padding: 0.6rem;
    }

    .button {
        padding-top: 2rem;
        display: flex;
        justify-content: flex-end;
    }

    .close-button-bar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 0.4rem;
    }

    .close-button::part(icon):hover {
        opacity: .7;
        cursor: pointer;
    }
    `
    constructor(){
        super()
        this.notCancelable = false
    }

    static properties = {
        notCancelable: {attribute: 'not-cancelable', type: Boolean},
        parameters: {attribute: true, type: Object},
    }

    //Properties

    //Private methods
    generateCancelBar(){
        return html`<div class="close-button-bar">
                        <fx-icon class="close-button" icon="close" color="var(--fx-secondary-dark)" @click="${this.close}"></fx-icon>
                    </div>`
    }

    //Methods
    open(){
        const blackMask = this.renderRoot.querySelector('.black-mask')
        blackMask.style.height = '100%'
        blackMask.style.opacity = '1'
    }

    close(){
        const blackMask = this.renderRoot.querySelector('.black-mask')
        blackMask.style.opacity = 0
        setTimeout(() => {blackMask.style.height = 0}, 400)
    }

    //Render
    render(){
        const cancelable = this.cancelable ?? true
        return html`
        <div class="black-mask">
            <div class="box">
                ${this.notCancelable ? html`` : this.generateCancelBar()}
                <slot class="slot"></slot>
            </div>
        </div>`
    }

}

customElements.define(TAG_NAME, CustomWebComponent);