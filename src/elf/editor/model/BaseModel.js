import { clone, isNotUndefined, isNumber, isUndefined } from "sapa";

import { uuid } from "elf/core/math";

/**
 * Item , 그리기를 위한 기본 모델
 * 유니크한 아이디를 가진다.
 * 참조는 모드 id 로 관리하고 해당 id 는 ModelManager 객체에서 참조한다.
 *
 * @class
 */
export class BaseModel {
  #modelManager = null;
  #json = {};
  #cachedValue = {};
  #timestamp = 0;
  #lastChangedField = {};
  #collapsed = false;

  /**
   * 모델 생성자
   *
   * @param {object} json 초기화 할 데이타
   * @param {ModelManager} modelManager
   */
  constructor(json = {}, modelManager) {
    this.setModelManager(modelManager);
    this.initializeModel(json);
  }

  initializeModel(json) {
    this.#json = this.convert(Object.assign(this.getDefaultObject(), json));
  }

  get manager() {
    return this.#modelManager;
  }

  setModelManager(modelManager) {
    this.#modelManager = modelManager;
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

  isChanged(timestamp) {
    console.log("isChanged", timestamp);
    return this.timestamp != Number(timestamp);
  }

  changed() {
    this.#timestamp += Date.now();
  }

  /***********************************
   *
   * getter
   *
   **********************************/

  get timestamp() {
    return this.#timestamp;
  }

  /**
   * title 속성
   */
  get title() {
    return this.name || this.getDefaultTitle();
  }

  get itemType() {
    return this.get("itemType");
  }

  get name() {
    return this.get("name");
  }

  get children() {
    return this.get("children");
  }

  get collapsed() {
    return this.#collapsed;
  }

  set collapsed(value) {
    this.#collapsed = value;
  }

  get visibility() {
    return this.get("visibility");
  }

  set visibility(value) {
    this.set("visibility", value);
  }

  renameWithCount() {
    let arr = this.#json.name.split(" ");

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
    return this.manager.getAllLayers(this.id);
  }

  /**
   * 자식 객체 리스트
   *
   * @returns {Item[]}
   */
  get layers() {
    return this.manager.getLayers(this.id) || [];
  }

  /**
   * filterCallback 으로 필터링된 layer 리스트를 가지고 온다.
   *
   * @returns {Item[]}
   */
  filteredAllLayers(filterCallback) {
    return this.manager.getAllLayers(this.id, filterCallback);
  }

  /**
   * get id
   */
  get id() {
    return this.#json.id;
  }

  /**
   *
   */
  get parentId() {
    // parentId 가 나와 같으면 순환 참조가 되버리기 때문에
    // 이런 경우 무조건 없는걸로 간주한다.
    const parentId = this.#json.parentId;
    if (parentId === this.id) return undefined;

    return parentId;
  }

  /**
   * @returns {Item}
   */
  get parent() {
    if (!this.parentId) return undefined;

    return this.manager.get(this.parentId);
  }

  /**
   * 객체 깊이를 동적으로 계산
   *
   * @returns {number}
   */
  get depth() {
    return this.path.length;
  }

  /**
   * 최상위 컴포넌트 찾기
   *
   * @returns {Item}
   */
  get top() {
    return this.path.filter((it) => it.isNot("project")).shift();
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
    const path = [this];
    let parent;

    while ((parent = path[0].parent)) {
      path.unshift(parent);
    }

    return path;
  }

  get pathIds() {
    return this.path.map((it) => it.id);
  }

  setParentId(parentId) {
    this.reset({ parentId });

    this.manager.setChanged("setParentId", this.id, { parentId });
  }

  get childrenLength() {
    return this.#json.children.length;
  }

  get index() {
    return this.parent?.findIndex(this);
  }

  get isFirst() {
    return this.index === 0;
  }

  get isLast() {
    return this.index === this.parent.childrenLength - 1;
  }

  get first() {
    return this.parent.layers[0];
  }

  get last() {
    const parent = this.parent;
    return parent.layers[parent.childrenLength - 1];
  }

  get prev() {
    const index = this.index;
    if (this.isFirst) {
      return this;
    }

    return this.parent?.layers[index - 1];
  }

  get next() {
    const index = this.index;
    if (this.isLast) {
      return this;
    }

    return this.parent?.layers[index + 1];
  }

  /**
   * x, y, angle 을 기본적으로 포함한 부모와의 관계 데이타를 리턴한다.
   */
  get hierarchy() {
    return this.getInformationForHierarchy("x", "y", "angle");
  }

  /**
   * 부모,자식,형제 노드의 순서를 정리한다.
   *
   * @param {string[]} args field list
   * @returns
   */
  getInformationForHierarchy(...args) {
    const parent = this.parent;
    const index = this.index;
    return {
      id: this.id,
      index: index,
      parentId: this.parentId,
      prev: index === 0 ? undefined : parent.children[index - 1],
      next:
        index === parent.childrenLength - 1
          ? undefined
          : parent.children[index + 1],
      attrs: this.attrs(...args),
    };
  }

  /**
   * id 기반 문자열 id 생성
   *
   * @param {string} postfix
   */
  getInnerId(postfix = "") {
    return this.#json.id + postfix;
  }

  is(checkItemType) {
    return this.#json.itemType === checkItemType;
  }

  isNot(checkItemType) {
    return this.is(checkItemType) === false;
  }

  /**
   * key  에 맞는 속성값을 리턴합니다.
   *
   * @param {string} key
   * @returns
   */
  get(key) {
    return this.#json[key];
  }

  /**
   * 저장된 필드 값을 지움
   *
   * @param {string} key
   */
  removeField(key) {
    delete this.#json[key];
  }

  /**
   * key 에 대한 값을 설정한다.
   *
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    this.reset({ [key]: value });
  }

  isSVG() {
    return false;
  }

  addCache(key, value) {
    this.#cachedValue[key] = value;
  }

  getCache(key) {
    return this.#cachedValue[key];
  }

  hasCache(key) {
    return Boolean(this.#cachedValue[key]);
  }

  /**
   * BaseModel 에서 attribute key 를 기반으로 캐쉬를 적용한다.
   * 렌더링 시에 캐쉬를 적용하지 않으면 렌더링이 느려지기 때문에
   * 각 객체마다 캐쉬를 적용하는 것이 좋다.
   *
   * @param {string} key attirbute field name
   * @param {Function} newValueCallback cache 에 적용할 값을 구하는 함수
   * @returns {any}
   */
  computed(key, newValueCallback, isForce = false) {
    const cachedKey = `__cachedKey_${key}`;
    const parsedKey = `${cachedKey}__parseValue`;
    const value = this.#json[key];

    // 캐쉬가 있으면 그대로 리턴
    if (isForce) {
      // NOOP
      // isForce 가 true 일 때는 캐쉬를 적용하지 않는다.
    } else {
      if (this.getCache(cachedKey) === value && this.getCache(parsedKey)) {
        return this.getCache(parsedKey);
      }
    }

    // isForce 가 true 이면 다시 캐쉬를 만든다.
    this.addCache(cachedKey, value);
    this.addCache(parsedKey, newValueCallback(value, this));

    return this.getCache(parsedKey);
  }

  computedValue(key) {
    const cachedKey = `__cachedKey_${key}`;
    const parsedKey = `${cachedKey}__parseValue`;

    return this.getCache(parsedKey);
  }

  /**
   * check editable property
   *
   *
   * @param {string} editableProperty
   * @returns {boolean}
   */
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
  convert(json = {}) {
    return json;
  }

  /**
   * cache hook
   */
  setCache() {}

  /**
   * 자식 정보를 포함한 객체 clone 정보를  생성
   *
   * json 을 카피함
   *
   * @param {boolean} isDeep
   * @returns
   */
  toCloneObject(isDeep = true) {
    const json = {};

    Object.keys(this.#json).forEach((field) => {
      if (isNotUndefined(this.get(field))) {
        json[field] = clone(this.get(field));
      }
    });

    if (isDeep) {
      json.layers = this.layers.map((layer) => {
        return layer.clone(isDeep);
      });
    }

    return json;
  }

