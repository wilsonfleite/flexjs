import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-kanban-container'

import { pickTextColorBasedOnBgColor } from '../fx-core.js';

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
            width: 100%;
        }

        .container {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .header {
            height: 2.8rem;
            border-radius: 0.4rem 0.4rem 0 0;
            display: flex;
            align-items: center;
            width: 100%;
            padding: 0.6rem;
            box-sizing: border-box;
        }

        .title {
            font-weight: 500;
            display: flex;
            align-items: center;
            height: 100%;
            width: 100%;
            box-sizing: border-box;
            cursor: default;
        }

        .buttons {
            display: flex;
            align-items: center;
            height: 100%;
            box-sizing: border-box;
        }

        .content { 
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
            box-sizing: border-box;
            padding: 10px;
            height: 100%;
            border-radius: 0 0 0.4rem 0.4rem;
            background-color: var(--fx-background);
        }

        .filter-button {
            cursor: pointer;
        }

    `

    constructor(){
        super()
        this.title = ''
        this.color = 'var(--background-contrast)'
    }

    static properties = {
        title: { attribute: true, type: String },
        color: { attribute: true, type: String }
    }

    render() {
        const color = pickTextColorBasedOnBgColor(this.color, 'white', 'black', 200)

        return html`
        <div class="container">
            <div class="header" style="background-color: ${this.color};">
                <div class="title" style="color: ${color};">${this.title}</div>
                <div class="buttons">
                    <!--<fx-icon class="filter-button" icon="filter_alt" color="${color}" size="1.2rem"></fx-icon>-->
                </div>
            </div>
            <div class="content">
                <slot></slot>
            </div>
        </div>

        `
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);