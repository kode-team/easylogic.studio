import { uuidShort } from "../../util/functions/math";
import {
  isFunction,
  isUndefined
} from "../../util/functions/func";


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

          const isDiff = target.json[key] != value; 

          target.json[key] = value;

          if (isDiff) {
            this.changed()
          }

        } else {
          throw new Error(`${value} is invalid as ${key} property value.`);
        }

        return true;
      }
    });

    if (json instanceof Item) {
      json = json.toJSON();
    }

    this.json = this.convert(Object.assign(this.getDefaultObject(), json));

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

  getIcon () {
    return '';
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

  isChanged(timestamp) {
    return this.json.timestamp != Number(timestamp);
  }

  changed() {
    this.json.timestamp = Date.now();
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

  get top () {
    if (!this.parent) return this.ref; 

    let localParent = this.parent; 
    do {
      if (!localParent.parent) {
        return localParent; 
      }

      localParent = localParent.parent; 

    } while(localParent);
  }

  getInnerId(postfix = '') {
    return this.json.id + postfix;
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
  //   this.$selection.select(this.id);
  // }

  /**
   * when json is loaded, json object is be a new instance
   *
   * @param {*} json
   */
  convert(json) {

    if (json.layers) {
      json.layers.forEach(layer => {
        layer.parent = this.ref; 
      })
  
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

    this.json = this.convert(Object.assign(this.json, obj));
    this.changed();
  }

  /**
   * define defaut object for item
   *
   * @param {object} obj
   */
  getDefaultObject(obj = {}) {
    var id = uuidShort()
    return {
      id,
      visible: true,  // 보이기 여부 설정 
      lock: false,    // 편집을 막고 
      selected: false,  // 선택 여부 체크 
      layers: [],   // 하위 객체를 저장한다. 
      ...obj
    };
  }

  add (layer, direction = 'self') {

    // 객체를 추가할 때는  layer 의 절대 값을 기준으로 객체를 움직인다. 
    let rect = {} 
    if (layer.parent) {
      rect = layer.screenRect;
      layer.remove();
    }

    if (direction === 'self') {   // layer 를  자식으로 추가 
      layer.parent = this.ref;         

      this.json.layers.push(layer);
    } else if (direction === 'before') {  // layer 를 나의 앞으로 추가 
      // 현재 객체 앞으로 넣기 
      layer.parent = this.parent.ref; 

      var list  = []
      this.parent.layers.forEach(it => {
        if (it === this.ref) {
          list.push(layer);
        }                
        list.push(it);
      }) 

      this.parent.layers = list;       

    } else if (direction === 'after') {  // layer 를 나의 뒤로 추가 
      // 현재 객체 뒤로 넣기 
      layer.parent = this.parent.ref;   

      var list  = []
      
      this.parent.layers.forEach(it => {
        list.push(it);        
        if (it === this.ref) {
          list.push(layer);
        }        
      }) 

      this.parent.layers = list; 
      
    }

    if (rect.left) layer.setScreenX(rect.left.value);
    if (rect.top) layer.setScreenY(rect.top.value);    

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

  hasParent (parentId) {
    var isParent = this.json.parent.id === parentId

    if (!isParent && this.json.parent.is('project') === false) return this.json.parent.hasParent(parentId);

    return isParent; 
  }

  get allLayers () {
    return [..._traverse(this.ref)]
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
