import { clone, isFunction, isNumber, isUndefined } from "sapa";
import { uuid, uuidShort } from "elf/utils/math";

const identity = () => true;

function _traverse(obj, filterCallback = identity) {
  var results = [];

  let len = obj.layers.length;
  for (let start = len; start--; ) {
    let it = obj.layers[start];
    results.push(..._traverse(it.ref, filterCallback));
  }

  if (filterCallback(obj)) {
    results.push(obj);
  }

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
        const isDiff = target.json[key] != value;

        if (isDiff) {
          target.json[key] = value;
          this.changed();
        }

        return true;
      },
    });

    if (json instanceof Item) {
      json = json.toJSON();
    }

    this.json = this.convert(Object.assign(this.getDefaultObject(), json));
    this.lastChangedField = {};
    this.lastChangedFieldKeys = [];
    this.cachedValue = {};

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

  getIcon() {
    return "";
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
    this.json.timestamp = this.json._timestamp + window.performance.now();
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
    let arr = this.json.name.split(" ");

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

    const nextName = [...arr, lastNumber].join(" ");

    this.reset({
      name: nextName,
    });
  }

  /**
   *
   * @return {Item[]} 자신을 포함안 하위 모든 자식을 조회
   */
  get allLayers() {
    return _traverse(this.ref);
  }

  /**
   * filterCallback 으로 필터링된 layer 리스트를 가지고 온다.
   *
   * @returns {Item[]}
   */
  filteredAllLayers(filterCallback) {
    return _traverse(this.ref, filterCallback);
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
    return this.json.layers;
  }

  /**
   * @returns {Item}
   */
  get parent() {
    return this.json.parent;
  }

  setParent(otherParent) {
    this.json.parent = otherParent;
  }

  /**
   * 객체 깊이를 동적으로 계산
   *
   * @returns {number}
   */
  get depth() {
    if (!this.parent) return 1;

    return this.parent.depth + 1;
  }

  /**
   * 최상위 컴포넌트 찾기
   *
   * @returns {Item}
   */
  // eslint-disable-next-line getter-return
  get top() {
    if (!this.parent) return this.ref;

    let localParent = this.parent;
    do {
      if (!localParent.parent) {
        return localParent;
      }

      localParent = localParent.parent;
    } while (localParent);
  }

  /**
   * 최상위 project 구하기
   *
   * @returns {Project}
   */
  get project() {
    return this.path.find((it) => it.is("project"));
  }

  /**
   * 최상위 artboard 구하기
   *
   * @returns {ArtBoard}
   */
  get artboard() {
    return this.path.find((it) => it.is("artboard"));
  }

  /**
   * 상속 구조 안에서 instance 리스트
   *
   * @returns {Item[]}
   */
  get path() {
    if (!this.parent) return [this.ref];

    const list = this.parent.path;

    list.push(this.ref);

    return list;
  }

  /**
   * id 기반 문자열 id 생성
   *
   * @param {string} postfix
   */
  getInnerId(postfix = "") {
    return this.json.id + postfix;
  }

  is(checkItemType) {
    if (!this.json) return false;
    return checkItemType === this.json.itemType;
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

  computed(key, newValueCallback) {
    const cachedKey = `__cachedKey_${key}`;
    const parsedKey = `${cachedKey}__parseValue`;
    const value = this.json[key];
    if (this.getCache(key) === value && this.getCache(parsedKey)) {
      return this.getCache(parsedKey);
    }

    this.addCache(key, value);
    this.addCache(parsedKey, newValueCallback(value, this.ref));

    return this.getCache(parsedKey);
  }

  editable() {
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
    });
  }

  /**
   * when json is loaded, json object is be a new instance
   *
   * @param {*} json
   */
  convert(json) {
    if (json.layers) {
      json.layers.forEach((layer) => {
        layer.parent = this.ref;
      });
    }

    return json;
  }

  setCache() {}

  // /**
  //  * defence to set invalid key-value
  //  *
  //  * @param {*} key
  //  * @param {*} value
  //  */
  // checkField(key, value) {
  //   console.log(this, key, value);
  //   return true;
  // }

  toCloneObject(isDeep = true) {
    var json = this.attrs(
      "itemType",
      "name",
      "elementType",
      "type",
      "visible",
      "lock",
      "selected"
    );

    if (isDeep) {
      json.layers = this.json.layers.map((layer) => layer.clone(isDeep));
    }

    return json;
  }

  /**
   * clone Item
   */
  clone(isDeep = true) {
    var ItemClass = this.constructor;

    // 부모를 넘겨줘야 상대 주소를 맞출 수 있다.
    var item = new ItemClass(this.toCloneObject(isDeep));
    item.setParent(this.json.parent);

    return item;
  }

  /**
   * set json content
   *
   * @param {object} obj
   */
  reset(obj) {
    // const oldValue = this.attrs(...Object.keys(obj));

    // // 같으면 변경하지 않음
    // if (JSON.stringify(oldValue) === JSON.stringify(obj)) return false;

    // const isDiff = Object.keys(obj).some(key => {
    //   return this.json[key] !== obj[key]
    // })

    // console.log(isDiff);

    // 변경된 값에 대해서 id 를 부여해보자.
    if (!obj.__changedId) obj.__changedId = uuid();

    if (this.lastChangedField.__changedId !== obj.__changedId) {
      // if (isDiff) {
      this.json = this.convert(Object.assign(this.json, obj));
      this.lastChangedField = obj;
      this.lastChangedFieldKeys = Object.keys(obj);
      this.changed();
    }
    // 값이 변경 되었는지 어떻게 인지 할까요?
    // reset 할 때 값이 변경이 안되었을 수도 있으니
    return true;
  }

  hasChangedField(...args) {
    return args.some((it) => this.lastChangedFieldKeys.includes(it));
  }

  /**
   * define default object for item
   *
   * @param {object} obj
   */
  getDefaultObject(obj = {}) {
    var id = uuidShort();
    return {
      id,
      _timestamp: Date.now(),
      _time: window.performance.now(),
      visible: true, // 보이기 여부 설정
      lock: false, // 편집을 막고
      selected: false, // 선택 여부 체크
      layers: [], // 하위 객체를 저장한다.
      ...obj,
    };
  }

  /**
   * 지정된 필드의 값을 object 형태로 리턴한다.
   *
   * @param  {...string} args 필드 리스트
   */
  attrs(...args) {
    const result = {};

    args.forEach((field) => {
      result[field] = clone(this.json[field]);
    });

    return result;
  }

  /**
   * 자식을 가지고 있는지 체크
   *
   * @returns {boolean}
   */
  hasChildren() {
    return this.layers.length > 0;
  }

  /**
   * 자식으로 추가한다.
   *
   * @param {Item} layer
   */
  appendChild(layer) {
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
  prependChildItem(layer) {
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

  resetMatrix() {}

  refreshMatrixCache() {}

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
  insertAfter(layer) {
    const index = this.parent.findIndex(this);

    this.parent.insertChild(layer, index);
    this.project.addIndexItem(layer);
    return layer;
  }

  /**
   * 현재 Item 의 이전 순서로 추가한다.
   *
   * @param {Item} layer
   */
  insertBefore(layer) {
    const index = this.parent.findIndex(this);

    this.parent.insertChild(layer, index - 1);
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
  setPositionInPlace(position, item) {
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

  isTreeItemHide() {
    let currentParent = this.parent;
    let collapsedList = [];
    do {
      if (currentParent.is("project")) break;

      collapsedList.push(Boolean(currentParent.collapsed));
      currentParent = currentParent.parent;
    } while (currentParent);

    // 부모중에 하나라도 collapsed 가 있으면 여긴 트리에서 숨김
    return Boolean(collapsedList.filter(Boolean).length);
  }

  expectJSON(key) {
    if (key === "parent") return false;
    if (isUndefined(this.json[key])) return false;

    return true;
  }

  /**
   * convert to json
   *
   */
  toJSON() {
    const json = this.json;

    let newJSON = {};
    Object.keys(json)
      .filter((key) => this.expectJSON(key))
      .forEach((key) => {
        newJSON[key] = json[key];
      });

    return newJSON;
  }

  resize() {}

  /**
   * Item 복사하기
   *
   * @param {number} dist
   */
  copy(dist = 0) {
    return this.json.parent.copyItem(this.ref, dist);
  }

  findIndex(item) {
    return this.json.layers.indexOf(item.ref);
  }

  copyItem(childItem, dist = 10) {
    var child = childItem.clone();
    child.renameWithCount();
    child.move([dist, dist, 0]);

    var childIndex = this.findIndex(childItem);

    if (childIndex > -1) {
      this.json.layers.push(child);
      this.project.addIndexItem(child);
    }
    return child;
  }

  /**
   * 부모 객체에서 나를 지운다.
   * remove self in parent
   */
  remove() {
    this.json.parent.removeChild(this.ref);

    this.project.removeIndexItem(this.ref);
  }

  /**
   * remote child item
   *
   * @param {Item} childItem
   */
  removeChild(childItem) {
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
  hasParent(parentId) {
    var isParent = this.json.parent.id === parentId;

    if (!isParent && this.json.parent.is("project") === false)
      return this.json.parent.hasParent(parentId);

    return isParent;
  }
}
