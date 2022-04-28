import { BaseStore, registAlias, registElement } from "sapa";

import { AssetManager } from "./manager-items/AssetManager";
import { ClipboardManager } from "./manager-items/ClipboardManager";
import { CommandMaker } from "./manager-items/CommandMaker";
import { CommandManager } from "./manager-items/CommandManager";
import { ComponentManager } from "./manager-items/ComponentManager";
import { ConfigManager } from "./manager-items/ConfigManager";
import { CursorManager } from "./manager-items/CursorManager";
import { HistoryManager } from "./manager-items/HistoryManager";
import { I18nManager } from "./manager-items/I18nManager";
import { IconManager } from "./manager-items/IconManager";
import { InjectManager } from "./manager-items/InjectManager";
import { KeyBoardManager } from "./manager-items/KeyboardManager";
import { LockManager } from "./manager-items/LockManager";
import { MenuManager } from "./manager-items/MenuManager";
import { ModelManager } from "./manager-items/ModelManager";
import { ModeViewManager } from "./manager-items/ModeViewManager";
import { PathKitManager } from "./manager-items/PathKitManager";
import { PluginManager } from "./manager-items/PluginManager";
import { RendererManager } from "./manager-items/RendererManager";
import { SegmentSelectionManager } from "./manager-items/SegmentSelectionManager";
import { SelectionManager } from "./manager-items/SelectionManager";
import { ShortCutManager } from "./manager-items/ShortCutManager";
import { SnapManager } from "./manager-items/SnapManager";
import { StateManager } from "./manager-items/StateManager";
import { StorageManager } from "./manager-items/StorageManager";
import { TimelineSelectionManager } from "./manager-items/TimelineSelectionManager";
import { ViewportManager } from "./manager-items/ViewportManager";
import { VisibleManager } from "./manager-items/VisibleManager";

import { uuid } from "elf/core/math";
import theme from "elf/editor/ui/theme";

export class Editor {
  /**
   *
   * @param {object} [opt={}]
   * @param {BaseStore} opt.store  Message 처리기
   */
  constructor(opt = {}) {
    this.EDITOR_ID = uuid();

    this.projects = [];
    this.popupZIndex = 10000;
    // this.canvasWidth = 100000;
    // this.canvasHeight = 100000;
    this.symbols = {};
    this.images = {};
    this.openRightPanel = true;
    this.ignoreManagers = opt.ignoreManagers || [];

    this.loadManagers();
  }

  /**
   * 에디터에서 공통으로 필요한 Manager 들을 로드 한다.
   */
  loadManagers() {
    this.registerManager({
      store: BaseStore,
      config: ConfigManager,
      snapManager: SnapManager,
      commands: CommandManager,
      selection: SelectionManager,
      segmentSelection: SegmentSelectionManager,
      timeline: TimelineSelectionManager,
      history: HistoryManager,
      keyboardManager: KeyBoardManager,
      viewport: ViewportManager,
      storageManager: StorageManager,
      cursorManager: CursorManager,
      assetManager: AssetManager,
      injectManager: InjectManager,
      components: ComponentManager,
      pluginManager: PluginManager,
      renderers: RendererManager,
      i18n: I18nManager,
      modelManager: ModelManager,
      modeViewManager: ModeViewManager,
      pathKitManager: PathKitManager,
      lockManager: LockManager,
      visibleManager: VisibleManager,
      clipboard: ClipboardManager,
      iconManager: IconManager,
      stateManager: StateManager,
      menuManager: MenuManager,
    });

    if (this.ignoreManagers.includes("ShortCutManager") === false) {
      this.registerManager({
        shortcuts: ShortCutManager,
      });
    }

    this.initPlugins();
    this.initStorage();
  }

  /**
   *
   * @param {object} obj
   */
  registerManager(obj = {}) {
    Object.keys(obj).forEach((name) => {
      const DataManagerClass = obj[name];

      Object.defineProperty(this, name, {
        value: new DataManagerClass(this),
        writable: false,
      });
    });
  }

  initStorage() {
    this.locale = this.loadItem("locale") || "en_US";
    this.layout = this.loadItem("layout") || "all";
  }

  createProject() {
    return this.createModel({ itemType: "project" });
  }

  getI18nMessage(key, params = {}, locale) {
    return this.i18n.get(key, params, locale || this.locale);
  }

  $i18n(key, params = {}, locale) {
    return this.getI18nMessage(key, params, locale);
  }

  hasI18nkey(key, locale) {
    return this.i18n.hasKey(key, locale || this.locale);
  }

  initI18nMessage(root = "") {
    return (key, params = {}, locale) => {
      const i18nKey = `${root}.${key}`;
      if (this.hasI18nkey(i18nKey, locale)) {
        return this.i18n(`${root}.${key}`, params, locale);
      } else {
        return this.i18n(`${key}`, params, locale);
      }
    };
  }

  setLocale(locale = "en_US") {
    this.locale = locale;
    this.saveItem("locale", this.locale);
  }

  setUser(user) {
    this.user = user;
  }

  async initPlugins(options = {}) {
    await this.pluginManager.initializePlugin(options);
  }

  themeValue(key, defaultValue = "") {
    return theme[this.config.get("editor.theme")][key] || defaultValue;
  }

  // 팝업의 zindex 를 계속 높여 주어
  // 최근에 열린 팝업이 밑으로 가지 않게 한다.
  get zIndex() {
    return this.popupZIndex++;
  }

  getFile(url) {
    return this.images[url] || url;
  }

  setStore(store) {
    this.store = store;
  }

