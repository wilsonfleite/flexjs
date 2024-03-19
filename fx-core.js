// Layout
import './layout/fx-accordion.js'
import './layout/fx-drawer.js'
import './layout/fx-row.js'
import './layout/fx-column.js'
import './layout/fx-section.js'
import './layout/fx-container.js'
import './layout/fx-card.js'
import './layout/fx-tabs.js'
import './layout/fx-tab.js'
import './layout/fx-list-card.js'
import './layout/fx-list-card-block.js'

// Navigation
import './navigation/fx-side-menu.js'
import './navigation/fx-side-menu-item.js'
import './navigation/fx-side-menu-subitem.js'
import './navigation/fx-menu-bar.js'
import './navigation/fx-menu-bar-item.js'
import './navigation/fx-menu-bar-subitem.js'
import './navigation/fx-context-menu.js'
import './navigation/fx-context-menu-item.js'

// Data
import './data/fx-table.js'
import './data/fx-table-row.js'
import './data/fx-table-row-append.js'
import './data/fx-table-cell.js'
import './data/fx-table-cell-select.js'
import './data/fx-table-cell-expand.js'
import './data/fx-table-head-row.js'
import './data/fx-table-head-cell.js'
import './data/fx-table-head-select.js'
import './data/fx-table-head-expand.js'
import './data/fx-kanban-board.js'
import './data/fx-kanban-container.js'
import './data/fx-kanban-card.js'
import './data/fx-kanban-tag.js'

// Display
import './display/fx-icon.js'
import './display/fx-text.js'
import './display/fx-image.js'
import './display/fx-title.js'
import './display/fx-markdown.js'

// Buttons
import './buttons/fx-button.js'
import './buttons/fx-catalog-button.js'
import './buttons/fx-toggle-text-button.js'

// Inputs
import './inputs/fx-text-field.js'
import './inputs/fx-text-field-option.js'
import './inputs/fx-select.js'
import './inputs/fx-select-option.js'
import './inputs/fx-multiselect.js'
import './inputs/fx-multiselect-option.js'
import './inputs/fx-textarea.js'
import './inputs/fx-radio.js'
import './inputs/fx-radio-option.js'
import './inputs/fx-checkbox.js'
import './inputs/fx-date.js'
import './inputs/fx-list.js'

// Dialogs
import './dialogs/fx-alert.js'
import './dialogs/fx-modal.js'
import './dialogs/fx-dialog-box.js'

// Charts

// Utility
import './utility/fx-file-picker.js'
import './utility/fx-color-picker.js'

// Flow
// import './flow/fx-code-container.js'
// import './flow/fx-code-block.js'

// API 


let documentClickListeners = [];

export class DocumentClickEmitter {
    constructor() {}

    subscribe(element, callback) {
        documentClickListeners.push({'element':element, 'callback':callback});
    }

    unsubscribe(element, callback) {
        documentClickListeners = documentClickListeners.filter(item => item['callback'] !== callback || item['element'] !== element)
    }

    emit(e) {
        documentClickListeners.forEach((element) => {
            element['element'][element['callback']](e)
        });
        // console.log(documentClickListeners)
    }
}

const documentClickEmitter = new DocumentClickEmitter();
document.addEventListener("click", (e) => documentClickEmitter.emit(e));

export function toTypeValue(value, type){
    function converter(value, type){
        let newValue
        switch(type){
            case 'text':
                newValue = String(value)
                break
            case 'number':
                newValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value)
                break
            default:
                newValue = value
                break
        }
        return newValue
    }
    let newValue
    if (Array.isArray(value)){
        newValue = value.map(val => converter(val, type))
    } else {
        newValue = converter(value, type)
    }
    return newValue
}

export function pickTextColorBasedOnBgColor(bgColor, lightColor, darkColor, factor=165) {
    var luminance = {r: 0.2126, g: 0.7152, b:0.0722};
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor
    var r = parseInt(color.substring(0, 2), 16) // hexToR
    var g = parseInt(color.substring(2, 4), 16) // hexToG
    var b = parseInt(color.substring(4, 6), 16) // hexToB

    var r_lum = luminance.r * r
    var g_lum = luminance.g * g
    var b_lum = luminance.b * b

    var o = Math.round((parseInt(r_lum) + parseInt(g_lum) + parseInt(b_lum)) )
    if(o > factor) {
        return darkColor
    }else{
        return lightColor
    }
}

export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}