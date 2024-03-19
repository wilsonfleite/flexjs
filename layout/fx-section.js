import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = "fx-section";

class CustomWebComponent extends LitElement {
    static styles = css`
        :host {
            display: flex;
            width: var(--width);
            height: var(--height);
            overflow: var(--host-overflow);
        }
        .slot {
            display: block;
            box-sizing: border-box;
            flex: var(--flex);
            overflow: var(--overflow);
            width: 100%;
            height: 100%;
        }
    `;

    constructor(){
        super()
        this.style.setProperty('--flex', '1 1 auto')
        this.style.setProperty('--overflow', 'auto')
        this.style.setProperty('--host-overflow', 'auto')
        this.style.setProperty('--width', 'auto')
        this.style.setProperty('--height', 'auto')
    }

    static properties = {
        orientation: {attribute: true, type: String},
    }

    shouldUpdate(changedProperties) {
        super.update(changedProperties);
        if (changedProperties.has('orientation')){
            switch(this.orientation){
                case 'vertical':
                    this.style.setProperty('--flex', '0 1 auto')
                    this.style.setProperty('--overflow', 'visible')
                    this.style.setProperty('--host-overflow', 'visible')
                    this.style.setProperty('--width', '100%')
                    this.style.setProperty('--height', 'auto')
                    break
                case 'vertical-flex':
                    this.style.setProperty('--flex', '1 1 auto')
                    this.style.setProperty('--overflow', 'hidden')
                    this.style.setProperty('--host-overflow', 'hidden')
                    this.style.setProperty('--width', '100%')
                    this.style.setProperty('--height', '100%')
                    break
                case 'horizontal':
                    this.style.setProperty('--flex', '0 1 auto')
                    this.style.setProperty('--overflow', 'visible')
                    this.style.setProperty('--host-overflow', 'visible')
                    this.style.setProperty('--width', 'auto')
                    this.style.setProperty('--height', '100%')
                    break
                case 'horizontal-flex':
                    this.style.setProperty('--flex', '1 1 auto')
                    this.style.setProperty('--overflow', 'hidden')
                    this.style.setProperty('--host-overflow', 'hidden')
                    this.style.setProperty('--width', '100%')
                    this.style.setProperty('--height', '100%')
                    break
                case 'content':
                    this.style.setProperty('--flex', '1 1 auto')
                    this.style.setProperty('--overflow', 'scroll')
                    this.style.setProperty('--host-overflow', 'hidden')
                    this.style.setProperty('--width', '100%')
                    this.style.setProperty('--height', '100%')
                    break
            }
        }
    }

    render() {
        return html`<div class="slot"><slot></slot></div>`;
    }
}

customElements.define(TAG_NAME, CustomWebComponent);
