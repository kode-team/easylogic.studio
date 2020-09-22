import { uuidShort } from "@core/functions/math";
import {
  isFunction,
  isUndefined
} from "@core/functions/func";


function _traverse(obj) {
  var results = [] 

  obj.layers.length && obj.layers.forEach(it => {
    results.push(..._traverse(it));
  })

  results.push(obj);

  return results; 
}

/**
 * Item , 그리기를 위한 기본 모델 
 * 유니크한 아이디를 가진다. 
 * 
 * @class
 */
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
    this.json.timestamp = this.json._timestamp + performance.now();
  }

  /***********************************
   *
   * getter
   *
   **********************************/

  /**
   * title 속성 
   */
  get title() {
    return this.json.name || this.getDefaultTitle();
  }


  get allLayers () {
    return [..._traverse(this.ref)]
  }

  /**
   * get id
   */
  get id() {
    return this.json.id;
  }

  /**
   * 자식 객체 리스트
   * 
   * @returns {Item[]}
   */
  get layers () {
    return this.json.layers; 
  }

  /**
   * @returns {Item}
   */
  get parent () {
    return this.json.parent;
  }

  /**
   * 객체 깊이를 동적으로 계산 
   * 
   * @returns {number}
   */
  get depth () {
    if (!this.parent) return 1; 

    return this.parent.depth + 1; 
  }

  /**
   * 최상위 컴포넌트 찾기 
   * 
   * @returns {Item}
   */
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

  /**
   * 상속 구조 안에서 id 리스트 
   * 
   * @returns {string[]}
   */
  get path () {

    if (!this.parent) return [ this.id ];

    return [...this.parent.path, this.id];
  }

  /**
   * 부모의 자식들 중 나의 위치 찾기 
   * 
   * @returns {number}  나이 위치 index 
   */
  get positionInParent () {

    if (!this.parent) return -1; 

    const layers = this.parent.layers;

    let index = -1; 
    for(var i = 0, len = layers.length; i < len; i++) {
      if (layers[i] === this.ref) {
        index = i; 
        break; 
      }
    }

    return index;
  }

  /**
   * id 기반 문자열 id 생성
   * 
   * @param {string} postfix 
   */
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


  generateListNumber () {
    this.layers.forEach((it, index) => {
      it.no = index; 

      it.generateListNumber();
    })    
  }

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

  toCloneObject (isDeep = true) {
    var json = {
      itemType: this.json.itemType,
      elementType: this.json.elementType,
      type: this.json.type,
      visible: this.json.visible,  // 보이기 여부 설정 
      lock: this.json.lock,    // 편집을 막고 
      selected: this.json.selected,  // 선택 여부 체크 
    }

    if (isDeep) {
      json.layers = this.json.layers.map(layer => layer.clone(isDeep))
    }

    return json; 
  }

  /**
   * clone Item
   */
  clone(isDeep = true) {

    var ItemClass = this.constructor;


    // 클론을 할 때 꼭 부모 참조를 넘겨줘야 한다. 
    // 그렇지 않으면 screenX, Y 에 대한 값을 계산할 수가 없다. 
    var item =  new ItemClass(this.toCloneObject(isDeep));
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
      _timestamp: Date.now(),
      _time: performance.now(),
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
   * 특정한 위치에 자식 객체로 Item 을 추가 한다. 
   * set position in layers 
   * 
   * @param {Number} position 
   * @param {Item} item 
   */
  setPositionInPlace (position, item) {
    this.layers.splice(position, 0, item);
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

  isTreeItemHide () {

    let currentParent = this.parent;
    let collapsedList = [] 
    do {
      if (currentParent.is('project')) break;
      else if (currentParent.is('artboard')) break;

      collapsedList.push(Boolean(currentParent.collapsed))
      currentParent = currentParent.parent; 
    } while (currentParent)

    // 부모중에 하나라도 collapsed 가 있으면 여긴 트리에서 숨김 
    return Boolean(collapsedList.filter(Boolean).length);

  }

  expectJSON (key) {
    if (key === 'parent') return false; 
    if (isUndefined(this.json[key])) return false; 

    return true; 
  }

  /**
   * convert to json
   * 
   */
  toJSON() {
    const json = this.json; 

    let newJSON = {}
    Object.keys(json).filter(key => this.expectJSON(key)).forEach(key => {
      newJSON[key] = json[key]; 
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

  /**
   * 외부에서 Dom 을 직접적으로 업데이트 할 때 사용 
   * Root 객체부터 다시 만들지 않는다. 
   * 
   * @param {Dom} element 
   * @public
   * @override
   */
  updateFunction (element) {}
}
