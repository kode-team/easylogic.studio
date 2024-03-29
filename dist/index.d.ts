declare module "@easylogic/editor" {
  // gl-matrix
  // prettier-ignore
  export type mat2 =
        | [number, number,
            number, number]
        | Float32Array;

  // prettier-ignore
  export type mat2d =
        | [number, number,
            number, number,
            number, number]
        | Float32Array;

  // prettier-ignore
  export type mat3 =
        | [number, number, number,
            number, number, number,
            number, number, number]
        | Float32Array;

  // prettier-ignore
  export type mat4 =
        | [number, number, number, number,
            number, number, number, number,
            number, number, number, number,
            number, number, number, number]
        | Float32Array;

  export type quat = [number, number, number, number] | Float32Array;

  // prettier-ignore
  export type quat2 =
        | [number, number, number, number,
            number, number, number, number]
        | Float32Array;

  export type vec2 = [number, number] | Float32Array;
  export type vec3 = [number, number, number] | Float32Array;
  export type vec4 = [number, number, number, number] | Float32Array;

  // prettier-ignore
  export type ReadonlyMat2 =
        | readonly [
            number, number,
            number, number
        ]
        | Float32Array;

  // prettier-ignore
  export type ReadonlyMat2d =
        | readonly [
            number, number,
            number, number,
            number, number
        ]
        | Float32Array;

  // prettier-ignore
  export type ReadonlyMat3 =
        | readonly [
            number, number, number,
            number, number, number,
            number, number, number
        ]
        | Float32Array;

  // prettier-ignore
  export type ReadonlyMat4 =
        | readonly [
            number, number, number, number,
            number, number, number, number,
            number, number, number, number,
            number, number, number, number
        ]
        | Float32Array;

  export type ReadonlyQuat =
    | readonly [number, number, number, number]
    | Float32Array;

  export type ReadonlyQuat2 =
    | readonly [number, number, number, number, number, number, number, number]
    | Float32Array;

  export type ReadonlyVec2 = readonly [number, number] | Float32Array;
  export type ReadonlyVec3 = readonly [number, number, number] | Float32Array;
  export type ReadonlyVec4 =
    | readonly [number, number, number, number]
    | Float32Array;

  // gl-matrix

  export function makeEventChecker(value: string, split: string): string;

  // event name regular expression
  export type EVENT = (...args: string[]) => string;
  export const COMMAND: EVENT;
  export const ON:  EVENT;

  // Predefined CHECKER
  export type CHECKER = (value: string, split: string) => string;
  export type AFTER = (value: string, split: string) => string;
  export type BEFORE = (value: string, split: string) => string;

  export const IF: CHECKER;
  export const KEY: CHECKER;

  export const ARROW_UP: string;
  export const ARROW_DOWN: string;
  export const ARROW_LEFT: string;
  export const ARROW_RIGHT: string;
  export const ENTER: string;
  export const SPACE: string;
  export const ESCAPE: string;

  export const ALT: string;
  export const SHIFT: string;
  export const META: string;
  export const CONTROL: string;
  export const SELF: string;
  export const LEFT_BUTTON: string;

  export const FIT: string;
  export const PASSIVE: string;

  /**
   * LOAD 함수에서 domdiff 를 수행하는 플래그를 설정한다.
   */
  export const DOMDIFF: string;

  // event config method
  export type TimeFunction = (time: number) => string;

  export const DEBOUNCE: TimeFunction;
  export const DELAY: TimeFunction;
  export const D1000: string;

  export const THROTTLE: TimeFunction;
  export const CAPTURE: string;

  // event config method

  // before method

  // after method
  type MoveMethod = (method: string) => string;
  export const MOVE: MoveMethod;

  type MoveEndMethod = (method: string) => string;
  export const END: MoveEndMethod;

  export const PREVENT: string;
  export const STOP: string;

  type CallbackFunction = (...args: string[]) => string;
  type DOM_EVENT_MAKE = (...keys: string[]) => CallbackFunction;

  export const SUBSCRIBE: CallbackFunction;
  export const SUBSCRIBE_ALL: CallbackFunction;
  export const CUSTOM: DOM_EVENT_MAKE;
  export const CLICK: CallbackFunction;
  export const DOUBLECLICK: CallbackFunction;
  export const MOUSEDOWN: CallbackFunction;
  export const MOUSEUP: CallbackFunction;
  export const MOUSEMOVE: CallbackFunction;
  export const MOUSEOVER: CallbackFunction;
  export const MOUSEOUT: CallbackFunction;
  export const MOUSEENTER: CallbackFunction;
  export const MOUSELEAVE: CallbackFunction;
  export const TOUCHSTART: CallbackFunction;
  export const TOUCHMOVE: CallbackFunction;
  export const TOUCHEND: CallbackFunction;
  export const KEYDOWN: CallbackFunction;
  export const KEYUP: CallbackFunction;
  export const KEYPRESS: CallbackFunction;
  export const DRAG: CallbackFunction;
  export const DRAGSTART: CallbackFunction;
  export const DROP: CallbackFunction;
  export const DRAGOVER: CallbackFunction;
  export const DRAGENTER: CallbackFunction;
  export const DRAGLEAVE: CallbackFunction;
  export const DRAGEXIT: CallbackFunction;
  export const DRAGOUT: CallbackFunction;
  export const DRAGEND: CallbackFunction;
  export const CONTEXTMENU: CallbackFunction;
  export const CHANGE: CallbackFunction;
  export const INPUT: CallbackFunction;
  export const FOCUS: CallbackFunction;
  export const FOCUSIN: CallbackFunction;
  export const FOCUSOUT: CallbackFunction;
  export const BLUR: CallbackFunction;
  export const PASTE: CallbackFunction;
  export const RESIZE: CallbackFunction;
  export const SCROLL: CallbackFunction;
  export const SUBMIT: CallbackFunction;

  // pointerstart 의 경우 drag 를 위한 시작점이기 때문에  left button 만 허용한다.
  // context 메뉴나 wheel 은 허용하지 않는다.
  export const POINTERSTART: CallbackFunction;
  //

  export const POINTEROVER: CallbackFunction;
  export const POINTERENTER: CallbackFunction;
  export const POINTEROUT: CallbackFunction;
  export const POINTERMOVE: CallbackFunction;
  export const POINTEREND: CallbackFunction;
  export const CHANGEINPUT: CallbackFunction;
  export const WHEEL: CallbackFunction;
  export const ANIMATIONSTART: CallbackFunction;
  export const ANIMATIONEND: CallbackFunction;
  export const ANIMATIONITERATION: CallbackFunction;
  export const TRANSITIONSTART: CallbackFunction;
  export const TRANSITIONEND: CallbackFunction;
  export const TRANSITIONRUN: CallbackFunction;
  export const TRANSITIONCANCEL: CallbackFunction;
  export const DOUBLETAB: CallbackFunction;

  // Predefined LOADER

  /**
   * 특정 영역의 html 을 만들기 위한 함수
   *
   * @param [refName=$el] 업데이트 되기 위한 refName
   * @returns {string}
   */
  export function LOAD(refName: string): string;
  export function createRef(value: any): string;
  export function getRef(id: string): any;
  export function BIND(
    value: string,
    checkFieldOrCallback: string
  ): string;

  export interface KeyValue {
    [key: string]: any;
  }

  export interface ElementValue<T> {
    [key: string]: T;
  }

  interface IComponentParams extends KeyValue {}

  export class Length {
    unit: string;
    value: number;
  }

  export class Dom {
    el: HTMLElement;

    static create(
      tag: string | HTMLElement | Dom | DocumentFragment,
      className: string,
      attr: KeyValue
    ): Dom;
    static createByHTML(htmlString: string): Dom | null;
    static body(): Dom;

    find(selector: string): HTMLElement;
    $(selector: string): Dom | null;

    findAll(selector: string): HTMLElement[];
    $$(selector: string): Dom[];

    replaceChild(
      oldElement: Dom | HTMLElement,
      newElement: Dom | HTMLElement
    ): Dom;

    checked(isChecked: boolean): Dom | boolean;
    click(): Dom;
    focus(): Dom;
    select(): Dom;
    blur(): Dom;

    /* utility */
    fullscreen(): void;
    toggleFullscreen(): void;
  }

  export class BaseStore {}

  export class Item {
    getDefaultTitle(): string;
    getIcon(): string;
    isAttribute(): boolean;
    isChanged(timestamp: number): boolean;
    changed():void;

    /**
     * title 속성
     */
    get title(): string;

    /**
     *
     * @returns 자신을 포함안 하위 모든 자식을 조회
     */
    get allLayers(): Item[];

    /**
     * get id
     */
    get id(): string;

    /**
     * 자식 객체 리스트
     *
     * @returns {Item[]}
     */
    get layers(): Item[];

    /**
     * @returns {Item}
     */
    get parent(): Item;

    setParent: (otherParent: Item) => void;

    /**
     * 객체 깊이를 동적으로 계산
     *
     * @returns {number}
     */
    get depth(): number;

    /**
     * 최상위 컴포넌트 찾기
     *
     * @returns {Item}
     */
    get top(): Item;

    /**
     * 최상위 project 구하기
     *
     * @returns {Project}
     */
    get project(): Item;

    /**
     * 최상위 artboard 구하기
     *
     * @returns {ArtBoard}
     */
    get artboard(): Item;

    /**
     * 상속 구조 안에서 instance 리스트
     *
     * @returns {Item[]}
     */
    get path(): Item[];

    /**
     * 부모의 자식들 중 나의 위치 찾기
     *
     * @returns {number}  나이 위치 index
     */
    get positionInParent(): number;

    /**
     * id 기반 문자열 id 생성
     *
     * @param {string} postfix
     */
    getInnerId: (postfix: string) => string;

    // selection 이후에
    // 위치나 , width, height 등의 geometry 가 변경되었을 때 호출 하는 함수
    recover: () => void;

    setCache: () => void;

    is(checkItemType: string): boolean;

    isNot(checkItemType: string): boolean;

    isSVG(): boolean;

    /***********************************
     *
     * action
     *
     **********************************/

    // 내부 아이템 리스트 설정
    generateListNumber(): void;

    /**
     * when json is loaded, json object is be a new instance
     *
     * @param {*} json
     */
    convert(json: KeyValue): KeyValue;

    /**
     * defence to set invalid key-value
     */
    checkField(key: string, value: any): boolean;

    toCloneObject(isDeep: boolean): KeyValue;

    /**
     * clone Item
     */
    clone(isDeep: boolean): Item;

    /**
     * set json content
     *
     * @param {object} obj
     */
    reset(obj: KeyValue): void;

    hasChangedField(...args: string[]): boolean;

    /**
     * define default object for item
     *
     * @param {object} obj
     */
    getDefaultObject(obj: KeyValue): KeyValue;

    /**
     * 지정된 필드의 값을 object 형태로 리턴한다.
     *
     * @param  {...string} args 필드 리스트
     */
    attrs(...args: string[]): any[];

    /**
     * 자식을 가지고 있는지 체크
     *
     * @returns {boolean}
     */
    hasChildren(): boolean;

    /**
     * 자식으로 추가한다.
     *
     * @param {Item} layer
     */
    appendChildItem(layer: Item): Item;

    /**
     * 자식중에 맨앞에 추가한다.
     *
     * @param {Item} layer
     */
    prependChildItem(layer: Item): Item;

    resetMatrix(item: Item): void;
    /**
     * 특정 index 에 자식을 추가한다.
     *
     * @param {Item} layer
     * @param {number} index
     */
    insertChildItem(layer: Item, index: number): Item;

    /**
     * 현재 Item 의 그 다음 순서로 추가한다.
     *
     * @param {Item} layer
     */
    insertAfter(layer: Item): Item;

    /**
     * 현재 Item 의 이전 순서로 추가한다.
     *
     * @param {Item} layer
     */
    insertBefore(layer: Item): Item;

    /**
     * 특정한 위치에 자식 객체로 Item 을 추가 한다.
     * set position in layers
     *
     * @param {Number} position
     * @param {Item} item
     */
    setPositionInPlace(position: number, item: Item): void;

    /**
     * toggle item's attribute
     *
     * @param {*} field
     * @param {*} toggleValue
     */
    toggle(field: string, toggleValue: boolean | undefined): void;

    isTreeItemHide(): boolean;

    expectJSON(key: string): boolean;

    /**
     * convert to json
     *
     */
    toJSON(): KeyValue;

    resize(): void;

    /**
     * Item 복사하기
     *
     * @param {number} dist
     */
    copy(dist: number): Item;
    findIndex(item: Item): number;

    copyItem(childItem: Item, dist: number): Item;

    /**
     * 부모 객체에서 나를 지운다.
     * remove self in parent
     */
    remove(): void;

    /**
     * remote child item
     *
     * @param {Item} childItem
     */
    removeItem(childItem: Item): void;

    /**
     * 부모 아이디를 가지고 있는지 체크 한다.
     *
     * @param {string} parentId
     */
    hasParent(parentId: string): boolean;

    /**
     * 하위 자식 객체 중에 id를 가진 Item 을 리턴한다.
     *
     * @param {string} id
     * @returns {Item|null} 검색된 Item 객체
     */
    searchById(id: string): Item | null;
  }

  interface IKeyMat4Value {
    [key: string]: mat4;
  }

  interface ICachedMatrix {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    transform: string;
    originalTransformOrigin: string;
    /**
     * 변환되는 모든 vertext 를 기록
     */
    verties: vec3[];
    /**
     * 회전되는 vertext 를 제외한 모든 vertext
     * 회전 방식이 바뀌면 삭제 될 수 있음.
     */
    rectVerties: vec3[];
    xList: number[];
    yList: number[];
    directionMatrix: IKeyMat4Value;
    parentMatrix: mat4;
    parentMatrixInverse: mat4;
    localMatrix: mat4; // 자기 자신의 matrix with translate offset(x,y)
    localMatrixInverse: mat4;
    itemMatrix: mat4; // 자기 자신의 matrix without translate offset(x,y)
    itemMatrixInverse: mat4;
    absoluteMatrix: mat4; // parentMatrix * offset translate * localMatrix , 축적된 matrix
    absoluteMatrixInverse: mat4;
  }

  interface PathParser {}

  interface ModelManager {}
  export class BaseModel {
    get manager(): ModelManager;
    get timestamp(): number;
    get id(): string;
    get name(): string;
    get itemType(): string;
    get title(): string;
    get children(): BaseModel[];
    get parent(): BaseModel;
    get parentId(): string;
    get collapsed(): boolean;
    get visibility(): boolean;
    get locked(): boolean;
    get allLayers(): BaseModel[];
    get layers(): BaseModel[];
    get depth(): number;
    get top(): BaseModel;
    get artboard(): ArtBoard;
    get project(): BaseModel;
    get path(): BaseModel[];
    get pathIds(): string[];
    get childrenLength(): number;
    get index(): number;
    get isFirst(): boolean;
    get isLast(): boolean;
    get first(): BaseModel;
    get last(): BaseModel;
    get prev(): BaseModel;
    get next(): BaseModel;
    get hierarchy(): Hierarchy;
    get hasChangedHirachy(): boolean;    
    getInformationForHierarchy(): Hierarchy;
    filterAllLayers(filter: (layer: BaseModel) => boolean): BaseModel[];
    setParentId(parentId: string):void;
    getInnerId(postfix?: string):string;
    is(checkItemType: string): boolean;
    isNot(checkItemType: string): boolean;
    get(key: string): any;
    removeField(key: string): void;
    set(key: string, value: any): void;
    isSVG(): boolean;
    addCache(key: string, value: any): void;
    getCache(key: string): any;
    removeCache(key: string): void;
    hasCache(key: string): boolean;
    computed(key: string, newValueCallback: Function, isForce?: boolean): any;
    computedValue(key: string): any;
    editable(): boolean;
    convert(json?: KeyValue): KeyValue;
    setCache(): void;
    toCloneObject(isDeep?: boolean): KeyValue;
    clone(isDeep?: boolean): boolean;
    reset(obj: KeyValue, context?: IContext): boolean;
    hasChangedField(...args: any[]): boolean;
    getDefaultObject(obj?: KeyValue): KeyValue;
    attrs(...args: string[]): KeyValue;
    attrsWithId(...args: string[]): KeyValueWithId;
    hasChildren(): boolean;
    appendChild(child: BaseModel): void;
    /**
     * 새로운 부모를 기준으로 childItem 의 transform 을 맞춘다.
     *
     * 1. childItem 의 absoluteMatrix 를 구한다.
     * 2. 새로운 부모를 기준으로 좌표를 다시 맞춘다.   parentItem.absoluteMatrixInverse
     *
     * childItem 의 좌표를 새로운 parent 로 맞출 때는
     * itemMatrix (rotateZ) 를 먼저 구하고 offset 을 다시 구하는 순서로 간다.
     */    
    resetMatrix(childItem: BaseModel): void;
    refreshMatrixCache(): void;
    insertChild(child: BaseModel, index?: number): BaseModel;
    insertAfter(child: BaseModel): BaseModel;
    insertBefore(child: BaseModel): BaseModel;
    toggle(field: string, toggleValue?: boolean): void;
    isTreeItemHide(): boolean;
    expectJSON(key: string): boolean;
    toJSON(): KeyValue;
    resize(): void;
    copy(): BaseModel;
    findIndex(child: BaseModel): number;
    find(id: string): BaseModel;
    copyItem(childItem: BaseModel, dist: number): BaseModel;
    remove(): void;
    removeChild(childId: string): BaseModel;
    hasParent(findParentId: string): boolean;
    hasPathOf(targetItems: BaseModel[]): boolean;
    hasChild(childId: string): boolean;
    sendBackward(targetId: string): void;
    sendBack(targetId: string): void;
    bringForward(targetId: string): void;
    bringFront(targetId: string): void;
  }

  export interface KeyValueWithId {
    [key: string]: KeyValue;
  }
  export interface IContext {
    [key: string]: any;
    origin?: string;
  }

  export interface Hierarchy {
    id: string;
    index: number; 
    parentId: string; 
    prev: BaseModel;
    next: BaseModel;
    attrs: KeyValue
  }

  interface OffsetProperty {
    key: string;
    value: any;
  }

  interface Offset {
    offset: number;
    properties: OffsetProperty[];
  }

  interface Keyframe {
    id: string;
    name: string;
    offsets: Offset[];
  }
  export class BaseAssetModel extends BaseModel {
    get keyframes(): Keyframe[];
  }

  export class MovableModel extends BaseAssetModel {
    get isAbsolute(): boolean;
    get isDragSelectable(): boolean;
    get isBooleanItem(): boolean;
    get resizableWitChildren(): boolean;

    get perspective(): string;
    get perspectiveOrigin(): string;

    get transform(): string;
    get localMatrix(): mat4;
    get localMatrixInverse(): mat4;

    get transformWithTranslate(): vec3[];
    get transformWithTranslateToTranspose(): vec3[];
    get transformWithTranslateInverse(): vec3[];

    get itemMatrix(): mat4;
    get itemMatrixInverse(): mat4;

    get absoluteMatrix(): mat4;
    get absoluteMatrixInverse(): mat4;

    get relativeMatrix(): mat4;
    get relativeMatrixInverse(): mat4;
    get verties(): vec3[];

    get contentVerties(): vec3[];
    get originVerties(): vec3[];

    get localVerties(): vec3[];

    get guideVerties(): vec3[];
    get xList(): number[];
    get yList(): number[];

    get areaPosition(): any[];
    get screenX(): number;
    get screenY(): number;
    get offsetX(): number;
    get offsetY(): number;
    get screenWidth(): number;
    get screenHeight(): number;

    get y(): number;
    set y(value: number);
    get x(): number;
    set x(value: number);

    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    get angle(): number;
    set angle(value: number);
    get position(): string;
    set position(value: string);

    get transformOrigin(): string;
    set transformOrigin(value: string);

    /** translate vector */
    get translate(): vec3;

    /** scale vector */
    get scale(): vec3;

    /** rotate vector */
    get rotate(): vec3;

    /** origin vector */
    get origin(): vec3;

    /** absolute origin vector */
    get absoluteOrigin():vec3;

    /** quaternion(사원수) */
    get quat(): quat;
    toCloneObject(isDeep: boolean): KeyValue;

    convert(json: KeyValue): KeyValue;

    //////////////////////
    //
    // getters
    //
    ///////////////////////


    setScreenX(value: number): void;
    setScreenY(value: number): void;

    /**
     * Item 이동하기
     *
     * @param {vec3} distVector
     */
    move(distVector: vec3): void;
    moveByCenter(newCenter: vec3): void;

    /**
     * 충돌 체크
     *
     * polygon : ploygon 형태로 충돌 체크를 한다.
     *
     * @param {*} areaVerties
     */
    checkInArea(areaVerties: vec3[]): boolean;

    /**
     * 특정 위치가 객체를 가리키고 있는데 체크한다.
     *
     * @param {number} x
     * @param {number} y
     */
    hasPoint(x: number, y: number): boolean;

    /**
     * areaVerties 안에 Layer 가 포함된 경우
     *
     * @param {vec3[]} areaVerties
     */
    isIncludeByArea(areaVerties: vec3[]): boolean;

    getPerspectiveMatrix(): mat4 | undefined;

    getItemTransformMatrix(): mat4;

    getItemTransformMatrixInverse(): mat4;

    /**
     * refer to https://www.w3.org/TR/css-transforms-2/
     *
     * 1. Start with the identity matrix.
     * 2. Translate by the computed X, Y and Z of transform-origin
     * 3. Multiply by each of the transform functions in transform property from left to right
     * 4. Translate by the negated computed X, Y and Z values of transform-origin
     */
    getTransformMatrix(): mat4;

    getTransformMatrixInverse(): mat4;

    /**
     * 방향에 따른 matrix 구하기
     *
     * @param {vec3} vertextOffset
     */
    getDirectionTransformMatrix(
      vertextOffset: vec3,
      width: Length,
      height: Length
    ): mat4;
    getDirectionTopLeftMatrix(width: Length, height: Length): mat4;
    getDirectionLeftMatrix(width: Length, height: Length): mat4;
    getDirectionTopMatrix(width: Length, height: Length): mat4;
    getDirectionBottomLeftMatrix(width: Length, height: Length): mat4;
    getDirectionTopRightMatrix(width: Length, height: Length): mat4;
    getDirectionRightMatrix(width: Length, height: Length): mat4;
    getDirectionBottomRightMatrix(width: Length, height: Length): mat4;
    getDirectionBottomMatrix(width: Length, height: Length): mat4;

    getAbsoluteMatrix(): mat4;
    getAbsoluteMatrixInverse(): mat4;

    selectionVerties(): vec3[];
    rectVerties(): vec3[];

    get matrix(): ICachedMatrix;

    /**
     *
     * @returns {vec3[]} 패스의 verties
     */
    pathVerties(): vec3[];

    /**
     * 중첩된 matrix 적용한 path segment
     *
     * @returns {PathParser}
     */
    absolutePath(pathString: string): PathParser;

    // 전체 캔버스에 그려진 path 의 개별 verties 를
    // svg container 의 matrix 의 inverse matrix 를 곱해서 재계산 한다.
    invertPath(pathString: string): PathParser;

    /**
     * pathString 의 좌표를 기준 좌표로 돌린다.
     *
     * @param {string} pathString   svg path string
     */
    invertPathString(pathString: string): string;

    /**
     * 나를 포함한 모든 layer 에 대해서 체크한다.
     *
     * project, artboard 를 제외
     *
     * @param {vec3[]} areaVerties
     */
    checkInAreaForAll(areaVerties: vec3[]): MovableItem[];

    /**
     * area 에 속하는지 충돌 체크,
     *
     * @param {vec3[]} areaVerties
     * @returns {Item[]}  충돌 체크된 선택된 객체 리스트
     */
    checkInAreaForLayers(areaVerties: vec3[]): MovableItem[];

    getTransformOriginMatrix(): mat4;

    getTransformOriginMatrixInverse(): mat4;

    /** order by  */

    getIndex(): number;
    setOrder(targetIndex: number): void;

    /**
     * 레이어를 현재의 다음으로 보낸다.
     * 즉, 화면상에 렌더링 영역에서 올라온다.
     */
    orderNext(): void;

    /**
     * 레이어를 현재의 이전으로 보낸다.
     * 즉, 화면상에 렌더링 영역에서 내려간다.
     */
    orderPrev(): void;

    // 부모의 처음으로 보내기
    orderFirst(): void;

    // 부모의 마지막으로 보내기
    orderLast(): void;

    //TODO: 전체중에 처음으로 보내기
    orderTop(): void;
    //TODO: 전체중에 마지막으로 보내기
    orderBottom(): void;
  }

  export class GroupModel extends MovableModel {
    get isGroup(): boolean;

    isLayoutItem(): boolean;

    /**
     *
     * 레이아웃을 가지고 있는 container 인지 판별
     *
     * @returns {boolean}
     */
    hasLayout(): boolean;

    isInGrid(): boolean;

    isInFlex(): boolean;
  }

  interface Transition {
    name: string;
    duration: string;
    timingFunction: string;
    delay: string;

  }

  interface BoxShadow {
    offsetX: number;
    offsetY: number;
    blurRadius: number;
    spreadRadius: number;
    color: string;
  }

  interface TextShadow {
    offsetX: number;
    offsetY: number;
    blurRadius: number;
    color: string;
  }

  interface Pattern {

  }

  interface Selector {

  }

  interface Variable {

  }

  interface Filter {}
  export class DomModel extends GroupModel {
    get gridColumnStart(): number;
    set gridColumnStart(value: number);
  
    get gridColumnEnd(): number;
    set gridColumnEnd(value: number);
  
    get gridRowStart(): number;
    set gridRowStart(value: number);
  
    get gridRowEnd(): number;
    set gridRowEnd(value: number);
  
    get gridColumnGap(): string;
    set gridColumnGap(value: string);
  
    get gridRowGap(): string;
    set gridRowGap(value: string);
  
    get pattern(): Pattern[];
    set pattern(value: Pattern[]);
  
    get selectors(): Selector[];
    set selectors(value: Selector[]);
  
    get svg(): any;
    set svg(value: any);

    get rootVariable(): Variable[];
    set rootVariable(value: Variable[]);
  
    get variable(): Variable[];
    set variable(value: Variable[]);
  
    get filter(): Filter[];
    set filter(value: Filter[]);
  
    get backdropFilter(): Filter[];
    set backdropFilter(value: Filter[]);
  
    get backgroundColor(): string;
    set backgroundColor(value: string);
  
    get backgroundImage(): string;
    set backgroundImage(value: string);
  
    get textClip(): string;
    set textClip(value: string);
  
    get borderRadius(): string;
    set borderRadius(value: string);
  
    get border(): string;
    set border(value: string);
  
    get boxShadow(): BoxShadow[];
    set boxShadow(value: BoxShadow[]);
  
    get textShadow(): TextShadow[];
    set textShadow(value: TextShadow[]);
  
    get clipPath(): string;
    set clipPath(value: string);
  
    get color(): string;
    set color(value: string);
  
    get opacity(): string;
    set opacity(value: string);

    get transformStyle(): string;
    set transformStyle(value: string);
  
    get fontSize():string;
    set fontSize(value: string);
  
    get fontFamily():string;
    set fontFamily(value: string);
  
    get fontWeight(): string;
    set fontWeight(value: string);
  
    get fontStyle(): string;
    set fontStyle(value: string);
  
    get fontVariant(): string;
    set fontVariant(value: string);
  
    get fontStretch(): string;
    set fontStretch(value: string);
  
    get lineHeight(): string;
    set lineHeight(value: string);
  
    get letterSpacing(): string;
    set letterSpacing(value: string);
  
    get wordSpacing(): string;
    set wordSpacing(value: string);
  
    get textDecoration(): string;
    set textDecoration(value: string);
  
    get textAlign(): string;
    set textAlign(value: string);
  
    get textTransform(): string;
    set textTransform(value: string);
  
    get textOverflow(): string;
    set textOverflow(value: string);
  
    get textIndent(): string;
    set textIndent(value: string);
  
    get mixBlendMode(): string;
    set mixBlendMode(value: string);
    
    get zIndex(): number;
    set zIndex(value: number);

    get overflow(): string;
    set overflow(value: string);
  
    get animation(): Animation[];
    set animation(value: Animation[]);
  
    get transition(): Transition[];
    set transition(value: Transition[]);
  
    get marginTop(): string;
    set marginTop(value: string);
  
    get marginRight(): string;
    set marginRight(value: string);
  
    get marginBottom(): string;
    set marginBottom(value: string);

    get marginLeft(): string;
    set marginLeft(value: string);
  
    get paddingTop(): string;
    set paddingTop(value: string);
  
    get paddingRight(): string;
    set paddingRight(value: string);
  
    get paddingBottom(): string;
    set paddingBottom(value: string);
  
    get paddingLeft(): string;
    set paddingLeft(value: string);

    get changedBoxModel(): boolean;
    get changedFlexLayout(): boolean;
    get changedGridLayout(): boolean;
    get changedLayoutItem(): boolean;
    get changedLayout(): boolean;

    get borderWidth(): {
      borderLeftWidth: number;
      borderRightWidth: number;
      borderTopWidth: number;
      borderBottomWidth: number;
    };

    get contentBox(): {
      width: number;
      height: number;
      x: number;
      y: number;
    }

    getGradientLineLength(width: number, height: number, angle: number): number;

    createBackgroundImageMatrix(index: number): {
      backRect: any;
      backVerties: vec3[];
      absoluteMatrix: vec3[];
      backgroundImage: any;
      radialCenterPosition?:vec3;
      radialCenterStick?: vec3;
      radialCenterPoint?: vec3;
      startPoint: vec3;
      endPoint: vec3;
      shapePoint: vec3;
      colorsteps: {
        id: string;
        cut: boolean;
        color: string;
        timing: string;
        timingCount: number;
        pos: vec3;
      }[];
      areaStartPoint?: vec3;
      areaEndPoint?: vec3;
    };
  }

  export class LayerModel extends DomModel {}

  export class Component extends LayerModel {
    static createComponent: (params: IComponentParams) => Component;
  }

  export class ArtBoard extends LayerModel { }

  export class EventMachine {
    protected opt: KeyValue;
    protected parent: any;
    protected props: KeyValue;
    protected state: KeyValue;
    public source: string;
    public sourceName: string;

    /**
     * UIElement instance 에 필요한 기본 속성 설정
     */
    protected initializeProperty(opt: KeyValue, props: KeyValue): void;

    protected initComponents(): void;

    protected initializeHandler(): any[];

    /**
     * state 를 초기화 한것을 리턴한다.
     *
     * @protected
     * @returns {Object}
     */
    protected initState(): KeyValue;

    /**
     * state 를 변경한다.
     *
     * @param {Object} state  새로운 state
     * @param {Boolean} isLoad  다시 로드 할 것인지 체크 , true 면 state 변경후 다시 로드
     */
    setState(state: KeyValue, isLoad: boolean): void;

    /**
     * state 에 있는 key 필드의 값을 토글한다.
     * Boolean 형태의 값만 동작한다.
     *
     * @param {string} key
     * @param {Boolean} isLoad
     */
    toggleState(key: string, isLoad: boolean): void;

    /**
     * 객체를 다시 그릴 때 사용한다.
     *
     * @param {*} props
     * @protected
     */
    protected _reload(props: KeyValue): void;

    /**
     * template 을 렌더링 한다.
     *
     * @param {Dom|undefined} $container  컴포넌트가 그려질 대상
     */
    render($container: Dom | undefined): Promise<void>;

    protected initialize(): void;

    /**
     * render 이후에 실행될 함수
     * dom 이 실제로 생성된 이후에 수행할 작업들을 정의한다.
     *
     * @protected
     */
    protected afterRender(): void;

    /**
     * 하위에 연결될 객체들을 정의한다
     *
     * @protected
     * @returns {Object}
     */
    protected components(): KeyValue;

    /**
     * ref 이름을 가진 Component 를 가지고 온다.
     *
     * @param  {any[]} args
     * @returns {EventMachine}
     */
    getRef(...args: string[]): Dom;

    /**
     * refresh 는 load 함수들을 실행한다.
     */
    public refresh(): void;

    protected load(...args: any[]): Promise<any>;

    public bindData(...args: string[]): void;

    // 기본 템플릿 지정
    protected template(): string|string[]|HTMLElement|HTMLElement[]|null|undefined;

    //
    protected eachChildren(callback: Function): void;

    rerender(): void;

    /**
     * 자원을 해제한다.
     * 이것도 역시 자식 컴포넌트까지 제어하기 때문에 가장 최상위 부모에서 한번만 호출되도 된다.
     *
     */
    destroy(): void;

    /* magic check method  */

    protected self(e: any): boolean;

    protected isAltKey(e: any): boolean;
    protected isCtrlKey(e: any): boolean;
    protected isShiftKey(e: any): boolean;
    protected isMetaKey(e: any): boolean;
    protected isMouseLeftButton(e: any): boolean;
    /** before check method */

    /* after check method */

    protected preventDefault(e: any): boolean;
    protected stopPropagation(e: any): boolean;
    protected bodyMouseMove(e: any, methodName: string): void;
    protected bodyMouseUp(e: any, methodName: string): void;
  }

  export class UIElement extends EventMachine {
    /**
     * UIElement 가 생성될 때 호출되는 메소드
     * @protected
     */
    protected created(): void;

    /**
     * UIElement 기반으로 메세지를 호출 한다.
     * 나 이외의 객체들에게 메세지를 전달한다.
     *
     * @param {string} messageName
     * @param {any[]} args
     */
    emit(messageName: string, ...args: any[]): void;

    /**
     * MicroTask 를 수행한다.
     *
     * @param {Function} callback
     */
    nextTick(callback: () => void);

    /**
     *
     * UIElement 자신의 메세지를 수행한다.
     * emit 은 나외의 객체에게 메세지를 보내고
     *
     * @param {string} messageName
     * @param {any[]} args
     */
    trigger(messageName: string, ...args: any[]): void;

    /**
     * 모든 자식컴포넌트에 메세지를 보낸다.
     *
     * @param messageName
     * @param args
     */
    broadcast(messageName: string, ...args: any[]): void;

    /**
     * 메세지 등록
     *
     * @param message
     * @param callback
     */
    on(message: string, callback: Function): void;

    /**
     * 메세지 등록 해제
     * @param message
     * @param callback
     */
    off(message: string, callback: Function): void;
  }

  export interface ConfigManager {
    get(key: string): any;
    set(key: string, value: any, isSave?: boolean): void;
    setAll(obj: KeyValue): void;

    getType(key: string): string;
    isType(key: string, type: string): boolean;
    isBoolean(key: string): boolean;
    toggle(key: string): void;

    true(key: string): boolean;
    false(key: string): boolean;
    is(key: string, value: any): boolean;
    remove(key: string): void;

    /**
     * config 기본 설정을 등록한다.
     *
     * @param {Object} config
     * @param {string} config.type config key 자료형
     * @param {string} config.key config key 이름
     * @param {any} config.defaultValue config key 기본 값
     * @param {string} config.title config key 제목
     * @param {string} config.description config key 설명
     */
    registerConfig(config: KeyValue): void;
  }

  export interface CommandManager {
    emit(commandString: string, ...args: any[]): void;
  }

  export class EditorElement extends UIElement {
    get $editor(): EditorInstance;
    get $store(): BaseStore;

    /**
     * i18n 텍스트를 리턴한다.
     *
     * @param {string} key
     * @returns {string} i18n 텍스트
     */
    $i18n(key: string): string;

    $theme(key: string): any;
  }

  export class BaseProperty extends EditorElement {
    onToggleShow(): void;
    protected setTitle(title: string): void;
    protected isHideHeader(): boolean;

    protected isFirstShow(): boolean;

    protected getClassName(): string;

    protected getTitleClassName(): string;

    protected getBodyClassName(): string;

    getTitle(): string;

    getTools(): string;

    getBody(): string;

    getFooter(): string;

    isPropertyShow(): boolean;

    toggle(isShow: boolean): void;

    hide(): void;

    show(): void;

    onShowTitle(isShow: boolean): void;
    refreshShowIsNot(type: string, isRefresh: boolean): void;

    refreshShow(type: string, isRefresh: boolean): void;
  }

  export interface ObjectPropertyProps {
    title: string;
    editableProperty?: string;
    action?: string | Function;
    inspector?: Function;
  }
  export class ObjectProperty {
    static create(json: ObjectPropertyProps): BaseProperty;
  }

  export interface ICommandObject {}

  export interface ShortcutObject {}

  export interface MenuItemCallback<T> {
    (editor: EditorInstance, ...args: any[]): T;
  }

  export interface DropdownMenuItem {
    type: "dropdown";
    items?: MenuItem[];
    direction?: "left" | "right";
    icon?: string;
    title?: string;
    events?: any[];
    selected?: boolean;
    selectedKey?: string | MenuItemCallback<string>;
    action?: MenuItemCallback<void>;
    style?: KeyValue;
    dy?: number;
  }

  export type EventCommandType = string;

  export interface CustomMenuItem {
    type: "custom";
    title?: string;
    icon?: string;
    key?: string;
    action?: MenuItemCallback<void>;
    command?: string;
    args?: any[];
    template: string | MenuItemCallback<string>;
    events?: EventCommandType[];
  }

  export interface ButtonMenuItem {
    type: "button";
    title?: string;
    icon?: string;
    command?: string;
    shortcut?: string;
    closable?: boolean;
    args?: any[];
    nextTick?: MenuItemCallback<void>;
    disabled?: boolean;
    selected?: boolean;
    key?: string;
    action?: MenuItemCallback<void>;
    events?: EventCommandType[];
    style?: KeyValue;
  }

  export interface CheckboxMenuItem {
    type: "checkbox";
    checked?: boolean | (() => boolean);
    value?: string;
    title?: string;
    command?: string;
    shortcut?: string;
    args?: any[];
    nextTick?: MenuItemCallback<void>;
    disabled?: boolean;
    selected?: boolean;
    key?: string;
    action?: MenuItemCallback<void>;
    events?: EventCommandType[];
    style?: KeyValue;
  }

  export type MenuItem =
    | string
    | DropdownMenuItem
    | ButtonMenuItem
    | CheckboxMenuItem
    | CustomMenuItem;

  export interface EditorInstance {
    registerElement(obj: ElementValue<EditorElement>): void;
    registerUI(target: string, obj: ElementValue<EditorElement>): void;
    registerComponent(name: string, component: ElementValue<EditorElement>);
    registerItem(name: string, item: Item);
    registerInspector(name: string, inspectorCallback: Function);
    registerRenderer(
      rendererType: string,
      name: string,
      rendererInstance: any
    );
    registerCommand(commandObject: Function | ICommandObject): void;
    registerShortCut(shortcut: ShortcutObject): void;

    /**
     * 에디터에 맞는 config 를 등록한다.
     *
     * @param {object} config
     */
    registerConfig(config: KeyValue): void;

    /**
     *
     * @param {PluginInterface} createPluginFunction
     */
    registerPlugin(createPluginFunction: PluginInterface): void;
    registerPluginList(plugins: PluginInterface[]): void;

    /**
     * locale 에 맞는 i18n 메세지 등록
     *
     * @param locale
     * @param messages
     */
    registerI18nMessage(locale: string, messages: KeyValue): void;

    /**
     * 설정된 전체 locale 에 맞는 메세지 등록
     *
     * @param messages
     */
    registerI18nMessageWithLocale(messages: KeyValue): void;

    /**
     * itemType 에 대한 아이콘 지정
     *
     * @param itemType
     * @param iconOrFunction
     */
    registerIcon(itemType: string, iconOrFunction: string | Function): void;

    registerMenu(target: string, menu: MenuItem | MenuItem[]): void;

    /**
     * HTML Renderer 인스턴스
     */
    html: HTMLRenderer;
    svg: SVGRenderer;
    json: JSONRenderer;

    config: ConfigManager;
    context: {
      config: ConfigManager;
      commands: CommandManager;
    };
  }

  export interface PluginInterface {
    (editor: EditorInstance): void;
  }

  export interface EditorInterface {
    createDesignEditor(opt: KeyValue): EditorElement;
    createDesignPlayer(opt: KeyValue): EditorElement;
    plugins: PluginInterface[];
  }

  export interface HTMLRenderer {
    render(item: Item, renderer: HTMLRenderer): string;

    update(item: Item, currentElement: Dom, editor: EditorInstance): any;
  }

  export interface SVGRenderer {
    render(item: Item, renderer: SVGRenderer): string;

    update(item: Item, currentElement: Dom, editor: EditorInstance): any;
  }

  export interface JSONRenderer {
    render(item: Item, renderer: JSONRenderer): string;

    update(item: Item, currentElement: Dom, editor: EditorInstance): any;
  }

  export class Render {}

  export class HTMLItemRender extends Render {
    render(item: Item, renderer: HTMLRenderer): string;

    /**
     * 초기 렌더링 이후 업데이트만 할 때
     *
     * @param {Item} item
     * @param {Dom} currentElement
     * @override
     */
    update(item: Item, currentElement: Dom): void;
  }

  export class DomRender extends HTMLItemRender {
    toDefString(item: Item): string;
  }

  export class HTMLLayerRender extends DomRender {}

  const easylogic: EditorInterface;

  export type icon = ElementValue<string>;

  type ElementFunction = () => any;
  type ElementType = typeof UIElement | ElementFunction;

  interface EditorPlugin {
    (editor: EditorInstance): void;
  }

  interface EditorOptions {
    container: string | HTMLElement;
    config?: KeyValue;
    plugins?: EditorPlugin[];
  }

  export function start(uiElement: ElementType, options: KeyValue): UIElement;
  export function renderToString(
    uiElement: ElementType,
    options: KeyValue
  ): Promise<string>;
  export function createDesignEditor(opts: EditorOptions): UIElement;
  export function createBlankEditor(opts: EditorOptions): UIElement;

  export function createComponent(
    ComponentName: string,
    props?: KeyValue,
    children?: any[]
  ): string;

  export function createComponentList(...args: any[]): string;

  export function createElement(
    Component: string,
    props: KeyValue,
    children: any[]
  ): string;

  type FragmentInstanceType = any;

  /**
   * fragment 용 instance
   */
  export const FragmentInstance: FragmentInstanceType;

  export function createElementJsx(
    Component: ElementType | string | FragmentInstanceType,
    props: KeyValue,
    ...children: any[]
  ): string;

  export default easylogic;
}
