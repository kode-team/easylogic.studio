import { uuid } from "el/utils/math";

import { Item } from "el/editor/items/Item";
import BaseStore from "el/sapa/BaseStore";
import { registAlias, registElement } from "el/sapa/functions/registElement";
import { isString } from "el/sapa/functions/func";

import theme from "el/editor/ui/theme";

import { TimelineSelectionManager } from "./TimelineSelectionManager";
import { SelectionManager } from "./SelectionManager";
import { ComponentManager } from "./ComponentManager";
import { CommandManager } from "./CommandManager";
import { ShortCutManager } from "./ShortCutManager";
import { ConfigManager } from "./ConfigManager";
import { HistoryManager } from "./HistoryManager";
import { SnapManager } from "./SnapManager";
import { KeyBoardManager } from "./KeyboardManager";
import { ViewportManager } from "./ViewportManager";
import { StorageManager } from "./StorageManager";
import { CursorManager } from "./CursorManager";
import { AssetManager } from "./AssetManager"; 
import { PluginManager } from "./PluginManager";
import { RendererManager } from "./RendererManager";
import { InjectManager } from "./InjectManager";
import { I18nManager } from "./I18nManager";
import { ModelManager } from './ModelManager';
import { ModeViewManager } from './ModeViewManager';
import { PathKitManager } from "./PathKitManager";
import { SegmentSelectionManager } from "./SegmentSelectionManager";
import { LockManager } from "./LockManager";
import { VisibleManager } from "./VisibleManager";
import { CommandMaker } from "./CommandMaker";
import { ClipboardManager } from './ClipboardManager';
import { IconManager } from './IconManager';


export const EDIT_MODE_SELECTION = 'SELECTION';
export const EDIT_MODE_ADD = 'ADD';

const DEFAULT_THEME = 'dark'


export class Editor {


  /**
   * 
   * @param {object} [opt={}] 
   * @param {BaseStore} opt.store  Message 처리기 
   */
  constructor() {

    this.EDITOR_ID = uuid();

    this.projects = []
    this.popupZIndex = 10000;
    this.canvasWidth = 100000;
    this.canvasHeight = 100000;
    this.symbols = {}
    this.images = {}
    this.openRightPanel = true;
    this.mode = EDIT_MODE_SELECTION

    this.loadManagers();

  }

  /**
   * 에디터에서 공통으로 필요한 Manager 들을 로드 한다. 
   */
  loadManagers() {

    this.store = new BaseStore(this);
    this.config = new ConfigManager(this);
    this.snapManager = new SnapManager(this);
    this.commands = new CommandManager(this);
    this.shortcuts = new ShortCutManager(this);
    this.selection = new SelectionManager(this);
    this.segmentSelection = new SegmentSelectionManager(this);
    this.timeline = new TimelineSelectionManager(this);
    this.history = new HistoryManager(this);
    this.keyboardManager = new KeyBoardManager(this);
    this.viewport = new ViewportManager(this);
    this.storageManager = new StorageManager(this);
    this.cursorManager = new CursorManager(this);
    this.assetManager = new AssetManager(this);
    this.injectManager = new InjectManager(this);
    this.components = new ComponentManager(this);
    this.pluginManager = new PluginManager(this);
    this.renderers = new RendererManager(this);
    this.i18n = new I18nManager(this);
    this.modelManager = new ModelManager(this);
    this.modeViewManager = new ModeViewManager(this);
    this.pathKitManager = new PathKitManager(this);
    this.lockManager = new LockManager(this);
    this.visibleManager = new VisibleManager(this);
    this.clipboard = new ClipboardManager(this);
    this.iconManager = new IconManager(this);

    this.initPlugins();
    this.initStorage();
  }

  initStorage() {
    this.locale = this.loadItem('locale') || 'en_US'
    this.layout = this.loadItem('layout') || 'all'
  }

  createProject () {
    return this.createModel({ itemType: 'project' })
  }

  getI18nMessage(key, params = {}, locale) {
    return this.i18n.get(key, params, locale || this.locale)
  }

  $i18n(key, params = {}, locale) {
    return this.getI18nMessage(key, params, locale);
  }  

  hasI18nkey(key, locale) {
    return this.i18n.hasKey(key, locale || this.locale)
  }

  initI18nMessage(root = '') {
    return (key, params = {}, locale) => {
      const i18nKey = `${root}.${key}`;
      if (this.hasI18nkey(i18nKey, locale)) {
        return this.i18n(`${root}.${key}`, params, locale)
      } else {
        return this.i18n(`${key}`, params, locale)
      }
    }
  }