  /**
   * clone Item
   */
  clone(isDeep = true) {
    return this.#modelManager.clone(this.id, isDeep);
  }

  /**
   * set json content
   *
   * @param {object} obj
   * @param {{origin: string}} context
   */
  reset(obj, context = { origin: "*" }) {
    // const isChanged = this.isChangedValue(obj);

    // if (isChanged) {
    this.#json = this.convert(Object.assign(this.#json, obj));

    this.#lastChangedField = obj;

    if (context.origin === "*") {
      this.#modelManager?.setChanged("reset", this.id, obj);
    }

    this.changed();
    // }

    return true;
  }

  /**
   * 마지막 변경된 field 를 체크한다.
   *
   * @param {string[]} [args=[]]
   * @returns {boolean}
   */
  hasChangedField(...args) {
    return args.some((it) => this.#lastChangedField[it] !== undefined);
  }

  /**
   * 계층 구조가 변경이 되었는지 체크 한다.
   */
  get hasChangedHirachy() {
    return this.hasChangedField("children", "parentId");
  }

  /**
   * define default object for item
   *
   * @param {object} obj
   */
  getDefaultObject(obj = {}) {
    var id = obj.id || uuid();
    return {
      id,
      name: "",
      itemType: "base",
      children: [], // 하위 객체를 저장한다.
      parentId: "", // 부모 객체의 id
      visibility: "visible",
      ...obj,
    };
  }

  /**
   * 지정된 필드의 값을 object 형태로 리턴한다.
   *
   * @param  {string[]} args 필드 리스트
   */
  attrs(...args) {
    const result = {};

    args.forEach((field) => {
      if (isNotUndefined(this.get(field))) {
        result[field] = clone(this.get(field));
      }
    });

    return result;
  }

  /**
   * id를 키로 가지는 객체를 생성한다.
   *
   * @param  {string[]} args
   * @returns
   */
  attrsWithId(...args) {
    return {
      [this.id]: this.attrs(...args),
    };
  }

  /**
   * 자식을 가지고 있는지 체크
   *
   * @returns {boolean}
   */
  hasChildren() {
    return this.children.length > 0;
  }

  /**
   * 자식으로 추가한다.
   *
   * @param {BaseModel} layer  childItem 이 될 객체
   */
  appendChild(layer) {
    if (layer.parentId === this.id) {
      const hasId = this.children.find((it) => it === layer.id);
      if (Boolean(hasId) === false) {
        // 아이디가 없는 경우 다시 아이디 넣어주기
        this.children.push(layer.id);
        this.#modelManager.setChanged("appendChild", this.id, {
          child: layer.id,
          oldParentId: layer.parentId,
        });
      }

      return layer;
    }

