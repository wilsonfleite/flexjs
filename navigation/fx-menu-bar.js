import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-menu-bar'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        .menu-bar {
            height: 3.2rem;
            background-color: var(--fx-primary);
            display: flex;
            flex-direction: row;
        }
        .start-buttons {
            flex: 1 1 auto;
            display: flex;
            justify-content: flex-start;
            height: 100%;
        }
        .end-buttons {
            flex: 1 1 auto;
            display: flex;
            justify-content: flex-end;
            height: 100%;
        }
       
    `

    constructor(){
        super()
    }

    static properties = {}

    render() {
        return html`
        <nav class="menu-bar">
            <div class="start-buttons">
                <slot name="start"></slot>
            </div>
            <div class="end-buttons">
                <slot name="end"></slot>
            </div>
        </nav>
        `
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent)