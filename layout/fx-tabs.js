import { LitElement, html, css, render } from '../refs/lit.js';
const TAG_NAME = "fx-tabs";

class CustomWebComponent extends LitElement {
    static styles = css`
        :host {
            box-sizing: border-box;
        }

        .box {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .header {
            display: flex;
            flex-direction: row;
            flex: 0 1 auto;
            gap: 0.1rem
        }

        .content {
            flex: 1 1 auto;
            height: 100%;
            border: 1px solid var(--fx-secondary);
        }

        .tab-button {
            border-bottom: none;
            padding: 0.4rem 0.6rem;
            border-radius: 0.5rem 0.5rem 0 0;
            cursor: pointer;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 0.2rem;
        }

        .tab-button:hover {
            box-shadow: inset 0 0 0 100rem rgba(128,128,128,.3);
        }

        .inactive {
            background-color: var(--fx-secondary);
            color: var(--fx-secondary-contrast);
        }

        .active {
            border: 1px solid var(--fx-secondary);
            color: var(--fx-secondary);
        }

        .close {
            background-color: color-mix(in srgb, var(--fx-background-hard), transparent 50%);
            border-radius: 50%;
            padding: 0.03rem;
        }

        .close:hover {
            box-shadow: inset 0 0 0 100rem rgba(128,128,128,.5);
        }
    `;

    constructor(){
        super()
        this.tabs = []
        this.activeTab = null
        this.previousTab = ''
    }

    static properties = {
        gap: {attribute: true, type: String},
        tabs: {attribute: true, type: Object},
        activeTab: {attribute: true, type: String},
        previousTab: {attribute: true, type: String},
    }

    firstUpdated(){
        this.updateTabs()
    }

    updated(changedProperties) {
        if (changedProperties.has('children')) {
            this.updateTabs()
        }
    }

    updateTabs(){
        const tabs = Array.from(this.querySelectorAll('fx-tab'))
        this.tabs = tabs.map(tab => {return{'name': tab.name, 'closeable': tab.closeable}})
        const activeTab = tabs.find(tab => tab.visible)
        if (activeTab) this.activeTab = activeTab.name
    }

    tabClick(event){
        const tabName = event.target.getAttribute('name')
        this.activateTab(tabName)
    }

    activateTab(tabName){
        if (tabName != this.activeTab) this.previousTab = this.activeTab
        const tabs = this.querySelectorAll('fx-tab')
        tabs.forEach(tab => {
            tab.visible = (tab.name == tabName)
        })
        this.activeTab = tabName
    }

    teste(){
        this.addItem('teste 1', html`<fx-tab name="teste 1" closeable>Conteudo da aba de Teste 1</fx-tab>`)
    }

    teste2(){
        this.addItem('teste 2', `<fx-tab name="teste 2" closeable>Conteudo da aba de Teste 2</fx-tab>`)
    }

    addItem(name, content){
        if (typeof content === 'string'){
            this.insertAdjacentHTML('beforeend', content)
        } else {
            render(content, this);
        }
        this.updateTabs()
        this.activateTab(name)
    }

    closeTab(event){
        event.stopPropagation()
        const tab = event.target.getAttribute('name')
        this.destroyTab(tab)
    }

    destroyTab(tab){
        const tabElement = this.querySelector(`fx-tab[name='${tab}']`)
        const destroyedTabEvent = new CustomEvent('destroyedTab', {
            detail: {'name': tabElement.name, 'content': tabElement}, 
            bubbles: true
        })
        this.dispatchEvent(destroyedTabEvent)
        tabElement.remove()
        this.updateTabs()
        if (this.activeTab == tab) this.activateTab(this.previousTab)
    }

    render() {
        return html`<div class="box">
            <div class="header">
                ${this.tabs.map(tab => html`<div class="tab-button ${this.activeTab == tab.name ? 'active' : 'inactive'}" 
                @click=${this.tabClick} name="${tab.name}"
                >${tab.name}${tab.closeable ? html`<fx-icon icon="close" class="close" size="0.9rem" name="${tab.name}" @click="${this.closeTab}"></fx-icon>` : html``}</div>`)}
            </div>
            <div class="content"><slot></slot></div>
        </div>`;
    }
}

customElements.define(TAG_NAME, CustomWebComponent);