    this.resetMatrix(layer);

    // 객체를 추가할 때는  layer 의 절대 값을 기준으로 객체를 움직인다.
    if (layer.parent) {
      layer.remove();
    }

    layer.setParentId(this.id);

    this.children.push(layer.id);

    return layer;
  }

  /**
   * matrix 재조정
   *
   * @override
   */
  resetMatrix() {}

  /**
   * matrix 캐쉬 재조정
   *
   * @override
   */
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
    if (layer.parent && layer.parent?.id !== this.id) {
      layer.remove();
    }

    layer.setParentId(this.id);
    let list = this.children.map((id, childIndex) => {
      return { id, index: childIndex };
    });

    // child 리스트 중에 layer.id 와 같은 값이 있는지 체크
    const childItem = list.find((it) => it.id === layer.id);
    const targetIndex = index - 0.5;

    // 이미 있는 경우
    if (childItem) {
      childItem.index = targetIndex;
    } else {
      // 없는 경우
      list.push({ id: layer.id, index: targetIndex });
    }

    list.sort((a, b) => {
      return a.index - b.index;
    });

    this.reset({
      children: list.map((it) => it.id),
    });
    this.#modelManager.setChanged("insertChild", this.id, {
      childId: layer.id,
      index: 0,
    });
    return layer;
  }

  /**
   * 현재 Item 의 그 다음 순서로 추가한다.
   *
   * @param {Item} layer
   */
  insertAfter(layer) {
    this.parent.insertChild(layer, this.index + 1);

    return layer;
  }

  /**
   * 현재 Item 의 이전 순서로 추가한다.
   *
   * @param {Item} layer
   */
  insertBefore(layer) {
    this.parent.insertChild(layer, this.index);

    return layer;
  }

  /**
   * toggle item's attribute
   *
   * @param {string} field
   * @param {undefined|boolean} toggleValue
   */
  toggle(field, toggleValue) {
    if (isUndefined(toggleValue)) {
      this.reset({
        [field]: !this.get(field),
      });
    } else {
      this.reset({
        [field]: !!toggleValue,
      });
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
    if (isUndefined(this.get(key))) return false;

    return true;
  }

  /**
   * convert to json
   *
   */
  toJSON() {
    const json = this.#json;

    let newJSON = {};
    Object.keys(json)
      .filter((key) => this.expectJSON(key))
      .forEach((key) => {
        newJSON[key] = json[key];
      });

    if (this.hasChildren()) {
      newJSON.layers = this.layers.map((layer) => {
        return layer.toJSON();
      });
    }

    return newJSON;
  }

  resize() {}

  /**
   * Item 복사하기
   *
   * @param {number} dist
   */
  copy(dist = 0) {
    return this.parent.copyItem(this.id, dist);
  }

  /**
   * 부모 기준으로 자식의 index 를 찾음
   *
   * @param {BaseModel} child
   * @returns
   */
  findIndex(child) {
    return this.children.indexOf(child.id);
  }

  /**
   * find a model by id
   *
   * @param {string} id
   * @returns {BaseModel}
   */
  find(id) {
    return this.#modelManager.get(id);
  }

  copyItem(childItemId, dist = 10) {
    const childItem = this.find(childItemId);
    var child = childItem.clone();

    child.renameWithCount();
    child.absoluteMove([dist, dist, 0]);

    var childIndex = this.findIndex(childItem);

    if (childIndex > -1) {
      this.children.push(child.id);
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
    return this.#modelManager.removeChild(this.id, childItemId);
  }

  /**
   * 부모 아이디를 가지고 있는지 체크 한다.
   *
   * @param {string} findParentId
   */
  hasParent(findParentId) {
    return this.parentId === findParentId;
  }

  /**
   * path 에  targetItems 가 존재하는지 찾는다.
   *
   * @param {BaseModel[]} targetItems
   */
  hasPathOf(targetItems = []) {
    const path = this.path;

    return targetItems
      .filter((it) => it.id !== this.id)
      .some((target) => {
        return path.find((it) => it.id === target.id);
      });
  }

  /**
   * 자식 아이디를 가지고 있는지 체크
   *
   * @param {string} childId
   * @returns {boolean}
   */
  hasChild(childId) {
    return this.children.includes(childId);
  }

  /**
   * 특정 itemType 으로 데이타 변환
   *
   * @param {string} itemType
   */
  to() {}

  /**
   * 뒤로 보내기
   *
   * 계층 구조에서는 위로 보내기
   */
  sendBackward(targetId) {
    const siblings = this.children;

    const result = {};
    let selectedIndex = -1;
    siblings.forEach((id, index) => {
      result[id] = { id, index };

      if (id === targetId) {
        selectedIndex = index;
      }
    });

    // prev === 1
    // prev .prev === 1.5
    result[targetId].index = selectedIndex - 1.5;

    const children = Object.values(result)
      .sort((a, b) => a.index - b.index)
      .map((it) => it.id);

    this.reset({
      children,
    });
  }

  sendBack(targetId) {
    const siblings = this.children;

    const result = {};
    siblings.forEach((id, index) => {
      result[id] = { id, index };
    });

    // first prev
    result[targetId].index = -1;

    const children = Object.values(result)
      .sort((a, b) => a.index - b.index)
      .map((it) => it.id);

    this.reset({
      children,
    });
  }

  /**
   * 앞으로 가지고 오기
   *
   * 계층 구조 에서는 밑으로 보내기
   */
  bringForward(targetId) {
    const siblings = this.children;

    const result = {};
    let selectedIndex = -1;
    siblings.forEach((id, index) => {
      result[id] = { id, index };

      if (id === targetId) {
        selectedIndex = index;
      }
    });

    // next === 1
    // next .next === 1.5
    result[targetId].index = selectedIndex + 1.5;

    const children = Object.values(result)
      .sort((a, b) => a.index - b.index)
      .map((it) => it.id);

    this.reset({
      children,
    });
  }

  bringFront(targetId) {
    const siblings = this.children;

    const result = {};
    // let selectedIndex = -1;
    siblings.forEach((id, index) => {
      result[id] = { id, index };

      // if (id === targetId) {
      //   selectedIndex = index;
      // }
    });

    // last next
    result[targetId].index = Number.MAX_SAFE_INTEGER;

    const children = Object.values(result)
      .sort((a, b) => a.index - b.index)
      .map((it) => it.id);

    this.reset({
      children,
    });
  }
}
