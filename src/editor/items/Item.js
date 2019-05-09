import { uuidShort, uuid } from "../../util/functions/math";
import {
  isFunction,
  isUndefined,
  isNotUndefined
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

  /** get parentId */
  get parentId() {
    return this.json.parentId;
  }

  /**
   * get children
   */
  get children() {
    var children = editor.children(this.id);
    children.sort((a, b) => {
      if (a.index === b.index) return 0;

      return a.index > b.index ? 1 : -1;
    });
    return children;
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

  initRect() {
    editor.selection.initRect();
  }

  /**
   * when json is loaded, json object is be a new instance
   *
   * @param {*} json
   */
  convert(json) {
    if (isUndefined(json.id)) {
      json.id = uuidShort();
    }
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
   * search children by searchObj
   *
   * @param {object} searchObj
   */
  search(searchObj = {}) {
    return editor.search({ parentId: this.id, ...searchObj });
  }

  /**
   * search first one by searchObj
   * @param {object} searchObj
   */
  one(searchObj) {
    return this.search(searchObj)[0];
  }

  /**
   * clone Item
   */
  clone(isNew = false) {
    var json = JSON.parse(JSON.stringify(this.json));
    if (isNew) delete json.id;

    var ItemClass = this.constructor;

    return new ItemClass(json);
  }

  /**
   *
   * @param {string} itemType
   * @param {Item} item   Item instance
   * @param {string} sortType  sort parent's children by sortType
   */
  addItem(itemType, item, sortType) {
    if (item.itemType != itemType) {
      throw new Error(`Only ${itemType} is able to add in ${this.json.type}`);
    }

    var newItem = editor.add(this.id, item);

    if (isUndefined(sortType)) {
      this.sort();
    } else {
      this.sort(sortType);
    }

    return newItem;
  }

  /**
   * addItem alias
   *
   * @param {*} item
   */
  add(item) {
    return this.addItem(item.itemType, item, item.itemType);
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
      index: Number.MAX_SAFE_INTEGER,
      visible: true,
      lock: false,
      ...obj
    };
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

  /**
   * check item type
   *
   * @param {string} itemType
   */
  is(itemType) {
    return this.json.itemType == itemType;
  }

  /**
   * remove item
   */
  remove(isDeleteChildren = true) {
    editor.remove(this.id, isDeleteChildren);
  }

  /**
   * remove children for item
   *
   * @param {string} itemType
   */
  clear(itemType) {
    if (isNotUndefined(itemType)) {
      this.search({ itemType }).forEach(c => c.remove());
    } else {
      editor.removeChildren(this.id, this);
    }
  }

  /**
   * get parent item instance
   */
  parent() {
    return editor.get(this.parentId);
  }

  /**
   * sorting children
   *
   * @param {string} itemType
   */
  sort(itemType) {
    var children = this.children;

    if (itemType) {
      children = children.filter(it => it.itemType === itemType);
    }

    children.sort((a, b) => {
      if (a.index === b.index) return 0;
      return a.index > b.index ? 1 : -1;
    });

    children.forEach((it, index) => {
      it.index = index * 100;
    });
  }

  copy() {
    return editor.copy(this.id);
  }

  insertLast(source) {
    var selfParent = this.parent();
    var sourceParent = source.parent();

    source.parentId = this.json.parentId;
    source.index = this.json.index + 1;

    selfParent.sort();
    sourceParent.sort();
  }

  /**
   * get hirachy path s
   */
  path(parentId) {
    var path = [];
    var currentId = isNotUndefined(parentId) ? parentId : this.parentId;

    if (!parentId) {
      path = [editor.get(this.json.id)];
    }

    do {
      var item = editor.get(currentId);
      if (item) {
        path.push(item);
      }

      currentId = item ? item.parentId : this.json.parentId;
    } while (currentId);

    return path;
  }
}
