import { uuidShort } from "../../util/functions/math";
import {
  isFunction,
  isUndefined
} from "../../util/functions/func";
import { editor } from "../editor";


function _traverse(obj) {
  var results = [] 

  obj.layers.length && obj.layers.forEach(it => {
    results.push(..._traverse(it));
  })

  results.push(obj);

  return results; 
}

export class Item {
  constructor(json = {}) {
    if (json instanceof Item) {
      json = json.toJSON();
    }
    this.json = this.convert({ ...this.getDefaultObject(), ...json });

    this.ref = new Proxy(this, {
      get: (target, key) => {
        var originMethod = target[key];
        if (isFunction(originMethod)) {
          // method tracking
          return (...args) => {
            return originMethod.apply(target, args);
          };
        } else {
          // getter or json property
          return originMethod || target.json[key];
        }
      },
      set: (target, key, value) => {
        // Dom 객체가 오면 자동으로 입력 해줌
        if (value && value.realVal && isFunction(value.realVal)) {
          value = value.realVal();
        }

        if (this.checkField(key, value)) {
          target.json[key] = value;
        } else {
          throw new Error(`${value} is invalid as ${key} property value.`);
        }

        return true;
      }
    });

    return this.ref; 
  }

  /***********************************
   *
   * override
   *
   **********************************/

  getDefaultTitle() {
    return "Item";
  }

  /**
   * check attribute object
   */
  isAttribute() {
    return false;
  }

  /***********************************
   *
   * getter
   *
   **********************************/

  get title() {
    return this.json.name || this.getDefaultTitle();
  }

  /**
   * get id
   */
  get id() {
    return this.json.id;
  }

  get layers () {
    return this.json.layers; 
  }

  get parent () {
    return this.json.parent;
  }

  is (itemType) {
    if (!this.json) return false;
    return this.json.itemType === itemType;
  }

  /***********************************
   *
   * action
   *
   **********************************/

  /**
   * select item
   */
  select() {
    editor.selection.select(this.id);
  }

  /**
   * when json is loaded, json object is be a new instance
   *
   * @param {*} json
   */
  convert(json) {
    return json;
  }

  /**
   * defence to set invalid key-value
   *
   * @param {*} key
   * @param {*} value
   */
  checkField(key, value) {
    return true;
  }


  /**
   * clone Item
   */
  clone() {
    var json = {...this.json};
    delete json.id;

    var ItemClass = this.constructor;

    return new ItemClass(json);
  }

  /**
   * set json content
   *
   * @param {object} obj
   */
  reset(obj) {
    if (obj instanceof Item) {
      obj = obj.toJSON();
    }

    this.json = this.convert({ ...this.json, ...obj });
  }

  /**
   * define defaut object for item
   *
   * @param {object} obj
   */
  getDefaultObject(obj = {}) {
    return {
      id: uuidShort(),
      visible: true,  // 보이기 여부 설정 
      lock: false,    // 편집을 막고 
      selected: false,  // 선택 여부 체크 
      layers: [],   // 하위 객체를 저장한다. 
      ...obj
    };
  }

  add (layer) {
    this.json.layers.push(layer);
    layer.parent = this.ref; 
    return layer;
  }

  /**
   * toggle item's attribute
   *
   * @param {*} field
   * @param {*} toggleValue
   */
  toggle(field, toggleValue) {
    if (isUndefined(toggleValue)) {
      this.json[field] = !this.json[field];
    } else {
      this.json[field] = !!toggleValue;
    }
  }

  /**
   * convert to json
   */
  toJSON() {
    return this.json;
  }

  get html () {
    var {tagName, id, layers, content, itemType} = this.json;

    tagName = tagName || 'div'

    var selected = this.json.selected ? 'selected' : ''

    return `
    <${tagName} class='element-item ${selected} ${itemType}' data-id="${id}">${content ? content : ''}
      ${layers.map(it => it.html)}
    </${tagName}>
    `
  }

  get allLayers () {
    return [..._traverse(this.ref)]
  }
}
