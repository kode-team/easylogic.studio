import { UIElement } from "sapa";

import { NotifyType } from "elf/editor/types/editor";
import {
  ADD_BODY_FIRST_MOUSEMOVE,
  ADD_BODY_MOUSEMOVE,
  ADD_BODY_MOUSEUP,
  SHOW_NOTIFY,
} from "elf/editor/types/event";

export class EditorElement extends UIElement {
  /**
   * DomEventHandler 에서 이벤트 재정의를 할지 설정합니다.
   *
   * true 를 리턴하면 DOM 이벤트는 한번만 정의 됩니다.
   *
   * @returns {boolean}
   */
  get notEventRedefine() {
    return true;
  }

  /**
   * Editor 루트를 재정의 해서 사용
   *
   * UIElement 기반의 컴포넌트가 오더라도 최상위 editor 를 찾도록 한다.
   *
   * TODO: editor 객체를 주입하는 다른 방법을 조금 찾아봐야겠다.
   *
   * @override
   * @returns {Editor}
   */
  get $editor() {
    if (!this.__cacheParentEditor) {
      let parentElement = this.parent;

      while (parentElement) {
        if (parentElement.$editor) {
          this.__cacheParentEditor = parentElement.$editor;
          break;
        }
        parentElement = parentElement.parent;
      }
    }

    return this.__cacheParentEditor;
  }

  get $context() {
    return this.$editor.context;
  }

  /**
   * 메세징 루트를 재정의 할 수 있음.
   *
   * @override
   */
  get $store() {
    return this.$context.store || this.parent.$store;
  }

  /**
   * local을 심플하게 가지고 올 수 있도록 key 를 미리 지정한다.
   */
  get localeKey() {
    return "";
  }

  /**
   * localKey 를 기반으로 메세지 키를 생성한다.
   *
   * @param {string} key
   * @returns
   */
  getMessageKey(key) {
    if (this.localeKey) {
      return `${this.localeKey}.${key}`;
    }
    return key;
  }

  // editor utility

  /**
   * i18n 텍스트를 리턴한다.
   *
   * @param {string} key
   * @returns {string} i18n 텍스트
   */
  $i18n(key, params = {}, locale) {
    return this.$editor.getI18nMessage(this.getMessageKey(key), params, locale);
  }

  $initI18n(key) {
    return this.$editor.initI18nMessage(this.getMessageKey(key));
  }

  get $config() {
    return this.$context.config;
  }

  get $selection() {
    return this.$context.selection;
  }

  get $segmentSelection() {
    return this.$context.segmentSelection;
  }

  get $commands() {
    return this.$context.commands;
  }

  get $viewport() {
    return this.$context.viewport;
  }

  get $snapManager() {
    return this.$context.snapManager;
  }

  get $timeline() {
    return this.$context.timeline;
  }

  get $history() {
    return this.$context.history;
  }

  get $shortcuts() {
    return this.$context.shortcuts;
  }

  get $keyboardManager() {
    return this.$context.keyboardManager;
  }

  get $storageManager() {
    return this.$context.storageManager;
  }

  get $injectManager() {
    return this.$context.injectManager;
  }

  /**
   * 모델 관리하는 Manager 객체
   *
   */
  get $model() {
    return this.$context.modelManager;
  }

  get $lockManager() {
    return this.$context.lockManager;
  }

  get $visibleManager() {
    return this.$context.visibleManager;
  }

  /**
   * 현재 에디팅 모드를 관리하는 Manager 객체
   */
  get $modeView() {
    return this.$context.modeViewManager;
  }

  get $icon() {
    return this.$context.icon;
  }

  get $stateManager() {
    return this.$context.stateManager;
  }

  get $menu() {
    return this.$context.menuManager;
  }

  // /**
  //  * history 가 필요한 커맨드는 command 함수를 사용하자.
  //  * 마우스 업 상태에 따라서 자동으로 history 커맨드로 분기해준다.
  //  * 기존 emit 과 거의 동일하게 사용할 수 있다.
  //  *
  //  * @param {string} command
  //  * @param {string} description
  //  * @param {any[]} args
  //  */
  // command(command, description, ...args) {
  //   if (this.$stateManager.isPointerUp) {
  //     return this.emit(`history.${command}`, description, ...args);
  //   } else {
  //     return this.emit(command, ...args);
  //   }
  // }

  /**
   *
   * @param {string} type
   * @param {string} title
   * @param {string} description
   * @param {number} [duration=1000]
   */
  notify(type, title, description, duration = 1000) {
    this.emit(SHOW_NOTIFY, type, title, description, duration);
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

  /**
   * 함수형 컴포넌트 생성 함수
   *
   * @override
   * @param {Function} EventMachineComponent
   * @param {Dom} targetElement
   * @param {object} props
   * @returns
   */
  createFunctionComponent(
    EventMachineComponent,
    props,
    baseClass = EditorElement
  ) {
    return super.createFunctionComponent(
      EventMachineComponent,
      props,
      baseClass
    );
  }
}
