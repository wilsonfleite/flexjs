import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-dialog-box'

import {DocumentClickEmitter, toTypeValue} from '../fx-core.js'

class CustomWebComponent extends LitElement {
      
    static styles = css`
    :host {
        box-sizing: border-box;
        z-index: 9000;
        display: none;
        position: absolute;
    }
    `

    constructor(){
        super()
        this.documentClickEmitter = new DocumentClickEmitter()
    }

    documentClickHandler(event){
        if (!event.composedPath().includes(this)){
            this.style.display = 'none'
        }
    }

    static properties = {}

    open(e){
        e.stopPropagation()
        const el = e.target
        const elRect = el.getBoundingClientRect()

        const x = e.clientX
        const y = e.clientY

        if (x < (document.documentElement.clientWidth / 2)){
            this.style.left = elRect.left + 'px'
            this.style.right = 'auto'
        } else {
            this.style.right = (document.documentElement.clientWidth - elRect.right) + 'px'
            this.style.left = 'auto'
        }
        if (y < (document.documentElement.clientHeight / 2)){
            this.style.top = elRect.bottom + 'px'
            this.style.bottom = 'auto'
        } else {
            this.style.bottom = (document.documentElement.clientHeight - elRect.top) + 'px'
            this.style.top = 'auto'
        }

        this.style.display = 'block'
        this.documentClickEmitter.subscribe(this, 'documentClickHandler')
    }

    close(){
        this.documentClickEmitter.unsubscribe(this, 'documentClickHandler')
    }
    
    render() {
        return html`<slot></slot>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);