import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-side-menu'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        .menu-container {
            background-color: var(--fx-primary-dark);
            width: 3rem;
            height: 100%;
            overflow: hidden;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            transition: width 0.3s ease-out;
            transition-delay: 0.3s;
        }
        .menu-container:hover {
            width: 25rem;
        }
        .header {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            color: var(--fx-primary-dark-contrast);
            height: 3rem;
            padding: 0.7rem;
            box-sizing: border-box;
        }
        .items {
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            width: 100%;
        }
        .text {
            margin-left: 0.7rem;
        }
    `

    constructor(){
        super()
        this.title = ''
    } 

    static properties = {
        'title': {attribute: true, type: String},
    }

    render() {
        return html`<div class="menu-container">
            <div class="header">
                <fx-icon icon="menu" size="1.6rem" color="var(--fx-primary-contrast)"></fx-icon>
                <div class="text">${this.title}</div>
            </div>
            <div class="items">
                <slot></slot>
            </div>
        </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent)