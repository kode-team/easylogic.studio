
import UIElement from "el/base/UIElement";
import { Editor } from "el/editor/manager/Editor";

export class EditorElement extends UIElement {

    get $editor () {
        return Editor;
    }

    get $store () {
        return this.$editor.store;
    }


    // editor utility 

    /**
     * i18n 텍스트를 리턴한다. 
     * 
     * @param {string} key 
     * @returns {string} i18n 텍스트 
     */
    $i18n (key) {
        return this.$editor.i18n(key);
    }

    $initI18n (key) {
        return this.$editor.initI18n(key);
    }

    get $config () {
        return this.$editor.config; 
    }

    /**
     * @type {SelectionManager} $selection
     */
    get $selection () {
        return this.$editor.selection; 
    }

    /**
     * @type {ViewportManager} $viewport
     */
    get $viewport () {
        return this.$editor.viewport; 
    }

    /**
     * @type {SnapManager} $snapManager
     */
    get $snapManager () {
        return this.$editor.snapManager;
    }

    get $timeline () {
        return this.$editor.timeline; 
    }  

    get $history () {
        return this.$editor.history; 
    }

    /**
     * @type {ShortCutManager} $shortcuts
     */
    get $shortcuts() {
        return this.$editor.shortcuts;
    }

    /**
     * @type {KeyBoardManager} $keyboardManager
     */
    get $keyboardManager () {
        return this.$editor.keyboardManager;
    }

    /**
     * @type {StorageManager} $storageManager
     */
    get $storageManager () {
        return this.$editor.storageManager;
    }

    get $menuManager () {
        return this.$editor.menuItemManager;
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

    command (command, description, ...args) {

        if (this.$editor.isPointerUp) {
        return this.emit(`history.${command}`, description, ...args);
        } else {
        return this.emit(command, ...args);
        }


    }

    $theme (key) {
        return this.$editor.themeValue(key);
    }
}