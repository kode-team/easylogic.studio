import { uuidShort } from "../../util/functions/math";
import {
  isFunction,
  isUndefined
} from "../../util/functions/func";
import { editor } from "../editor";

export class Item {
  constructor(json = {}) {
    if (json instanceof Item) {
      json = json.toJSON();
    }
    this.json = this.convert({ ...this.getDefaultObject(), ...json });

    return new Proxy(this, {
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
    return `${this.json.name || this.getDefaultTitle()}`;
  }

  /**
   * get id
   */
  get id() {
    return this.json.id;
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
      layers: [],   // 하위 객체를 저장한다. 
      ...obj
    };
  }

  add (layer) {
    this.json.layers.push(layer);
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
    var {tagName, id, layers} = this.json;

    tagName = tagName || 'div'

    return `
    <${tagName} class='item' data-id="${id}">
      ${layers.map(it => it.html)}
    </${tagName}>
    `
  }
}
