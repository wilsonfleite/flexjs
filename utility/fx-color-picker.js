import { LitElement, html, css, map } from '../refs/lit.js';
const TAG_NAME = 'fx-color-picker'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            display: block;
            width: fit-content;
            box-sizing: border-box;
            background-color: var(--fx-background);
        }

        .grid {
            display: flex;
            flex-direction: row;
            gap: 1px;
        }

        .column {
            display: flex;
            flex-direction: column;
            gap: 1px;
        }

        .column > div {
            width: 1rem;
            height: 1rem;
            cursor: pointer;
        }

        .column > div:hover {
            outline: 1px solid var(--fx-background-contrast);
        }

        .inputs {
            margin-top: 0.4rem;
            display: flex;
            flex-direction: row;
            justify-content: space-between; 
            align-items: flex-end;
        }

        .color-preview {
            display: block;
            width: 2rem;
            height: 2rem;
            border: 1px solid var(--fx-background-contrast);
        }

        .rgb {
            display: flex;
            flex-direction: row;
            gap: 0.2rem;
        }

        #red, #green, #blue {
            display: block; 
            width: 4rem;
        }

        #hexadecimal {
            display: block; 
            width: 5.5rem;
        }
    `

    _value = "#ff69b4"

    constructor(){
        super()
    }

    static properties = {
        value: {attribute: true, type: String}
    }

    set value(val) {
        let oldVal = this._value
        this._value = val
        this.requestUpdate('value', oldVal)
        this.dispatchChangeEvent()
        this.setColor(val)
    }
      
    get value() { 
        return this._value
    }

    dispatchChangeEvent(){
        let changeEvent = new Event('change', { bubbles: true })
        this.dispatchEvent(changeEvent)
    }

    rgbToHex(red, green, blue){
        red = red < 16 ? '0' + red.toString(16) : red.toString(16); 
        green = green < 16 ? '0' + green.toString(16) : green.toString(16);
        blue = blue < 16 ? '0' + blue.toString(16) : blue.toString(16);

        return '#' + red + green + blue; 
    }

    hexToRgb(hex) {
        hex = hex.replace('#', '');
        if(hex.length === 3){
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
      
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
      
        return {r, g, b};
    }

    colorLuminosity(col, lum) {
        col = col.replace(/^#/, '')
        if (col.length === 3) col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2]
      
        let [r, g, b] = col.match(/.{2}/g);
        ([r, g, b] = [parseInt(r, 16) + lum, parseInt(g, 16) + lum, parseInt(b, 16) + lum])
      
        r = Math.max(Math.min(255, r), 0).toString(16)
        g = Math.max(Math.min(255, g), 0).toString(16)
        b = Math.max(Math.min(255, b), 0).toString(16)
      
        const rr = (r.length < 2 ? '0' : '') + r
        const gg = (g.length < 2 ? '0' : '') + g
        const bb = (b.length < 2 ? '0' : '') + b
      
        return `#${rr}${gg}${bb}`
    }

    colorPicked(color){
        this.setColor(color)
    }

    firstUpdated(){
        this.setColor(this.value)
    }

    setColor(color){
        const colorPreview = this.shadowRoot.querySelector('.color-preview')

        if (colorPreview.getAttribute('data-status') == 'updating') return

        this._value = color
        colorPreview.setAttribute('data-status', 'updating')
        colorPreview.setAttribute('data-color', color)
        colorPreview.style.backgroundColor = color

        const rgb = this.hexToRgb(color)
        const red = rgb.r
        const green = rgb.g
        const blue = rgb.b

        this.shadowRoot.querySelector('#red').value = Number.isNaN(red) ? 0 : red;
        this.shadowRoot.querySelector('#green').value = Number.isNaN(green) ? 0 : green;
        this.shadowRoot.querySelector('#blue').value = Number.isNaN(blue) ? 0 : blue;
        this.shadowRoot.querySelector('#hexadecimal').value = color

        colorPreview.setAttribute('data-status', '')
    }

    calcColorFromRGB(){
        const red = this.shadowRoot.querySelector('#red').value;
        const green = this.shadowRoot.querySelector('#green').value;
        const blue = this.shadowRoot.querySelector('#blue').value;
        const hex = this.rgbToHex(red, green, blue)
        this.setColor(hex);
    }

    calcColorFromHex(){
        const hex = this.shadowRoot.querySelector('#hexadecimal').value
        this.setColor(hex);
    }

    render() {

        const colors = ['#607D8B','#7F7F7F','#7F2A00','#FF5500','#FFAA00','#FFFF00',
            '#AAFF00','#55FF00','#00FF00','#00FF55','#00FFAA','#00FFFF','#00AAFF',
            '#0055FF','#0000FF','#5500FF','#AA00FF','#FF00FF','#FF00AA','#FF0055','#FF0000']
        const lums = [230,179,128,77,26,0,-26,-77,-128,-179,-230]

        return html`
        <div class="grid">
            ${map(colors, (color) => html`
                <div class="column">
                    ${map(lums, (lum) => html`<div style="background-color: ${this.colorLuminosity(color, lum)}" 
                    @click="${()=>this.colorPicked(this.colorLuminosity(color, lum))}"></div>`)}
                </div>
            `)}
        </div>
        <div class="inputs">
            <div class="rgb">
                <fx-text-field id="red" input-type="number" type="number" min="0" max="255" 
                    label="Red" @change="${this.calcColorFromRGB}"></fx-text-field>
                <fx-text-field id="green" input-type="number" type="number" min="0" max="255" 
                    label="Green" @change="${this.calcColorFromRGB}"></fx-text-field>
                <fx-text-field id="blue" input-type="number" type="number" min="0" max="255" 
                    label="Blue" @change="${this.calcColorFromRGB}"></fx-text-field>
            </div>
            <div class="hexa">
                <fx-text-field id="hexadecimal" label="Hexadecimal" @change="${this.calcColorFromHex}"></fx-text-field>
            </div>
            <div class="color-preview" data-color="" data-status=""></div>
        </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);