import { isFunction } from "sapa";

const identity = () => true;

/**
 * 렌더링 객체를 관리하는 자료구조입니다.
 *
 */
export class ModelManager {
  constructor(editor) {
    this.editor = editor;
    this.context = this.editor.context;
    this.version = "0.0.0";
    this.name = "";
    this.description = "";
    this.items = new Map();
    this.projects = [];
  }

  /**
   * document 로드 하기
   */
  // eslint-disable-next-line no-unused-vars
  load(doc = undefined, context = { origin: "*" }) {
    const newDoc = doc || this.editor.loadItem("model");

    this.items.clear();
    this.version = newDoc?.version;
    this.name = newDoc?.name;
    this.description = newDoc?.description;

    newDoc?.projects?.forEach((project) => {
      this.createModel(project);
    });

    if (this.projects.length === 0) {
      this.createProject();
    }
  }

  createProject() {
    this.createModel({
      itemType: "project",
      name: "New Project",
    });
  }

  getProjectByIndex(index = 0) {
    return this.get(this.projects[index]);
  }

  get(id) {
    return this.items.get(id);
  }

  set(id, item) {
    this.items.set(id, item);
    this.setChanged("set", id, item);
  }

  // 삭제 표시
  remove(id) {
    const obj = this.items.get(id);

    const children = obj.parent.children;
    const index = children.indexOf(id);

    obj.reset({
      removed: true,
      removedIndex: index,
      removedLeftSibling: index > 0 ? children[index - 1] : null,
      removedRightSibling:
        index < children.length - 1 ? children[index + 1] : null,
    });

    this.setChanged("remove", id);
  }

  // 삭제 표시 복구
  recover(id) {
    const obj = this.items.get(id);
    const parent = this.getParent(id);

    // 오른쪽 id 가 있다면 그 전으로 위치
    if (!obj.get("removedLeftSibling") && obj.get("removedRightSibling")) {
      parent.children.splice(
        parent.children.findIndex(() => obj.get("removedRightSibling")) - 1,
        0,
        id
      );
    }
    // 왼쪽 id 가 있다면 그 뒤로 위치
    else if (obj.get("removedLeftSibling") && !obj.get("removedRightSibling")) {
      parent.children.splice(
        parent.children.findIndex(() => obj.get("removedLeftSibling")) + 1,
        0,
        id
      );
    }
    // 둘다 아니면 index 에 위치
    else {
      parent.children.splice(obj.get("removedIndex"), 0, id);
    }

    obj.removeField("removed");
    obj.removeField("removedLeftSibling");
    obj.removeField("removedRightSibling");
    obj.removeField("removedIndex");

    this.setChanged("recover", id);
  }

  clear() {
    this.items.clear();
  }

  toJSON() {
    return {
      version: this.version,
      name: this.name,
      description: this.description,
      projects: this.projects.map((id) => {
        return this.get(id).toJSON();
      }),
    };
  }

  /**
   * BaseModel 에서 reset 으로 변경된 값을 지정해준다.
   *
   * @param {string} id
   * @param {object} obj
   */
  setChanged(type, id, obj) {
    this.editor.emit("changed", type, id, obj);
  }

  /**
   * 부모에서 자식 아이템을 삭제한다.
   *
   * @param {string} rootId
   * @param {string} childId
   */
  removeChild(rootId, childId) {
    const obj = this.get(rootId);
    obj.reset({
      children: obj.children.filter((it) => it !== childId),
    });
    this.setChanged("removeChild", rootId, { childId });
  }

  // /**
  //  * 부모 아이디를 가지고 있는지 체크 한다.
  //  *
  //  * @param {string} parentId
  //  */
  // hasParent(rootId, parentId) {
  //   const obj = this.get(rootId);

  //   const isParent = obj.parentId === parentId;

  //   if (!isParent && obj.parent.is("project") === false)
  //     return this.hasParent(obj.parentId, parentId);

  //   return isParent;
  // }

  /**
   * @returns {ComponentManager}
   */
  get components() {
    return this.context.components;
  }

  searchItem(id) {
    return this.get(id);
  }

  /**
   * 하위 자식 객체 중에 id를 가진 Item 을 리턴한다.
   *
   * @param {string} id
   * @returns {Item|null} 검색된 Item 객체
   */
  searchLayers(rootId, childId) {
    const obj = this.get(rootId);
    return this.get(obj.children.find((it) => it === childId));
  }

