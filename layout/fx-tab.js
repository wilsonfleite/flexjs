import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = "fx-tab";

class CustomWebComponent extends LitElement {
    static styles = css`
        :host {
            height: 100%;
            width: 100%;
            display: var(--display);
        }
    `;

    constructor(){
        super()
        this.style.setProperty('--display', 'none')
    }

    static properties = {
        name: {attribute: true, type: String},
        visible: {attribute: true, type: Boolean},
        closeable: {attribute: true, type: Boolean},
    }

    shouldUpdate(changedProperties) {
        super.update(changedProperties);
        if (changedProperties.has('visible')){
            if (this.visible){
                this.style.setProperty('--display', 'block')
            } else {
                this.style.setProperty('--display', 'none')
            }
        }
    }

    render() {
        return html`<slot></slot>`;
    }
}

customElements.define(TAG_NAME, CustomWebComponent);
