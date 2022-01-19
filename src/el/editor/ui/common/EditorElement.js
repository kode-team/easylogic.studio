
import UIElement from "el/sapa/UIElement";
import { ConfigManager } from "el/editor/manager/ConfigManager";
import { InjectManager } from "el/editor/manager/InjectManager";
import { SelectionManager } from "el/editor/manager/SelectionManager";
import { ViewportManager } from "el/editor/manager/ViewportManager";
import { ADD_BODY_FIRST_MOUSEMOVE, ADD_BODY_MOUSEMOVE, ADD_BODY_MOUSEUP } from "el/editor/types/event";
import { ModelManager } from "el/editor/manager/ModelManager";
import { ShortCutManager } from "el/editor/manager/ShortCutManager";
import { ModeViewManager } from "el/editor/manager/ModeViewManager";
import { CommandManager } from "el/editor/manager/CommandManager";
import { SnapManager } from "el/editor/manager/SnapManager";
import { PathKitManager } from "el/editor/manager/PathKitManager";
import { VisibleManager } from "el/editor/manager/VisibleManager";
import { IconManager } from "el/editor/manager/IconManager";

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

    /**
     * @type {ConfigManager}
     */ 
    get $config() {
        return this.$editor.config;
    }

    /**
     * @type {SelectionManager}
     */
    get $selection() {
        return this.$editor.selection;
    }

    get $segmentSelection() {
        return this.$editor.segmentSelection;
    }

    /**
     * @type {CommandManager}
     */
    get $commands () {
        return this.$editor.commands;
    }

    /**
     * @type {ViewportManager}
     */
    get $viewport() {
        return this.$editor.viewport;
    }

    /**
     * @type {SnapManager}
     */
    get $snapManager() {
        return this.$editor.snapManager;
    }

    get $timeline() {
        return this.$editor.timeline;
    }

    get $history() {
        return this.$editor.history;
    }

    /**
     * @type {ShortCutManager}
     */
    get $shortcuts() {
        return this.$editor.shortcuts;
    }

    /**
     * @type {KeyBoardManager}
     */
    get $keyboardManager() {
        return this.$editor.keyboardManager;
    }

    /**
     * @type {StorageManager}
     */
    get $storageManager() {
        return this.$editor.storageManager;
    }

    /**
     * @type {InjectManager}
     */ 
    get $injectManager() {
        return this.$editor.injectManager;
    }

    /**
     * 하위 호환성을 위해서 이름을 유지함 
     * 
     * @type {InjectManager}
     */ 
     get $menuManager() {
        return this.$injectManager
    }    


    /**
     * 모델 관리하는 Manager 객체 
     * 
     * @type {ModelManager}
     * 
     */
    get $model() {
        return this.$editor.modelManager;
    }

    get $lockManager() {
        return this.$editor.lockManager;
    }

    /**
     * @type {VisibleManager}
     */
    get $visibleManager() {
        return this.$editor.visibleManager;
    }

    /**
     * 현재 에디팅 모드를 관리하는 Manager 객체 
     * 
     * @type {ModeViewManager}
     */
    get $modeView() {
        return this.$editor.modeViewManager;
    }

    /**
     * 
     * @type {PathKitManager}
     */
    get $pathkit() {
        return this.$editor.pathKitManager;
    }

    /**
     * 
     * @type {IconManager}
     */
    get $icon () {
        return this.$editor.iconManager;
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
        if (this.$editor.isPointerUp) {
            return this.emit(`history.${command}`, description, ...args);
        } else {
            return this.emit(command, ...args);
        }

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