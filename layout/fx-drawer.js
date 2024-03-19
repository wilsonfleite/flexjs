import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-drawer'

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
        background-color: rgba(128,128,128,.7);
        transition-property: opacity;
        transition-duration: .4s;
        overflow: hidden;
        display: flex;
        justify-content: var(--box-side, flex-end);
        box-sizing: border-box;
    }

    .box {
        width: 0;
        height: 100%;
        margin: 0;
        padding: 0.8rem 0.6rem 0.6rem 0.6rem;
        transition-property: width;
        transition-duration: .4s;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        background-color: var(--fx-background);
    }

    .button {
        padding-top: 2rem;
        display: flex;
        justify-content: flex-end;
    }

    .close-button-bar {
        display: flex;
        justify-content: flex-end;
    }

    .close-button::part(icon):hover {
        opacity: .7;
        cursor: pointer;
    }

    #offcanvas-box-box {
        box-sizing: border-box;
        border: 0.1rem solid var(--fx-secondary);
        height: 100%;
        width: 100%;
        overflow: scroll;
        margin: 0.8rem 0;
        background-color: var(--fx-background);
    }
    `
    constructor(){
        super()
        this.side = 'flex-end'
    }

    static properties = {
        side: {attribute: true, converter: 
            {
                fromAttribute: (value, type) => {
                    return value == 'left' ? 'flex-start' : 'flex-end'
                },
            }
        },
        parameters: {attribute: true, type: Object},
    }

    connectedCallback() {
        super.connectedCallback()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    updated() {
        this.style.setProperty('--box-side', this.side);
    }

    generateCancelBar(){
        return html`<div class="close-button-bar">
                        <fx-icon class="close-button" color="var(--fx-secondary-dark)" icon="close" @click="${this.close}"></fx-icon>
                    </div>`
    }

    open(width){
        const blackMask = this.renderRoot.querySelector('.black-mask')
        const box = this.renderRoot.querySelector('.box')
        blackMask.style.height = '100%'
        blackMask.style.opacity = '1'
        box.style.width = width ? width : '25%'
    }

    close(){
        const blackMask = this.renderRoot.querySelector('.black-mask')
        const box = this.renderRoot.querySelector('.box')
        blackMask.style.opacity = 0
        box.style.width = '0%'
        setTimeout(() => {blackMask.style.height = 0}, 400)
    }

    handleBlackMaskClick(event){
        const composedPath = event.composedPath()
        if (composedPath[0].classList.contains('black-mask')){
            this.close()
        }
    }

    render(){
        return html`
        <div class="black-mask" @click="${this.handleBlackMaskClick}">
            <div class="box">
                ${ this.generateCancelBar() }
                <div id="offcanvas-box-box">
                    <slot class="slot"></slot>
                </div>
            </div>
        </div>`
    }

}

customElements.define(TAG_NAME, CustomWebComponent);