
import UIElement from "el/sapa/UIElement";
import { ADD_BODY_FIRST_MOUSEMOVE, ADD_BODY_MOUSEMOVE, ADD_BODY_MOUSEUP } from "el/editor/types/event";
import { NotifyType } from "el/editor/types/editor";
import { SceneManager } from '../../manager/manager-items/SceneManager';

export class EditorElement extends UIElement {


    initialize() {
        super.initialize();
    
        // EditorElement 내부에서 i18n 을 바로 설정 할 수 있도록 셋팅한다.  
        this.$editor.registerI18nMessageWithLocale(this.initializeI18nMessage());
    }

    /**
     * i18n 메세지 로드 
     * 
     * @example 
     * 
     * ```json
     * {
     *     en_US: {
     *         "toolbar.add.rect.name": "add Rectangle"
     *     }
     * }
     * 
     * ```
     * ```js
     * console.log(this.i18n("toolbar.add.rect.name"));
     * ```
     * 
     * @override
     */ 
    initializeI18nMessage() {
        return {}
    }

    /**
     * DomEventHandler 에서 이벤트 재정의를 할지 설정합니다. 
     * 
     * true 를 리턴하면 DOM 이벤트는 한번만 정의 됩니다. 
     * 
     * @returns {boolean} 
     */
    get notEventRedefine () {
        return true; 
    }

    /**
     * Editor 루트를 재정의 해서 사용
     * 
     * @override
     * @returns {Editor}
     */
    get $editor() {

        if (!this.__cacheParentEditor) {
            this.__cacheParentEditor = this.parent.$editor;
        }

        return this.__cacheParentEditor;
    }

    /**
     * 메세징 루트를 재정의 할 수 있음. 
     * 
     * @override
     */
    get $store() {
        return this.$editor.store || this.parent.$store;
    }

    // editor utility 

    /**
     * i18n 텍스트를 리턴한다. 
     * 
     * @param {string} key 
     * @returns {string} i18n 텍스트 
     */
    $i18n(key, params = {}, locale) {
        return this.$editor.getI18nMessage(key, params, locale);
    }

    $initI18n(key) {
        return this.$editor.initI18nMessage(key);
    }

    get $config() {
        return this.$editor.config;
    }

    get $selection() {
        return this.$editor.selection;
    }

    get $segmentSelection() {
        return this.$editor.segmentSelection;
    }

    get $commands () {
        return this.$editor.commands;
    }

    get $viewport() {
        return this.$editor.viewport;
    }

    get $snapManager() {
        return this.$editor.snapManager;
    }

    get $timeline() {
        return this.$editor.timeline;
    }

    get $history() {
        return this.$editor.history;
    }

    get $shortcuts() {
        return this.$editor.shortcuts;
    }

    get $keyboardManager() {
        return this.$editor.keyboardManager;
    }

    get $storageManager() {
        return this.$editor.storageManager;
    }

    get $injectManager() {
        return this.$editor.injectManager;
    }


    /**
     * 모델 관리하는 Manager 객체 
     * 
     */
    get $model() {
        return this.$editor.modelManager;
    }

    get $lockManager() {
        return this.$editor.lockManager;
    }

    get $visibleManager() {
        return this.$editor.visibleManager;
    }

    /**
     * 현재 에디팅 모드를 관리하는 Manager 객체
     */
    get $modeView() {
        return this.$editor.modeViewManager;
    }

    get $pathkit() {
        return this.$editor.pathKitManager;
    }

    get $icon () {
        return this.$editor.iconManager;
    }

    get $stateManager () {
        return this.$editor.stateManager;
    }

    /**
     * @type {SceneManager}
     */
    get $sceneManager() {
        return this.$editor.sceneManager;
    }

    /**
     * history 가 필요한 커맨드는 command 함수를 사용하자. 
     * 마우스 업 상태에 따라서 자동으로 history 커맨드로 분기해준다. 
     * 기존 emit 과 거의 동일하게 사용할 수 있다.   
     * 
     * @param {string} command 
     * @param {string} description 
     * @param {any[]} args 
     */
    command(command, description, ...args) {
        if (this.$stateManager.isPointerUp) {
            return this.emit(`history.${command}`, description, ...args);
        } else {
            return this.emit(command, ...args);
        }

    }

    /**
     * 
     * @param {string} type 
     * @param {string} title 
     * @param {string} description 
     * @param {number} [duration=1000] 
     */
    notify(type, title, description, duration = 1000) {
        this.emit(
            "notify",
            type,
            title,
            description,
            duration
          );
    }

    alert(title, description, duration = 1000) {
        this.notify(NotifyType.ALERT, title, description, duration);
    }

    $theme(key) {
        return this.$editor.themeValue(key);
    }

    bodyMouseFirstMove(e, methodName) {
        if (this[methodName]) {
            this.emit(ADD_BODY_FIRST_MOUSEMOVE, this[methodName], this, e.xy);
        }
    }


    bodyMouseMove(e, methodName) {
        if (this[methodName]) {
            this.emit(ADD_BODY_MOUSEMOVE, this[methodName], this, e.xy);
        }
    }

    bodyMouseUp(e, methodName) {
        if (this[methodName]) {
            this.emit(ADD_BODY_MOUSEUP, this[methodName], this, e.xy);
        }
    }

}