  /**
   * 메세지를 실행한다.
   * 나 자신은 제외하고 실행한다.
   *
   * FIXME: command 는 자신과 동일한 command 를 재귀적으로 날릴 수 없다. (구현해야할듯 )
   **/
  emit(...args) {
    this.store.source = this.EDITOR_ID;
    this.store.emit(...args);
  }

  on(...args) {
    const [name, callback, context, ...rest] = args;
    return this.store.on(name, callback, context || this, ...rest);
  }

  off(...args) {
    this.store.off(...args);
  }

  offAll(...args) {
    this.store.offAll(...args);
  }

  debug() {
    // if (this.config.get('debug')) {
    //   console.log(...args);
    // }
  }

  command(command, message, ...args) {
    if (this.stateManager.isPointerUp) {
      return this.store.emit(`history.${command}`, message, ...args);
    } else {
      return this.store.emit(command, ...args);
    }
  }

  /**
   * MicroTask 를 수행한다.
   *
   * @param {Function} callback
   * @param {number} [delay=0]  callback 이 실행될 딜레이 시간 설정
   */
  nextTick(callback, delay = 0) {
    if (this.store) {
      window.setTimeout(() => {
        this.store.nextTick(callback);
      }, delay);
    }
  }

  /**
   * get model by id
   *
   * @param {string} idOrModel
   */
  get(idOrModel) {
    return this.modelManager.get(idOrModel.id || idOrModel);
  }

  replaceLocalUrltoRealUrl(str) {
    var project = this.selection.currentProject;
    var images = {};

    project.images.forEach((a) => {
      if (str.indexOf(a.local) > -1) {
        images[a.local] = a.original;
      }
    });

    Object.keys(images).forEach((local) => {
      if (str.indexOf(local) > -1) {
        str = str.replace(new RegExp(local, "g"), images[local]);
      }
    });

    return str;
  }

  /**
   * itemObject (객체)를 가지고 itemType 에 따른  실제 Component 객체를 생성해준다.
   *
   * @param {object} itemObject
   * @param {Boolean} [isRecoverPosition=true]
   */
  createModel(itemObject, isRegister = true) {
    return this.modelManager.createModel(itemObject, isRegister);
  }

  /**
   * id 로 객체를 탐색한다.
   * 모든 프로젝트를 탐색하도록 한다.
   *
   * @param {string} id
   * @returns {Item}
   */
  searchItem(id) {
    return this.modelManager.searchItem(id);
  }

  get storeKey() {
    return `__els__.${this.config.get("store.key")}`;
  }

  saveItem(key, value) {
    window.localStorage.setItem(
      `${this.storeKey}.${key}`,
      JSON.stringify(value)
    );
  }

  loadItem(key) {
    return JSON.parse(
      window.localStorage.getItem(`${this.storeKey}.${key}`) ||
        JSON.stringify("")
    );
  }

  createCommandMaker() {
    return new CommandMaker(this);
  }

  /**
   * register UIElement
   *
   * @param {UIElement} obj
   */
  registerElement(obj) {
    registElement(obj);
  }

  /**
   * register alias
   *
   * @param {KeyValue} obj
   */
  registerAlias(obj) {
    Object.entries(obj).forEach(([key, value]) => {
      registAlias(key, value);
    });
  }

  registerUI(target, obj = {}, order = 1) {
    // console.log(target, obj, order)
    this.injectManager.registerUI(target, obj, order);
    this.registerElement(obj);
  }

  registerComponent(name, component) {
    this.components.registerComponent(name, component);
  }

  registerItem(name, item) {
    this.registerComponent(name, item);
  }

  registerInspector(name, inspectorCallback) {
    this.components.registerInspector(name, inspectorCallback);
  }

  registerRenderer(rendererType, name, rendererInstance) {
    this.renderers.registerRenderer(rendererType, name, rendererInstance);
  }

  registerRendererType(rendererType, rendererTypeInstance) {
    this.renderers.registerRendererType(rendererType, rendererTypeInstance);
  }

  getRendererInstance(rendererType, itemType) {
    return this.renderers.getRendererInstance(rendererType, itemType);
  }

  renderer(rendererType) {
    return this.renderers.getRenderer(rendererType);
  }

  get html() {
    return this.renderer("html");
  }

  get svg() {
    return this.renderer("svg");
  }

  /**
   *
   * @returns {JSONRenderer}
   */
  get json() {
    return this.renderer("json");
  }

  /**
   *
   * @param {object|function} commandObject
   * @return {function} dispose function
   */
  registerCommand(commandObject) {
    return this.commands.registerCommand(commandObject);
  }

  /**
   * 단축키(shortcut)을 등록한다.
   */
  registerShortCut(shortcut) {
    this.shortcuts.registerShortCut(shortcut);
  }

  /**
   * 플러그인을 등록한다.
   *
   * @param {Function} createPluginFunction
   */
  registerPlugin(createPluginFunction) {
    this.pluginManager.registerPlugin(createPluginFunction);
  }

  registerPluginList(plugins = []) {
    plugins.forEach((p) => this.registerPlugin(p));
  }

  /**
   * 에디터에 맞는 config 를 등록한다.
   *
   * @param {object} config
   */
  registerConfig(config) {
    this.config.registerConfig(config);
  }

  registerI18nMessage(locale, messages) {
    this.i18n.registerI18nMessage(locale, messages);
  }

  registerI18nMessageWithLocale(messages) {
    Object.entries(messages).forEach(([locale, messages]) => {
      this.registerI18nMessage(locale, messages);
    });
  }

  registerIcon(itemType, iconOrFunction) {
    this.iconManager.registerIcon(itemType, iconOrFunction);
  }

  /**
   * 메뉴 등록하기
   *
   * @param {string} target
   * @param {object|object[]} menu
   */
  registerMenu(target, menu) {
    this.menuManager.registerMenu(target, menu);
  }
}