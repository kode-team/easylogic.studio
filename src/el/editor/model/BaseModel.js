import { clone, isFunction, isNotUndefined, isNumber, isUndefined } from "el/sapa/functions/func";
import { uuid } from "el/utils/math";
import { ModelManager } from "../manager/ModelManager";

/**
 * Item , 그리기를 위한 기본 모델 
 * 유니크한 아이디를 가진다. 
 * 참조는 모드 id 로 관리하고 해당 id 는 ModelManager 객체에서 참조한다.
 * 
 * @class
 */
export class BaseModel {

  /**
   * 모델 생성자 
   * 
   * @param {object} json 초기화 할 데이타 
   * @param {ModelManager} modelManager
   */
  constructor(json = {}, modelManager) {    
    this.modelManager = modelManager;

    this.ref = new Proxy(this, {
      get: (target, key) => {
        if (this.getCache(key)) {
          return this.getCache(key);
        }

        var originMethod = target[key];
        if (isFunction(originMethod)) {

          if (!this.getCache(key)) {
            this.addCache(key, (...args) => {
              return originMethod.apply(target, args);
            });
          }

          return this.getCache(key);
        } else {
          // getter or json property
          return originMethod || target.json[key];
        }
      },
      set: (target, key, value) => {
        const isDiff = target.json[key] != value;

        if (isDiff) {
          this.reset({ [key]: value });
        }

        return true;
      },
      deleteProperty: (target, key) => {
        this.reset({ [key]: undefined });
      }
    });

    this.json = this.convert(Object.assign(this.getDefaultObject(), json));
    this.lastChangedField = {};
    this.lastChangedFieldKeys = [];
    this.cachedValue = {};
    this.timestamp = 0;

    return this.ref;
  }

  setModelManager(modelManager) {
    this.modelManager = modelManager;
  }

  /***********************************
   *
   * override
   *
   **********************************/

  getDefaultTitle() {
    return "Item";
  }

  getIcon() {
    return '';
  }

  isChanged(timestamp) {
    return this.timestamp != Number(timestamp);
  }

