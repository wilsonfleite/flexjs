import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-context-menu'

import {DocumentClickEmitter} from '../fx-core.js'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
        }

        .box {
            position: relative;
            cursor: pointer;
        }

        .menu {
            border: 0.1rem solid var(--fx-secondary);
            position: absolute;
            left: -0.2rem;
            display: none;
            z-index: 900;
            padding: 0;
            margin: 0;
            flex-direction: column;
            background-color: var(--fx-background);
        }

        .box:hover fx-icon {
            opacity: .5;
        }

        .box:hover .text {
            opacity: .7;
        }

        .header {
            display: flex;
            gap: 0.2rem;
        }

        .text {
            display: flex;
            align-items: center;
            font-size: 1rem;
        }
    `

    constructor(){
        super()
        this.documentClickEmitter = new DocumentClickEmitter()
    }

    static properties = {
        icon: {attribute: true, type: String},
        text: {attribute: true, type: String},
        color: {attribute: true, type: String},
    }

    documentClickHandler(event){
        if (!event.composedPath().includes(this)){
            this.close()
        }
    }

    connectedCallback(){
        super.connectedCallback()
        this.addEventListener('contextMenuItemClicked', this.contextMenuItemClicked)
    }

    contextMenuItemClicked(event){
        this.close()
    }

    open(){
        const menu = this.renderRoot.querySelector('.menu')
        menu.style.display = 'flex'
        this.documentClickEmitter.subscribe(this, 'documentClickHandler')
    }

    close(){
        const menu = this.renderRoot.querySelector('.menu')
        menu.style.display = 'none'
        this.documentClickEmitter.unsubscribe(this, 'documentClickHandler')
    }

    render() {

        const icon = this.icon ?? 'menu_open'
        const text = this.text ?? ''
        const color = this.color ?? 'var(--fx-background-contrast)'

        return html`
        <div class="box">
            <div class="header" @click="${this.open}">
                <fx-icon icon="${icon}" class="remove-item" color="${color}"></fx-icon><div class="text" style="color: ${color};">${text}</div>
            </div>
            <div class="menu"><slot></slot></div>
        </div>
        `
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);