  searchItemsById(ids) {
    return ids.map((id) => this.get(id));
  }

  // /**
  //  * searchItem 의 path 에  targetItems 가 존재하는지 찾는다.
  //  *
  //  * @param {BaseModel[]} targetItems
  //  * @param {BaseModel} searchItem
  //  */
  // hasPathOf(targetItems, searchItem) {
  //   const path = this.getPath(searchItem.id, searchItem);

  //   return targetItems
  //     .filter((it) => it.id !== searchItem.id)
  //     .some((target) => {
  //       return path.find((it) => it.id === target.id);
  //     });
  // }

  /**
   * 해당 id 를 가진 item 의 group 을 찾는다.
   * 부모가 project 일 때는 나 자신의 item 을 리턴한다.
   *
   * @param {string} rootId
   */
  findGroupItem(rootId) {
    const obj = this.get(rootId);

    if (obj.hasChildren()) {
      return obj;
    }

    // 상위가 project 나 artboard 이면 현재 객체를 최상위로 본다.
    if (
      obj.parent &&
      (obj.parent.is("project") ||
        obj.parent.is("artboard") ||
        obj.isBooleanItem)
    ) {
      return obj;
    }

    return obj.parent && this.findGroupItem(obj.parentId);
  }

  /**
   * items 를 기준으로  item 의 path 에 group 이 있는지 체크하고
   * group item 들만 리턴한다.
   * 중복은 제외한다.
   *
   * @param {BaseModel[]} items
   */
  convertGroupItems(items) {
    const objectList = {};

    items.forEach((item) => {
      // layout 안에 포함된 경우는 상위 객체를 먼저 찾는다.
      // 선택 개수가 2개 이상일 경우, 부모의 존재가 겹치면 합치고
      // 선택한 레이어가 다른 레이어의 상위에 존재할 때 하위에 선택된 레이어를 모두 제거한다.
      if (item.parent && item.isNot("project") && item.parent.hasLayout()) {
        const groupItem = item.parent;

        objectList[groupItem.id] = groupItem;
      } else {
        const groupItem = this.findGroupItem(item.id) || item;

        objectList[groupItem.id] = groupItem;
      }
    });

    return Object.values(objectList).filter((it) => it.isNot("project"));
  }

  /**
   * 삭제되지 않은 아이템들을 리턴한다.
   *
   * @param {string[]} ids
   * @returns {BaseModel[]}
   */
  searchLiveItemsById(ids) {
    return ids.map((id) => this.get(id)).filter((it) => !it.removed);
  }

  markRemove(ids = []) {
    ids.forEach((id) => {
      this.remove(id);
    });

    this.setChanged("markRemove", ids, { isLayer: true });
  }

  markRemoveProject(id) {
    const index = this.projects.findIndex((it) => it === id);

    this.projects.splice(index, 1);
    this.get(id).removed = true;

    this.setChanged("markRemoveProject", [id], { isProject: true });
    return index;
  }

  unmarkRemove(ids = []) {
    ids.forEach((id) => {
      this.recover(id);
    });

    this.setChanged("unmarkRemove", ids, { isLayer: true });
  }

  unmarkRemoveProject(id, index) {
    this.projects.splice(index, 0, id);
    this.get(id).removed = false;

    this.setChanged("unmarkRemoveProject", [id], {
      removed: true,
      isProject: true,
    });
  }

  /**
   * itemObject (객체)를 가지고 itemType 에 따른  실제 Component 객체를 생성해준다.
   *
   * @param {object} itemObject
   * @returns {Item}
   */
  createModel(itemObject, isRegister = true, context = { origin: "*" }) {
    const layers = itemObject.layers;
    delete itemObject.layers;
    let item;

    if (this.get(itemObject.id)) {
      item = this.get(itemObject.id);
      item.reset(itemObject);
    } else {
      item = this.components.createComponent(itemObject.itemType, {
        ...itemObject,
      });

      item.setModelManager(this);
    }

    // Item 을 생성하면  아이템의 id 를 등록한다.
    // 등록된 item 은 다른 곳으로 전송될 수 있다.
    if (isRegister) {
      this.set(item.id, item);

      if (item.is("project")) {
        this.projects = [...new Set([...this.projects, item.id])];
      }
    }

    const children = (layers || []).map((it) => {
      return this.createModel({ ...it, parentId: item.id }, true, context);
    });

    // 하위 아이템들은 생성된 이후에 id 문자열 리스트로만 관리된다.

    if (children.length) {
      item.reset(
        {
          children: children.map((it) => {
            return it.id;
          }),
        },
        context
      );
    }

    return item;
  }

