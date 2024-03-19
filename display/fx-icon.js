import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-icon'

//This component uses icon from https://fonts.google.com/icons?icon.set=Material+Icons

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host { 
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: flex-start;
            width: fit-content;
        }

        .material-icons {
            font-family: 'Material Icons';
            font-weight: normal;
            font-style: normal;
            font-size: 1.5rem;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
        }
    `

    constructor(){
        super()
        this.icon = ''
        this.color = null
        this.size = null
    }

    static properties = {
        icon: {attribute: true, type: String},
        color: {attribute: true, type: String},
        size: {attribute: true, type: String},
    }

    render() {
        return html`<i class="material-icons" part="icon" style="
            ${ this.size ? `font-size: ${this.size};` : `` }
            ${ this.color ? `color: ${this.color};` : `` }
        ;" @click=${this.handleClick}>${this.icon}</i>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);