import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-accordion'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
            display: table-row;
        }

        .header-background {
            background-color: var(--fx-secondary);
        }
 
        .header {
            background-color: rgba(0, 0, 0, 0);
            height: 1.8rem;
            display: flex;
            flex-direction: row;
            cursor: pointer;
        }

        .header:hover {
            background-color: rgba(0, 0, 0, .1);
        }

        .title-text {
            flex: 1 1 auto;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 100%;
            font-size: 1rem;
            font-weight: 500;
            padding: 0 0 0 1rem;
            color: var(--fx-secondary-contrast);
        }

        .title-button {
            flex: 1 1 auto;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            height: 100%;
            padding: 0 1rem 0 0;
        }

        .show{
            display: block;
        }

        .hide {
            display: none;
        }

        fx-icon {
            transition-duration: 300ms;
            transform: rotate(0deg);
        }

        .button-rotated {
            transform: rotate(-180deg);
        }

        .content {
            border: 0.1rem solid var(--fx-secondary);
            max-height: 0;
            transition: max-height 0.3s ease-out;
            overflow: hidden;
        }

        .content-visible {
            max-height: 100rem;
            transition: max-height 0.3s ease-in;
            overflow: visible;
        }
    `

    constructor(){
        super()
        this.visible = false
    }

    static properties = {
        title: {attribute: true, type: String},
        visible: {attribute: true, converter: 
            {
                fromAttribute: (value, type) => {
                    if (value === undefined || value === 'undefined') value = false
                    return JSON.parse(value)
                },
                toAttribute: (value, type) => {
                    return value
                },
            }
        },
    }

    toggleExpander(event, expand=undefined){
        this.toggle(expand)
    }

    toggle(expand=undefined){
        if (expand==undefined) {
            this.visible = !this.visible
        } else {
            this.visible = expand
        }
    }

    render() {
        const contentExpansionClass = this.visible ? 'content-visible' : ''
        const contentButtonClass = this.visible ? 'button-rotated' : ''

        return html`
        <div class="header-background" part="header">
            <div class="header" @click="${this.toggleExpander}">
                <span class="title-text" part="title">${this.title}</span>
                <span class="title-button">
                    <fx-icon icon="expand_more" size="1.6rem" color="var(--fx-secondary-contrast)" class="${contentButtonClass}"></fx-icon>
                </span>
            </div>
        </div>
        <div part="content" class="content ${contentExpansionClass}">
            <slot></slot>
        </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);