  changed() {
    this.timestamp += performance.now();
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

  renameWithCount() {
    let arr = this.json.name.split(' ');

    if (arr.length < 2) {
      return;
    }

    let last = arr.pop();
    let lastNumber = +last;
    if (isNumber(lastNumber) && isNaN(lastNumber) === false) {
      lastNumber++;
    } else {
      lastNumber = last;
    }

    const nextName = [...arr, lastNumber].join(' ')

    this.reset({
      name: nextName
    })
  }

  /**
   * 
   * @return {Item[]} 자신을 포함안 하위 모든 자식을 조회 
   */
  get allLayers() {
    return this.modelManager.getAllLayers(this.id);
  }

  /**
   * filterCallback 으로 필터링된 layer 리스트를 가지고 온다. 
   * 
   * @returns {Item[]}
   */
  filteredAllLayers(filterCallback) {
    return this.modelManager.getAllLayers(this.id, filterCallback);
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
  get layers() {
    return this.modelManager.getLayers(this.id, this.ref);
  }


  get parentId() {
    return this.json.parentId;
  }

  /**
   * @returns {Item}
   */
  get parent() {
    if (!this.json.parentId) return undefined;

    return this.modelManager.get(this.json.parentId);
  }

  setParentId(parentId) {
    this.json.parentId = parentId;

    this.modelManager.setChanged('setParentId', this.id, { parentId });        
  }

  /**
   * 객체 깊이를 동적으로 계산 
   * 
   * @returns {number}
   */
  get depth() {
    return this.modelManager.getDepth(this.id);
  }

  /**
   * 최상위 컴포넌트 찾기 
   * 
   * @returns {Item}
   */
  get top() {
    return this.modelManager.getRoot(this.id);
  }

  /**
   * 최상위 project 구하기 
   * 
   * @returns {Project}
   */
  get project() {
    return this.modelManager.getProject(this.id);
  }

  /**
   * 최상위 artboard 구하기 
   * 
   * @returns {ArtBoard}
   */
  get artboard() {
    return this.modelManager.getArtBoard(this.id);
  }

  /**
   * 상속 구조 안에서 instance 리스트
   * 
   * @returns {Item[]}
   */
  get path() {
    return this.modelManager.getPath(this.id, this.ref);
  }

  get lock() {
    return this.modelManager.editor.lockManager.get(this.id);
  }

  get visible() {
    return this.modelManager.editor.visibleManager.get(this.id);
  }

  get childrenLength() {
    return this.json.children.length;
  }

  /**
   * id 기반 문자열 id 생성
   * 
   * @param {string} postfix 
   */
  getInnerId(postfix = '') {
    return this.json.id + postfix;
  }

  is(checkItemType) {
    return this.json.itemType === checkItemType;
  }

  isNot(checkItemType) {
    return this.is(checkItemType) === false;
  }

  isSVG() {
    return false;
  }

  addCache(key, value) {
    this.cachedValue[key] = value;
  }

  getCache(key) {
    return this.cachedValue[key];
  }

  /**
   * BaseModel 에서 attribute key 를 기반으로 캐쉬를 적용한다. 
   * 렌더링 시에 캐쉬를 적용하지 않으면 렌더링이 느려지기 때문에
   * 각 객체마다 캐쉬를 적용하는 것이 좋다.
   * 
   * @param {string} key attirbute field name
   * @param {Function} newValueCallback cache 에 적용할 값을 구하는 함수
   * @returns 
   */
  computed(key, newValueCallback, isForce = false) {
    const cachedKey = `__cachedKey_${key}`
    const parsedKey = `${cachedKey}__parseValue`
    const value = this.json[key];

    // 캐쉬가 있으면 그대로 리턴
    if (isForce) {
      // NOOP 
      // isForce 가 true 일 때는 캐쉬를 적용하지 않는다.
    } else {
      if (this.getCache(key) === value && this.getCache(parsedKey)) {
        return this.getCache(parsedKey);
      }
    }

    // isForce 가 true 이면 다시 캐쉬를 만든다. 
    this.addCache(key, value);
    this.addCache(parsedKey, newValueCallback(value, this.ref));

    return this.getCache(parsedKey);
  }

  computedValue(key) {
    const cachedKey = `__cachedKey_${key}`
    const parsedKey = `${cachedKey}__parseValue`

    return this.getCache(parsedKey);
  }

  editable(editablePropertyName) {
    return true;
  }

  /***********************************
   *
   * action
   *
   **********************************/


  generateListNumber() {
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
  convert(json = {}) {
    return json;
  }

  setCache() {

  }

  toCloneObject(isDeep = true) {
    var json = this.attrs(
      'itemType', 'name', 'elementType', 'type', 'selected', 'parentId'
    )

    if (isDeep) {
      json.layers = this.json.children.map(childId => {
        return this.modelManager.clone(childId, isDeep)
      })
    }

    return json;
  }

  /**
   * clone Item
   */
  clone(isDeep = true) {
    return this.modelManager.clone(this.id, isDeep);
  }

  /**
   * check object values 
   * 
   * @param {KeyValue} obj 
   * @returns 
   */
  isChangedValue(obj) {
    return true;
  }

  /**
   * set json content
   *
   * @param {object} obj
   */
  reset(obj) {
    const isChanged = this.isChangedValue(obj);

    if (isChanged) {
      this.json = this.convert(Object.assign(this.json, obj));
      this.lastChangedField = obj;
      this.lastChangedFieldKeys = Object.keys(obj);
      this.modelManager.setChanged('reset', this.id, obj);
      this.changed();
    }

    return true;
  }

  /**
   * 마지막 변경된 field 를 체크한다. 
   * 
   * @returns {boolean} 
   */ 
  hasChangedField(...args) {
    return args.some(it => this.lastChangedField[it] !== undefined);
  }

  /**
   * define default object for item
   *
   * @param {object} obj
   */
  getDefaultObject(obj = {}) {
    var id = uuid()
    return {
      id,
      // visible: true,  // 보이기 여부 설정 
      // selected: false,  // 선택 여부 체크 
      children: [],   // 하위 객체를 저장한다. 
      offsetInParent: 1,  // 부모에서 자신의 위치를 숫자로 나타낸다. 
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
      if (isNotUndefined(this.json[field])) {
        result[field] = clone(this.json[field])
      }
    })

    return result;
  }

  /**
   * 자식을 가지고 있는지 체크 
   * 
   * @returns {boolean}
   */
  hasChildren() {
    return this.json.children.length > 0;
  }

  /**
   * 자식으로 추가한다. 
   * 
   * @param {BaseModel} layer  childItem 이 될 객체
   */
  appendChild(layer) {
    if (layer.parentId === this.id) {

      const hasId = this.json.children.find(it => it === layer.id)
      if (Boolean(hasId) === false) {
        // 아이디가 없는 경우 다시 아이디 넣어주기 
        this.json.children.push(layer.id);
        this.modelManager.setChanged('appendChild', this.id, {child: layer.id, oldParentId: layer.parentId});
      }

      return layer;
    }

    this.resetMatrix(layer);

    // 객체를 추가할 때는  layer 의 절대 값을 기준으로 객체를 움직인다. 
    if (layer.parent) {
      layer.remove();
    }

    layer.setParentId(this.id);

    this.json.children.push(layer.id);

    return layer;
  }

  resetMatrix(item) {

  }

  refreshMatrixCache() {

  }

  /**
   * 특정 index 에 자식을 추가한다. 
   * 
   * @param {Item} layer 
   * @param {number} index 
   */
  insertChild(layer, index = 0) {

    this.resetMatrix(layer);

    // 객체를 추가할 때는  layer 의 절대 값을 기준으로 객체를 움직인다. 
    if (layer.parent) {
      layer.remove();
    }

    layer.setParentId(this.id);
    this.json.children.splice(index, 0, layer.id);
    // this.project.addIndexItem(layer);
    this.modelManager.setChanged('insertChild', this.id, {childId: layer.id, index: 0})
    return layer;
  }

  /**
   * 현재 Item 의 그 다음 순서로 추가한다. 
   * 
   * @param {Item} layer 
   */
  appendAfter(layer) {

    const index = this.parent.findIndex(this);

    this.parent.insertChild(layer, index);
    // this.project.addIndexItem(layer);
    return layer;
  }


  /**
   * 현재 Item 의 이전 순서로 추가한다. 
   * 
   * @param {Item} layer 
   */
  appendBefore(layer) {

    const index = this.parent.findIndex(this);

    this.parent.insertChild(layer, index - 1);
    // this.project.addIndexItem(layer);
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
      this.reset({
        [field]: !this.json[field]
      });
    } else {
      this.reset({
        [field]: !!toggleValue
      });
    }
  }

  isTreeItemHide() {

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

  expectJSON(key) {
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

    if (this.hasChildren()) {
      newJSON.layers = this.json.children.map(childId => {
        return this.modelManager.get(childId)?.toJSON()
      })
    }


    return newJSON;
  }

  resize() { }

  /**
   * Item 복사하기 
   * 
   * @param {number} dist 
   */
  copy(dist = 0) {
    return this.parent.copyItem(this.id, dist);
  }

  findIndex(item) {
    return this.json.children.indexOf(item.id);
  }

  copyItem(childItemId, dist = 10) {
    const childItem = this.modelManager.get(childItemId);
    var child = childItem.clone()
    child.renameWithCount()
    child.move([dist, dist, 0])

    var childIndex = this.findIndex(childItem);

    if (childIndex > -1) {
      this.json.children.push(child.id);
    }
    return child;
  }

  /**
   * 부모 객체에서 나를 지운다. 
   * remove self in parent 
   */
  remove() {
    this.parent.removeChild(this.id);
  }

  /**
   * remote child item 
   * 
   * @param {Item} childItem 
   */
  removeChild(childItemId) {
    return this.modelManager.removeChild(this.id, childItemId);
  }

  /**
   * 부모 아이디를 가지고 있는지 체크 한다. 
   * 
   * @param {string} parentId 
   */
  hasParent(parentId) {
    return this.modelManager.hasParent(this.id, parentId);
  }

  /**
   * 특정 itemType 으로 데이타 변환 
   * 
   * @param {string} itemType 
   */
  to(itemType) {

  }
}
