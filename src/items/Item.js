import { uuidShort } from "@core/functions/math";
import {
  clone,
  isFunction,
  isUndefined
} from "@core/functions/func";

function _traverse(obj) {
  var results = [] 

  obj.layers.length && obj.layers.forEach(it => {
    results.push.apply(results, _traverse(it));
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


  /**
   * 
   * @return {Item[]} 자신을 포함안 하위 모든 자식을 조회 
   */
  get allLayers () {
    return _traverse(this.ref)
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

  setParent (otherParent) {
    this.json.parent = otherParent;
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
   * 최상위 project 구하기 
   * 
   * @returns {Project}
   */
  get project () {
    return this.path.find(it => it.is('project'))
  }

  /**
   * 최상위 artboard 구하기 
   * 
   * @returns {ArtBoard}
   */
  get artboard () {
    return this.path.find(it => it.is('artboard'))
  }

  /**
   * 상속 구조 안에서 instance 리스트
   * 
   * @returns {Item[]}
   */
  get path () {

    if (!this.parent) return [ this.ref ];

    const list = this.parent.path;

    list.push(this.ref);

    return list;
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

  is (checkItemType) {
    if (!this.json) return false;
    return checkItemType === this.json.itemType;
  }

  isNot (checkItemType) {
    return this.is(checkItemType) === false;
  }

  isSVG() {
    return false; 
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
    var json = this.attrs(
      'itemType', 'elementType', 'type', 'visible', 'lock', 'selected'
    )

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

    // 부모를 넘겨줘야 상대 주소를 맞출 수 있다. 
    var item =  new ItemClass(this.toCloneObject(isDeep));
    item.setParent(this.json.parent)

    return item; 
  }

  /**
   * set json content
   *
   * @param {object} obj
   */
  reset(obj) {
    // if (obj instanceof Item) {
    //   obj = obj.toJSON();
    // }

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

  /**
   * 지정된 필드의 값을 object 형태로 리턴한다. 
   * 
   * @param  {...string} args 필드 리스트 
   */
  attrs (...args) {
    const result = {}

    args.forEach(field => {
      result[field] = clone(this.json[field])
    })

    return result;
  }

  /**
   * 자식을 가지고 있는지 체크 
   * 
   * @returns {boolean}
   */
  hasChildren () {
    return this.layers.length > 0;
  }

  /**
   * 자식으로 추가한다. 
   * 
   * @param {Item} layer 
   */
  appendChildItem (layer) {

    if (layer.parent === this.ref) {
      return layer;
    }

    this.resetMatrix(layer);

    // 객체를 추가할 때는  layer 의 절대 값을 기준으로 객체를 움직인다. 
    if (layer.parent) {
      layer.remove();
    }

    layer.setParent(this.ref);

    this.json.layers.push(layer);
    this.project.addIndexItem(layer);

    return layer; 
  }

  /**
   * 자식중에 맨앞에 추가한다. 
   * 
   * @param {Item} layer 
   */
  prependChildItem (layer) {
    this.resetMatrix(layer);
    // 객체를 추가할 때는  layer 의 절대 값을 기준으로 객체를 움직인다. 
    if (layer.parent) {
      layer.remove();
    }

    layer.setParent(this.ref);

    this.json.layers.unshift(layer);
    this.project.addIndexItem(layer);

    return layer;     
  }

  resetMatrix (item) {

  }

  /**
   * 특정 index 에 자식을 추가한다. 
   * 
   * @param {Item} layer 
   * @param {number} index 
   */
  insertChildItem (layer, index = 0) {

    this.resetMatrix(layer);

    // 객체를 추가할 때는  layer 의 절대 값을 기준으로 객체를 움직인다. 
    if (layer.parent) {
      layer.remove();
    }

    layer.setParent(this.ref);
    this.json.layers.splice(index, 0, layer);
    this.project.addIndexItem(layer);

    return layer;     
  }

  /**
   * 현재 Item 의 그 다음 순서로 추가한다. 
   * 
   * @param {Item} layer 
   */
  appendAfter (layer) {

    const index = this.parent.findIndex(this);

    this.parent.insertChildItem(layer, index);
    this.project.addIndexItem(layer);
    return layer;     
  }


  /**
   * 현재 Item 의 이전 순서로 추가한다. 
   * 
   * @param {Item} layer 
   */
  appendBefore (layer) {

    const index = this.parent.findIndex(this);

    this.parent.insertChildItem(layer, index-1);
    this.project.addIndexItem(layer);
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

  /**
   * Item 복사하기 
   * 
   * @param {number} dist 
   */
  copy (dist = 0) {
    return this.json.parent.copyItem(this.ref, dist);
  }

  findIndex (item) {
    return this.json.layers.indexOf(item.ref);
  }

  copyItem (childItem, dist = 10 ) {
     // clone 을 어떻게 해야하나? 

    var child = childItem.clone()  
    child.move([dist, dist, 0])

    var childIndex = this.findIndex(childItem); 

    if (childIndex > -1) {
      this.json.layers.splice(childIndex+1, 0, child);
      this.project.addIndexItem(child);      
    }
    return child;
  }

  /**
   * 부모 객체에서 나를 지운다. 
   * remove self in parent 
   */
  remove () {
    this.json.parent.removeItem(this.ref);

    this.project.removeIndexItem(this.ref);
  }

  /**
   * remote child item 
   * 
   * @param {Item} childItem 
   */
  removeItem (childItem) {

    const index = this.findIndex(childItem);

    if (index > -1) {
      this.json.layers.splice(index, 1);
    }

  }

  /**
   * 부모 아이디를 가지고 있는지 체크 한다. 
   * 
   * @param {string} parentId 
   */
  hasParent (parentId) {
    var isParent = this.json.parent.id === parentId

    if (!isParent && this.json.parent.is('project') === false) return this.json.parent.hasParent(parentId);

    return isParent; 
  }



  /**
   * 하위 자식 객체 중에 id를 가진 Item 을 리턴한다. 
   * 
   * @param {string} id 
   * @returns {Item|null} 검색된 Item 객체 
   */
  searchById (id) {

    if (this.id === id) {
      project.addIndexItem(this.ref);      
      return this.ref; 
    }

    const project = this.project;

    for(var i = 0, len = this.layers.length; i < len; i++) {
      const item = this.layers[i]

      if (item.id === id) {
        project.addIndexItem(item);        
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
}
