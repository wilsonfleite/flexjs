import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-alert'

class CustomWebComponent extends LitElement {
      
    static styles = css`
    :host {
        box-sizing: border-box;
    }

    .container {
        z-index: 1000;
        position: fixed;
        width: 50%;
        height: 0;
        left: 50%;
        transform: translateX(-50%);
        top: 4rem;
    }

    .box {
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        border-radius: 0.5rem;
        cursor: default;
        margin-bottom: 0.3rem;
        height: 4rem;
        transition-duration: .3s;
        transform-origin: top left;
    }

    .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3rem;
    }

    .message {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        font-weight: 400;
    }

    .button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3rem;
    }
    `

    constructor(){
        super()
    }

    static properties = {}

    async connectedCallback() {
        super.connectedCallback()
    }
    
    destroyBox(id){
        const box = this.renderRoot.querySelector('.container').querySelector(`.box[id='${id}']`)
        box.style.transform = 'scaleY(.1)'
        box.style.opacity = .1
        setTimeout(() => {
            box.remove()
        }, 300)
    }

    showMessage(message, icon='', bgcolor='', color='', time=1000) {
        const id = Math.random().toString(16).slice(2)
        if (time > 0){
            const timer = setTimeout((event) => {this.destroyBox(id)}, time);
        }
        const htmlBox = `
        <div class="box" id="${id}" style="background-color: ${bgcolor}; color: ${color};">
            <div class="icon"><fx-icon icon="${icon}" color="${color}"></fx-icon></div>
            <div class="message" style="color: ${color};">${message}</div>
            <div class="button"><fx-icon icon="close"></fx-icon></div>
        </div>`
        this.renderRoot.querySelector('.container').insertAdjacentHTML('afterbegin', htmlBox)
        this.renderRoot.querySelector('.container').querySelector(`.box[id='${id}'] .button`).addEventListener('click', () => this.destroyBox(id))
    }

    alert = {
        'success': (message) => this.showMessage(message, 'done', 'var(--fx-success)', 'var(--fx-success-contrast)', 2000),
        'danger': (message) => this.showMessage(message, 'error', 'var(--fx-danger)', 'var(--fx-danger-contrast)', 5000),
        'warning': (message) => this.showMessage(message, 'warning', 'var(--fx-warning)', 'var(--fx-warning-contrast)', 2000),
        'info': (message) => this.showMessage(message, 'info', 'var(--fx-info)', 'var(--fx-info-contrast)', 2000)
    }

    render() {
        return html`
        <div class="container">
            <slot></slot>
        </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);