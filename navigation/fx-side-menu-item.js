import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-side-menu-item'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            width: 100%;
            box-sizing: border-box;
        }
        .header {
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            color: var(--fx-primary-dark-contrast);
            width: 100%;
            cursor: pointer;
        }
        .item-menu-container {
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            padding: 0.7rem;
            width: 100%;
        }
        .item-menu-container:hover {
            background-color: rgba(128,128,128,.4)
        }
        .text {
            margin-left: 0.7rem;
            width: 100%;
            white-space: nowrap;
        }
        .arrow {
            float: right;
        }
        .subitems {
            display: none;
            flex-direction: column;
            padding-top: 0.4rem;
            box-sizing: border-box;
            overflow: hidden;
            height: auto;
        }
    `

    constructor(){
        super()
        this.icon = null
        this.text = ''
        this.expanded = false
    } 

    static properties = {
        'icon': {attribute: true, type: String},
        'text': {attribute: true, type: String},
        'expanded': {attribute: true, type: Boolean}
    }

    toggleSubitems(){
        this.expanded = !this.expanded
        const subitemsDiv = this.renderRoot.querySelector('.subitems')
        subitemsDiv.style.display = this.expanded ? "flex" : "none"
    }

    //Render
    render() {

        return html`<div class="item-menu-container">
            <div class="header" @click=${this.toggleSubitems}>
                <fx-icon icon="${this.icon}" size="1.6rem" color="var(--fx-primary-dark-contrast)"></fx-icon>
                <div class="text">${this.text}</div>
                <div div="arrow"><fx-icon icon="${this.expanded ? 'expand_less' : 'expand_more'}" size="1.6rem" color="var(--fx-primary-contrast)"></fx-icon></div>
            </div>
            <div class="subitems">
                <slot></slot>
            </div>
        </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent)