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

    export const makeEventChecker = (value: string, split: string) => string;

    // event name regular expression
    export const EVENT: (...args: string[]) => string;
    export const COMMAND = EVENT;
    export const ON = EVENT;


    // Predefined CHECKER
    export const CHECKER = (value: string, split: string) => string;
    export const AFTER = (value: string, split: string) => string;
    export const BEFORE = (value: string, split: string) => string;

    export const IF = CHECKER;
    export const KEY = CHECKER;

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
    export const DOMDIFF: string;

    // event config method
    export const DEBOUNCE = (t: number = 100) => string;
    export const DELAY = (t: number = 300) => string;
    export const D1000: string;

    export const THROTTLE = (t: number = 100) => string;

    export const ALL_TRIGGER: string;

    export const CAPTURE: string;

    // event config method

    // before method

    // after method
    export const MOVE = (method: string = "move") => string;
    export const END = (method: string = "end") => string;

    export const PREVENT = string;
    export const STOP = string;

    const CallbackFunction = (...args: string[]) => string;

    const DOM_EVENT_MAKE = (...keys: string[]) => CallbackFunction;
    const SUBSCRIBE_EVENT_MAKE = CallbackFunction;

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
    export const LOAD = (value: string = "$el") => string;
    export const createRef = value => string;
    export const getRef = id => any;
    export const BIND = (value: string = "$el", checkFieldOrCallback: string = '') => string;


    export interface KeyValue {
        [key: string]: any;
    }

    export interface ElementValue<T> {
        [key: string]: T;
    }

    interface IComponentParams extends KeyValue {

    }

    export class Length {
        unit: string;
        value: number;
    }

    export class Dom {

        el: HTMLElement;

        static create(tag: string | HTMLElement | Dom | DocumentFragment, className: string, attr: KeyValue): Dom;
        static createByHTML(htmlString: string): Dom | null;
        static body(): Dom;

        find(selector: string): HTMLElement;
        $(selector: string): Dom | null;

        findAll(selector: string): HTMLElement[];
        $$(selector: string): Dom[];

        replaceChild(oldElement: Dom | HTMLElement, newElement: Dom | HTMLElement): Dom;

        checked(isChecked = false): Dom | boolean;
        click(): Dom;
        focus(): Dom;
        select(): Dom;
        blur(): Dom;

        // canvas functions

        context(contextType: string = "2d"): CanvasRenderingContext2D;

        resize({ width: number, height: number }: KeyValue): void;

        toDataURL(type = 'image/png', quality = 1): string;

        clear(): void;

        update(callback: Function): void;

        drawImage(img: any, dx: number = 0, dy: number = 0): void;
        drawOption(option: KeyValue = {}): void;
        drawLine(x1: number, y1: number, x2: number, y2: number): void;
        drawPath(...path: vec3[]): void;
        drawCircle(cx: number, cy: number, r: number): void;
        drawText(x: number, y: number, text: string): void;

        /* utility */
        fullscreen(): void;
        toggleFullscreen(): void;
    }

    export class BaseStore { }

    export class Item {
        getDefaultTitle(): string;
        getIcon(): string;
        isAttribute(): boolean;
        isChanged(timestamp: number): boolean;
        changed();

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
        getInnerId: (postfix: string = '') => string;

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

        toCloneObject(isDeep: boolean = true): KeyValue;

        /**
         * clone Item
         */
        clone(isDeep: boolean = true): Item;

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
        getDefaultObject(obj: KeyValue = {}): KeyValue;

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
        insertChildItem(layer: Item, index: number = 0): Item;

        /**
         * 현재 Item 의 그 다음 순서로 추가한다. 
         * 
         * @param {Item} layer 
         */
        appendAfter(layer: Item): Item;


        /**
         * 현재 Item 의 이전 순서로 추가한다. 
         * 
         * @param {Item} layer 
         */
        appendBefore(layer: Item): Item;

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
        toggle(field: string, toggleValue: boolean | undefined = undefined): void;

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
        copy(dist: number = 0): Item
        findIndex(item: Item): number;

        copyItem(childItem: Item, dist: number = 10): Item;

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
        localMatrix: mat4;    // 자기 자신의 matrix with translate offset(x,y)
        localMatrixInverse: mat4;
        itemMatrix: mat4;     // 자기 자신의 matrix without translate offset(x,y)
        itemMatrixInverse: mat4;
        accumulatedMatrix: mat4;  // parentMatrix * offset translate * localMatrix , 축적된 matrix 
        accumulatedMatrixInverse: mat4;
    }

    interface PathParser { }

    export class MovableItem extends Item {

        get isAbsolute(): boolean;
        get isRelative(): boolean;
        get isChild(): boolean;

        toCloneObject(isDeep: boolean = true): KeyValue;

        convert(json: KeyValue): KeyValue;

        //////////////////////
        //
        // getters 
        //
        ///////////////////////


        get screenX(): Length;
        get screenY(): Length;
        get offsetX(): Length;
        get offsetY(): Length;
        get screenWidth(): Length;
        get screenHeight(): Length;

        setScreenX(value: number): void;
        setScreenY(value: number): void;

        /**
         * Item 이동하기 
         *  
         * @param {vec3} distVector 
         */
        move(distVector: vec3 = [0, 0, 0]): void;
        moveByCenter(newCenter: vec3 = [0, 0, 0]): void;

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
        getDirectionTransformMatrix(vertextOffset: vec3, width: Length, height: Length): mat4;
        getDirectionTopLeftMatrix(width: Length, height: Length): mat4;
        getDirectionLeftMatrix(width: Length, height: Length): mat4;
        getDirectionTopMatrix(width: Length, height: Length): mat4;
        getDirectionBottomLeftMatrix(width: Length, height: Length): mat4;
        getDirectionTopRightMatrix(width: Length, height: Length): mat4;
        getDirectionRightMatrix(width: Length, height: Length): mat4;
        getDirectionBottomRightMatrix(width: Length, height: Length): mat4;
        getDirectionBottomMatrix(width: Length, height: Length): mat4;

        getAccumulatedMatrix(): mat4;
        getAccumulatedMatrixInverse(): mat4;

        verties(width: Length, height: Length): vec3[];
        selectionVerties(): vec3[];
        rectVerties(): vec3[];
        guideVerties(): vec3[];

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
        accumulatedPath(pathString: string = ''): PathParser;

        // 전체 캔버스에 그려진 path 의 개별 verties 를 
        // svg container 의 matrix 의 inverse matrix 를 곱해서 재계산 한다.     
        invertPath(pathString: string = ''): PathParser;

        /**
         * pathString 의 좌표를 기준 좌표로 돌린다. 
         * 
         * @param {string} pathString   svg path string 
         */
        invertPathString(pathString: string = ''): string;

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

        /**
         * 새로운 부모를 기준으로 childItem 의 transform 을 맞춘다. 
         * 
         * 1. childItem 의 accumulatedMatrix 를 구한다. 
         * 2. 새로운 부모를 기준으로 좌표를 다시 맞춘다.   parentItem.accumulatedMatrixInverse 
         * 
         * childItem 의 좌표를 새로운 parent 로 맞출 때는  
         * itemMatrix (rotateZ) 를 먼저 구하고 offset 을 다시 구하는 순서로 간다. 
         * 
         * @param {Item} childItem 
         */
        resetMatrix(childItem: Item): void;

        /** order by  */

        getIndex(): number;
        setOrder(targetIndex: number): void;

        // get next sibiling item 
        next(): MovableItem;

        // get prev sibiling item   
        prev(): MovableItem;

        /**
         * 레이어를 현재의 다음으로 보낸다. 
         * 즉, 화면상에 렌더링 영역에서 올라온다. 
         */
        orderNext(): void;

        isFirst(): boolean;

        isLast(): boolean;
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

    export class GroupItem extends MovableItem {

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

    export class DomItem extends GroupItem {

    }

    export class Layer extends DomItem {

    }

    export class Component extends Layer {
        static createComponent: (params: IComponentParams) => Component;
    }

    class EventMachine {

        protected opt: KeyValue = {};
        protected parent: any;
        protected props: KeyValue = {};
        public source: string;
        public sourceName: string;

        /**
         * UIElement instance 에 필요한 기본 속성 설정 
         */
        protected initializeProperty(opt: KeyValue, props: any = {}): void;

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
        setState(state: KeyValue = {}, isLoad: boolean = true): void;

        /**
         * state 에 있는 key 필드의 값을 토글한다. 
         * Boolean 형태의 값만 동작한다. 
         * 
         * @param {string} key 
         * @param {Boolean} isLoad 
         */
        toggleState(key: string, isLoad: boolean = true): void;

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
        render($container: Dom | undefined): void;

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

        async load(...args: any[]): void;


        public bindData(...args: string[]): void;

        // 기본 템플릿 지정
        template(): string;

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

    class UIElement extends EventMachine {

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
        nextTick(callback: Function);

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

    interface ConfigManager { }
    interface ShortCutManager { }
    interface SelectionManager { }
    interface ViewportManager { }
    interface SnapManager { }
    interface HistoryManager { }
    interface KeyBoardManager { }
    interface MenuItemManager { }

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

        get $config(): ConfigManager;

        /**
         * @type {SelectionManager} $selection
         */
        get $selection(): SelectionManager;

        /**
         * @type {ViewportManager} $viewport
         */
        get $viewport(): ViewportManager;

        /**
         * @type {SnapManager} $snapManager
         */
        get $snapManager(): SnapManager;


        get $history(): HistoryManager;

        /**
         * @type {ShortCutManager} $shortcuts
         */
        get $shortcuts(): ShortCutManager;

        /**
         * @type {KeyBoardManager} $keyboardManager
         */
        get $keyboardManager(): KeyBoardManager;

        /**
         * @type {StorageManager} $storageManager
         */
        get $storageManager(): StorageManager;

        get $menuManager(): MenuItemManager;

        /**
         * history 가 필요한 커맨드는 command 함수를 사용하자. 
         * 마우스 업 상태에 따라서 자동으로 history 커맨드로 분기해준다. 
         * 기존 emit 과 거의 동일하게 사용할 수 있다.   
         * 
         * @param {string} command 
         * @param {string} description 
         * @param {any[]} args 
         */

        command(command: string, description: string, ...args: any[]): any;

        $theme(key: sring): any;
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
        refreshShowIsNot(type: string = '', isRefresh: boolean = true): void;

        refreshShow(type: string, isRefresh: boolean = true): void;

    }


    export class MenuItem extends EditorElement {

        clickButton(e): void;

        getChecked(): boolean;

        isDisabled(): boolean;

        setSelected(isSelected: boolean): void;

        getTitle(): string;

        getIcon(): string;

        getIconString(): string;

        isHideTitle(): boolean;

        static createMenuItem(opt: KeyValue = {}): MenuItem;
    }

    interface ICommandObject {

    }

    interface ShortcutObject {

    }

    export interface EditorInstance {
        registElement(obj: ElementValue<EditorElement>): void;
        registerMenuItem(target: string, obj: ElementValue<EditorElement>): void;
        registerComponent(name: string, component: IComponent);
        registerItem(name: string, item: Item);
        registerInspector(name: string, inspectorCallback: Function);

        registerRenderer(rendererType: string, name: string, rendererInstance: IRender);
        registerCommand(commandObject: Function | ICommandObject): void;
        registerShortCut(shortcut: ShortcutObject): void;

        /**
         * 
         * @param {PluginInterface} createPluginFunction  
         */
        registerPlugin(createPluginFunction: PluginInterface): void;

        registerPluginList(plugins: PluginInterface[] = []): void;

    }

    export interface PluginInterface {
        (editor: EditorInstance): void;
    }

    export interface EditorInterface {
        createDesignEditor (opt: KeyValue = {}): EditorElement;
        createDesignPlayer (opt: KeyValue = {}): EditorElement;
        plugins: PluginInterface[]

    }


    export interface HTMLRenderer {

        render(item: Item, renderer: HTMLRenderer): string;

        update(item: Item, currentElement: Dom, editor: EditorInstance): any;
    }

    export class Render {

    }

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
        toDefString (item:Item):string;
    }

    export class HTMLLayerRender extends DomRender {
    }


    const easylogic: EditorInterface;

    export type icon = ElementValue<string>;

    export default easylogic;
}