  setLocale(locale = 'en_US') {
    this.locale = locale;
    this.saveItem('locale', this.locale);
  }

  setLayout(layout = 'all') {
    this.layout = layout;
    this.saveItem('layout', this.layout);
  }

  setUser(user) {
    this.user = user;
  }

  initPlugins(options = {}) {
    this.pluginManager.initializePlugin(options);
  }

  themeValue(key, defaultValue = '') {
    return theme[this.config.get('editor.theme')][key] || defaultValue;
  }

  changeMode(mode = EDIT_MODE_SELECTION) {
    this.mode = mode;   // add or selection  
  }

  isMode(mode) {
    return this.mode === mode;
  }

  isAddMode() {
    return this.isMode(EDIT_MODE_ADD)
  }

  // 팝업의 zindex 를 계속 높여 주어 
  // 최근에 열린 팝업이 밑으로 가지 않게 한다. 
  get zIndex() {
    return this.popupZIndex++
  }

  /**
   * 현재 Mouse Up 상태인지 체크 
   * 
   * @returns {boolean}
   */
  get isPointerUp() {
    const e = this.config.get('bodyEvent');
    if (!e) return true;
    
    if (e.type === 'pointerup' ) return true; 
    else if (e.type === 'pointermove' &&  e.buttons === 0) return true; 

    return false; 
  }

  get isPointerDown () {
    return !this.isPointerUp
  }

  get isPointerMove() {
    if (!this.config.get('bodyEvent')) return false;
    return this.config.get('bodyEvent').type === 'pointermove'
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
    const [name, callback, ...rest] = args;
    return this.store.on(name, callback, this, ...rest);
  }

  off(...args) {
    this.store.off(...args);
  }

  offAll(...args) {
    this.store.offAll(...args);
  }

  debug(...args) {
    // if (this.config.get('debug')) {
    //   console.log(...args);
    // }
  }

  command(command, message, ...args) {

    if (this.isPointerUp) {
      return this.store.emit(`history.${command}`, message, ...args);
    } else {
      return this.store.emit(command, ...args);
    }
  }

  /**
   * store 의 nextTick 을 실행한다. 
   * 
   * @param {Function} callback 
   */
  nextTick(callback) {
    if (this.store) {
      this.store.nextTick(callback);
    }
  }

  /**
   * get model by id
   *
   * @param {string} id
   */
  get(id) {
    return this.modelManager.get(id);
  }

  replaceLocalUrltoRealUrl(str) {

    var project = this.selection.currentProject;
    var images = {}

    project.images.forEach(a => {
      if (str.indexOf(a.local) > -1) {
        images[a.local] = a.original
      }
    })

    Object.keys(images).forEach(local => {
      if (str.indexOf(local) > -1) {
        str = str.replace(new RegExp(local, 'g'), images[local])
      }
    })

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
    return `__els__.${this.config.get('store.key')}`;
  }

  saveItem(key, value) {
    window.localStorage.setItem(`${this.storeKey}.${key}`, JSON.stringify(value));
  }

  loadItem(key) {
    return JSON.parse(window.localStorage.getItem(`${this.storeKey}.${key}`) || JSON.stringify(""))
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
    })
  }

  registerMenuItem(target, obj = {}) {
    this.injectManager.registerMenuItem(target, obj);
    this.registerElement(obj);
  }

  registerComponent(name, component) {
    this.components.registerComponent(name, component)
  }

  registerItem(name, item) {
    this.registerComponent(name, item);
  }

  registerInspector(name, inspectorCallback) {
    this.components.registerInspector(name, inspectorCallback);
  }

  registerRenderer(rendererType, name, rendererInstance) {
    this.renderers.registerRenderer(rendererType, name, rendererInstance)
  }

  registerRendererType(rendererType, rendererTypeInstance) {
    this.renderers.registerRendererType(rendererType, rendererTypeInstance)
  }

  getRendererInstance(rendererType, itemType) {
    return this.renderers.getRendererInstance(rendererType, itemType);
  }

  renderer(rendererType) {
    return this.renderers.getRenderer(rendererType);
  }

  get html () {
    return this.renderer('html');
  }

  get svg () {
    return this.renderer('svg');
  }
  
  get json () {
    return this.renderer('json');
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
    plugins.forEach(p => this.registerPlugin(p));
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

  registerIcon (itemType, iconOrFunction) {
    this.iconManager.registerIcon(itemType, iconOrFunction);
  }

  /**
   * 
   * @param {string} id 
   * @returns {BaseModel}
   */
  get (id) {
    return this.modelManager.get(id);
  }
}
