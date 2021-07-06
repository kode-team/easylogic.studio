import { uuid } from "el/base/functions/math";

import { Item } from "el/editor/items/Item";
import BaseStore from "el/base/BaseStore";
import { registElement } from "el/base/registElement";
import { isArray, isString } from "el/base/functions/func";


import i18n from "../../i18n";
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
import { MenuItemManager } from "./MenuItemManager";


export const EDITOR_ID = "";

export const EDIT_MODE_SELECTION = 'SELECTION';
export const EDIT_MODE_ADD = 'ADD';

const DEFAULT_THEME = 'dark'


export const Editor = new class {


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
    this.modeView = 'CanvasView';
    this.addComponentType = ''
    this.locale = this.loadItem('locale') || 'en_US'
    this.layout = this.loadItem('layout') || 'all'

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
    this.timeline = new TimelineSelectionManager(this);
    this.history = new HistoryManager(this);
    this.keyboardManager = new KeyBoardManager(this);
    this.viewport = new ViewportManager(this);
    this.storageManager = new StorageManager(this);
    this.cursorManager = new CursorManager(this);
    this.assetManager = new AssetManager(this);
    this.menuItemManager = new MenuItemManager(this);
    this.components = ComponentManager;
    this.plugins = PluginManager;
    this.renderers = RendererManager


    this.initTheme();
    this.initPlugins();
    this.initData();
  }

  initData() {
    this.projects = [this.createProject()]

    this.selection.selectProject(this.projects[0])
  }

  createProject () {
    return this.createItem({ itemType: 'project' })
  }

  i18n(key, params = {}, locale) {
    return i18n.get(key, params, locale || this.locale)
  }

  hasI18nkey(key, locale) {
    return i18n.hasKey(key, locale || this.locale)
  }

  initI18n(root = '') {
    return (key, params = {}, locale) => {

      const i18nKey = `${root}.${key}`;
      if (this.hasI18nkey(i18nKey, locale)) {
        return this.$i18n(`${root}.${key}`, params, locale)
      } else {
        return this.$i18n(`${key}`, params, locale)
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

  initTheme() {
    var theme = DEFAULT_THEME

    if (window.localStorage) {
      theme = window.localStorage.getItem('easylogic.studio.theme')

      theme = ['dark', 'light', 'toon'].includes(theme) ? theme : DEFAULT_THEME;
    }

    this.theme = theme || DEFAULT_THEME
    window.localStorage.setItem('easylogic.studio.theme', this.theme);
  }

  initPlugins(options = {}) {
    this.plugins.initializePlugin(this, options);
  }

  themeValue(key, defaultValue = '') {
    return theme[this.theme][key] || defaultValue;
  }

  changeMode(mode = EDIT_MODE_SELECTION) {
    this.mode = mode;   // add or selection  
  }

  changeModeView(modeView = 'CanvasView') {
    this.modeView = modeView;
  }

  isMode(mode) {
    return this.mode === mode;
  }

  isAddMode() {
    return this.isMode(EDIT_MODE_ADD)
  }

  /**
   * editor 의 모드를 
   */
  isSelectionMode() {
    return this.isMode(EDIT_MODE_SELECTION);
  }

  changeAddType(type = '', isComponent = false) {
    this.changeMode(EDIT_MODE_ADD);
    this.addComponentType = type;
    this.isComponent = isComponent
  }

  /**
   * Theme 을 변경한다. 
   * 
   * @param {string} theme 
   */
  changeTheme(theme) {
    theme = ['light', 'toon'].includes(theme) ? theme : 'dark';

    this.theme = theme;
    window.localStorage.setItem('easylogic.studio.theme', theme);
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
    if (!this.config.get('bodyEvent')) return true;
    return this.config.get('bodyEvent').type === 'pointerup'
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
    this.store.source = "EDITOR_ID";
    this.store.emit(...args);
  }

  on(...args) {
    const [name, callback, ...rest] = args;
    this.store.on(name, callback, this, ...rest);
  }

  off(...args) {
    this.store.off(...args);
  }

  offAll(...args) {
    this.store.offAll(...args);
  }

  debug(...args) {
    if (this.config.get('debug')) {
      console.log(...args);
    }
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
   * project 리스트를 설정한다. 
   * 
   * @param {Item[]} projects 
   */
  load(projects = []) {
    this.projects = projects;
  }

  /**
   * Project 추가 하기 
   * add project 
   *
   * @param {Item} item
   * @return {Item}
   */
  add(item) {
    this.projects.push(item);
    return item;
  }

  /**
   * remove Item  with all children
   *
   * @param {string} id
   */
  remove(index) {
    this.projects.splice(index, 1);
  }


  clear() {
    this.projects = [];
  }

  /**
   * get project 
   *
   * @param {number} index
   */
  get(index) {
    return this.projects[index];
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

  replaceLocalUrltoId(str) {

    var projects = this.projects;
    var images = {}

    projects.forEach(project => {

      project.images.forEach(a => {
        if (str.indexOf(a.local) > -1) {
          images[a.local] = '#' + a.id
        }
      })
    })


    Object.keys(images).forEach(local => {
      if (str.indexOf(local) > -1) {
        str = str.replace(new RegExp(local, 'g'), images[local])
      }
    })

    return str;
  }

  makeResource(json) {
    var result = JSON.stringify(json)

    // image check 
    result = this.replaceLocalUrltoId(result);

    return result;
  }

  /** 
   * item 목록을 json 으로  를 한다. 
   * 
   * 이때 parent는  parentId 로 치환된다. 
   * 
   * deserialize 할 때 parentId 에 맞는 parent 를 복구 시켜준다. 
   * 
   * @param {Item[]} items
   * @returns string
   */
  serialize(items = []) {

    const newItems = []

    items.forEach(it => {
      let json = it.toJSON();

      // parent 객체를 id 로 치환 
      json._parentId = it.parent ? it.parent.id : undefined;

      // parent 안에서 나의 위치 저장 (z-index 관련해서 순서를 지켜야함)
      json._positionInParent = it.positionInParent;

      newItems.push(json)
    })

    return JSON.stringify(newItems);
  }

  /**
   * itemObject (객체)를 가지고 itemType 에 따른  실제 Component 객체를 생성해준다. 
   * 
   * @param {object} itemObject 
   * @param {Boolean} isRecoverPosition 
   */
  createItem(itemObject, isRecoverPosition = false) {


    if (itemObject._parentId) {
      itemObject.parent = this.searchItem(itemObject._parentId);
      delete itemObject._parentId;
    }

    itemObject.layers = (itemObject.layers || []).map(it => {
      return this.createItem(it);
    })

    const item = this.components.createComponent(itemObject.itemType, itemObject);

    if (isRecoverPosition) {
      item.parent.setPositionInPlace(itemObject._positionInParent, item);
    }

    return item;
  }

  /**
   * id 로 객체를 탐색한다. 
   * 모든 프로젝트를 탐색하도록 한다. 
   * 
   * @param {string|string[]} id 
   * @return {string} JSON 문자열 
   */
  searchItem(id) {
    let ids = []
    if (isString(id)) {
      ids.push(id);
    } else if (isArray(id)) {
      ids = [...id];
    }

    const project = this.selection.currentProject;
    let results = project.getSearchedIndexItemList(ids).filter(Boolean);
    return results[0]
  }

  /**
   * JSON 형태로 serialize 된 객체를 실제 Item 객체로 복원한다. 
   * 
   * @param {string} jsonString 
   * @param {Boolean} isRecoverPosition 객체를 복구 시킬 때 parent 상에서 위치도 같이 복구할지 결정, true 는 위치 복구 
   * @returns {Item[]}
   */
  deserialize(jsonString, isRecoverPosition = false) {
    let items = JSON.parse(jsonString) || [];

    return items.map(it => this.createItem(it, isRecoverPosition));
  }

  saveResource(key, value) {
    window.localStorage.setItem(`easylogic.studio.${key}`, this.makeResource(value));
  }

  saveItem(key, value) {
    window.localStorage.setItem(`easylogic.studio.${key}`, JSON.stringify(value));
  }

  loadResource(key) {
    return this.assetManager.revokeResource(window.localStorage.getItem(`easylogic.studio.${key}`))
  }

  loadItem(key) {
    return JSON.parse(window.localStorage.getItem(`easylogic.studio.${key}`) || JSON.stringify(""))
  }

  registElement(obj) {
    registElement(obj);
  }

  registerMenuItem(target, obj) {
    this.menuItemManager.registerMenuItem(target, obj);
    this.registElement(obj);
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

  registerCommand(commandObject) {
    this.commands.registerCommand(commandObject);
  }

  registerShortCut(shortcut) {
    this.shortcuts.registerShortCut(shortcut);
  }

  /**
   * 
   * @param {Function} createPluginFunction  
   */
  registerPlugin(createPluginFunction) {
    PluginManager.registerPlugin(createPluginFunction);
  }

  registerPluginList(plugins = []) {
    plugins.forEach(p => this.registerPlugin(p));
  }


}();