  getAllLayers(rootId, filterCallback = identity) {
    var results = [];
    const obj = this.get(rootId);

    let len = obj.children.length;
    for (let start = len; start--; ) {
      let id = obj.children[start];
      results.push(...this.getAllLayers(id, filterCallback));
    }

    if (isFunction(filterCallback) && filterCallback(obj)) {
      results.push(obj);
    }

    return results;
  }

  getLayers(rootId) {
    const obj = this.get(rootId);

    return obj?.children?.map((childId) => this.get(childId)) || [];
  }

  eachLayers(rootId, callback) {
    const obj = this.get(rootId);

    let len = obj.children.length;
    for (let start = len; start--; ) {
      let id = obj.children[start];
      callback(this.get(id));
    }
  }

  mapLayers(rootId, callback) {
    const obj = this.get(rootId);

    return obj.children.map((childId) => {
      return callback(this.get(childId));
    });
  }

  /**
   *
   * @param {string} rootId
   * @returns {BaseModel} 부모 Model 리턴
   */
  getParent(rootId) {
    return this.get(this.get(rootId)?.parentId);
  }

  /**
   * depth 정의
   */
  getDepth(rootId) {
    const parent = this.getParent(rootId);
    if (!parent) return 1;

    return this.getDepth(parent.id) + 1;
  }

  // /**
  //  * 최상위 부모 찾기
  //  *
  //  */
  // getRoot(rootId) {
  //   const obj = this.get(rootId);
  //   const parent = this.getParent(rootId);
  //   if (!parent) return obj;

  //   let localParent = parent;
  //   do {
  //     const nextParent = this.getParent(localParent.id);

  //     if (!nextParent) {
  //       return localParent;
  //     }

  //     localParent = nextParent;
  //   } while (localParent);
  // }

  /**
   * 상속 구조 안에서 instance 리스트
   *
   * @returns {Item[]}
   */

  getPath(rootId, defaultRef = null) {
    const obj = this.get(rootId) || defaultRef;
    const parent = this.getParent(rootId);
    if (!parent) return [obj];

    const list = this.getPath(parent.id);

    list.push(obj);

    return list;
  }

  // /**
  //  * path 안에서 itemType 에 맞는  item 을 찾는다.
  //  *
  //  * @param {string} rootId
  //  * @param {string} itemType
  //  * @returns {BaseModel}
  //  */
  // getModelTypeInPath(rootId, itemType) {
  //   return this.getPath(rootId).find((it) => it && it.is(itemType));
  // }

  // /**
  //  * rootId 기준으로 path 를 구하고
  //  * path 에 targetId 가 존재하는지 체크하고
  //  * item 을 리턴한다.
  //  *
  //  * @param {string} rootId
  //  * @param {string} targetId
  //  * @returns {BaseModel}
  //  */
  // getItemInPath(rootId, targetId) {
  //   return this.getPath(rootId).find((it) => it && it.id === targetId);
  // }

  // getProject(rootId) {
  //   return this.getModelTypeInPath(rootId, "project");
  // }

  // getArtBoard(rootId) {
  //   return this.getModelTypeInPath(rootId, "artboard");
  // }

  // is(rootId, checkItemType) {
  //   const obj = this.get(rootId);
  //   return checkItemType === obj.itemType;
  // }

  // isNot(rootId, checkItemType) {
  //   return this.is(rootId, checkItemType) === false;
  // }

  // /**
  //  * 지정된 필드의 값을 object 형태로 리턴한다.
  //  *
  //  * @param {string} rootId
  //  * @param  {...string} args 필드 리스트
  //  */
  // attrs(rootId, ...args) {
  //   const obj = this.get(rootId);
  //   const result = {};

  //   args.forEach((field) => {
  //     result[field] = clone(obj[field]);
  //   });

  //   return result;
  // }

  // hasChildren(rootId) {
  //   return this.get(rootId)?.children.length > 0;
  // }

  /**
   * clone Item
   */
  clone(rootId, isDeep = true) {
    const obj = this.get(rootId);
    const json = obj.toCloneObject(isDeep);

    const item = this.createModel(json);
    item.setParentId(obj.parentId);

    return item;
  }

  // reset(rootId, obj) {
  //   return this.get(rootId)?.reset(obj);
  // }
}
