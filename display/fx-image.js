import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-image'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: var(--box-width);
            height: var(--box-height);
            overflow: hidden;
        }

        .title {
            font-size: 1rem;
            font-weight: 500;
            display: flex;
            justify-content: center;
        }

        .image {
            display: flex;
            width: 100%;
            height: 100%;
            justify-content: center;
            overflow: hidden;
        }

        img {
            width: var(--img-width);
            height: var(--img-height);
            object-fit: var(--img-fit);
        }

        .caption {
            font-size: 0.9rem;
            display: flex;
            justify-content: center;
        }
    `

    constructor(){
        super()
        this.style.setProperty('--box-width', 'fit-content')
        this.style.setProperty('--box-height', 'fit-content')
        this.style.setProperty('--img-width', 'fit-content')
        this.style.setProperty('--img-height', 'fit-content')
        this.style.setProperty('--img-fit', 'cover')
    }

    static properties = {
        src: {attribute: true, type: String},
        alt: {attribute: true, type: String},
        title: {attribute: true, type: String},
        size: {attribute: true, type: String},
    }

    update(changedProperties) {
        super.update()
        if (changedProperties.has('size')) {
            switch(this.size){
                case 'stretch':
                    this.style.setProperty('--box-width', '100%')
                    this.style.setProperty('--box-height', '100%')
                    this.style.setProperty('--img-width', '100%')
                    this.style.setProperty('--img-height', '100%')
                    this.style.setProperty('--img-fit', 'fill')
                    break
                case 'crop':
                    this.style.setProperty('--box-width', 'auto')
                    this.style.setProperty('--box-height', 'auto')
                    this.style.setProperty('--img-width', 'fit-content')
                    this.style.setProperty('--img-height', 'fit-content')
                    this.style.setProperty('--img-fit', 'cover')
                    break
                case 'original':
                    this.style.setProperty('--box-width', 'fit-content')
                    this.style.setProperty('--box-height', 'fit-content')
                    this.style.setProperty('--img-width', 'fit-content')
                    this.style.setProperty('--img-height', 'fit-content')
                    this.style.setProperty('--img-fit', 'cover')
                    break
                case 'fit':
                    this.style.setProperty('--box-width', '100%')
                    this.style.setProperty('--box-height', '100%')
                    this.style.setProperty('--img-width', '100%')
                    this.style.setProperty('--img-height', '100%')
                    this.style.setProperty('--img-fit', 'contain')
                    break
                default:
                    this.style.setProperty('--box-width', 'fit-content')
                    this.style.setProperty('--box-height', 'fit-content')
                    this.style.setProperty('--img-width', 'fit-content')
                    this.style.setProperty('--img-height', 'fit-content')
                    this.style.setProperty('--img-fit', 'cover')
                    break
            }
        }
    }

    render() {
        const title = this.title ? html`<div class="title">${this.title}</div>` : html``
        return html`${title}<div class="image"><img src="${this.src}" alt="${this.alt}"></div>
        <div class="caption">
            <slot></slot>
        </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);