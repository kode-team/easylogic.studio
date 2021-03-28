
import { LOAD } from "el/base/Event";
import shortcuts from "../../shortcuts";
import { os } from "el/base/functions/detect";
import { registElement } from "el/base/registerElement";
import { EditorElement } from "../common/EditorElement";

const keyUnitCode = {
  'option': '⌥',
  'cmd': '⌘',
  'shift': '⇧',
  'alt': '⎇',
  'ctrl': '⌃',
  'enter': '⏎',
  'escape': '⎋',
  'arrowdown': '↓',
  'arrowup': '↑',
  'arrowleft': '←',
  'arrowright': '→',
  'backspace': 'Delete',
  'minus': '-',
  'equal': '+'
}

function convertKeyString(key) {
  return key.toLowerCase().split('+').map(it => {
    return keyUnitCode[it] || it;
  }).join(' + ')
}

export default class ShortCutItems extends EditorElement {

  template() {
    return /*html*/`
      <div class='shortcut-items'></div>
    `;
  }

  [LOAD('$el')] () {
    const name = os()
    return shortcuts.map(it => {
      return /*html*/`
        <div class='shortcut-item'>
          <div class='command'>
            <label>${it.description}</label>
            <span><kbd>${convertKeyString(it[name] || it.key)}</kbd></span>
          </div>
          <div class='when'>${it.when}</div>
        </div>
      `
    })
  }

}

registElement({ ShortCutItems })