import { uuidShort, uuid } from "../../util/functions/math";
import {
  isFunction,
  isUndefined,
  OBJECT_TO_CLASS,
  OBJECT_TO_PROPERTY
} from "../../util/functions/func";
// import { editor } from "../editor";


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
        // if (value && value.realVal && isFunction(value.realVal)) {
        //   value = value.realVal();
        // }

        if (this.checkField(key, value)) {
          target.json[key] = value;
        } else {
          throw new Error(`${value} is invalid as ${key} property value.`);
        }

        return true;
      }
    });

    if (json instanceof Item) {
      json = json.toJSON();
    }

    this.json = this.convert({ ...this.getDefaultObject(), ...json });

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

  isLeaf() {
    return true; 
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


  // selection 이후에 
  // 위치나 , width, height 등의 geometry 가 변경되었을 때 호출 하는 함수 
  recover () {  
    // 내부에 자신의 객체에 필요한 것들을 복구한다. 
  }

  setCache() {

  }

  is (...itemType) {
    if (!this.json) return false;
    return itemType.indexOf(this.json.itemType) > -1;
  }

  isNot (...itemType) {
    return this.is(...itemType) === false;
  }

  /***********************************
   *
   * action
   *
   **********************************/

  /**
   * select item
   */
  // select() {
  //   editor.selection.select(this.id);
  // }

  /**
   * when json is loaded, json object is be a new instance
   *
   * @param {*} json
   */
  convert(json) {

    json.layers.forEach(layer => {
      layer.parent = this.ref; 
    })

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

  toCloneObject () {
    var json = {
      itemType: this.json.itemType,
      elementType: this.json.elementType,
      type: this.json.type,
      visible: this.json.visible,  // 보이기 여부 설정 
      lock: this.json.lock,    // 편집을 막고 
      selected: this.json.selected,  // 선택 여부 체크 
      layers: this.json.layers.map(layer => layer.clone())
    }

    return json; 
  }

  /**
   * clone Item
   */
  clone() {

    var ItemClass = this.constructor;


    // 클론을 할 때 꼭 부모 참조를 넘겨줘야 한다. 
    // 그렇지 않으면 screenX, Y 에 대한 값을 계산할 수가 없다. 
    var item =  new ItemClass(this.toCloneObject());
    item.parent =   this.json.parent

    return item; 
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
    var id = uuidShort()
    // console.log(id, this);
    return {
      id,
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

  expectJSON (key) {
    if (key === 'parent') return false; 
    if (this.json[key] === '') return false; 

    return true; 
  }

  /**
   * convert to json
   * 
   */
  toJSON() {
    var a = this.json; 

    var newJSON = {}
    Object.keys(a).filter(key => this.expectJSON(key)).forEach(key => {
      newJSON[key] = a[key]; 
    })

    return newJSON;
  }

  get toDefString() {
    return '' 
  }

  get html () {
    var {elementType, id, name, layers, itemType} = this.json;

    const tagName = elementType || 'div'

    return /*html*/`<${tagName} class="${OBJECT_TO_CLASS({
      'element-item': true,
      [itemType]: true 
    })}" ${OBJECT_TO_PROPERTY({
      'data-id': id,
      'data-title': name 
    })}>
    ${this.toDefString}
  ${layers.map(it => it.html).join('\n\t')}
</${tagName}>`
  }

  resize () {}

  copy () {
    return this.json.parent.copyItem(this.ref);
  }

  copyItem (childItem, dist = 10 ) {
     // clone 을 어떻게 해야하나? 

    var child = childItem.clone()  

    child.x.add(dist);
    child.y.add(dist);

    var layers = this.json.layers;

    var childIndex = -1; 
    for(var i = 0, len = layers.length; i < len; i++) {
      if (layers[i] === childItem) {
        childIndex = i; 
        break;
      }
    }

    if (childIndex > -1) {
      this.json.layers.splice(childIndex+1, 0, child);
    }
    return child;
  }

  remove () {
    this.json.parent.removeItem(this.ref);
  }

  removeItem (childItem) {
    var layers = this.json.layers;

    var childIndex = -1; 
    for(var i = 0, len = layers.length; i < len; i++) {
      if (layers[i] === childItem) {
        childIndex = i; 
        break;
      }
    }

    if (childIndex > -1) {
      this.json.layers.splice(childIndex, 1);
    }
  }

  get allLayers () {
    return [..._traverse(this.ref)]
  }

  getIndex () {
    var parent = this.json.parent;    
    var startIndex = -1; 
    for(var i = 0, len = parent.layers.length; i < len; i++) {
      if (layers[i] === this.ref) {
        startIndex = i; 
        break;
      }
    }

    return startIndex;
  }

  setOrder (targetIndex) {
    var parent = this.json.parent; 

    var startIndex = this.getIndex()

    parent.layers.splice(
      targetIndex + (startIndex < targetIndex ? -1 : 0),
      0,
      ...arr.splice(startIndex, 1)
    )
  }

  orderNext() {
    var startIndex = this.getIndex();
    if (startIndex > -1) {
      this.setOrder(startIndex + 1);
    }
  }

  orderPrev () {
    var startIndex = this.getIndex();
    if (startIndex > 0) {
      this.setOrder(startIndex - 1);
    }
  }

  orderFirst () {
    this.setOrder(0)
  }

  orderLast () {
    this.setOrder(this.json.parent.layers.length-1)
  }

  searchById (id) {

    if (this.id === id) {
      return this.ref; 
    }

    for(var i = 0, len = this.layers.length; i < len; i++) {
      const item = this.layers[i]

      if (item.id === id) {
        return item; 
      } else {
        var searchedItem = item.searchById(id);

        if (searchedItem) {
          return searchedItem;
        }
      }
    }

    return null;
  }


  updateFunction (element) {}
}
