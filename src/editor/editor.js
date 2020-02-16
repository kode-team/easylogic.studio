import { Config } from "./Config";
import { Selection } from "./Selection";
import { TimelineSelection } from "./TimelineSelection";
import i18n from "../csseditor/i18n";
import { loadItem, saveItem } from "./util/Resource";
import theme from "../csseditor/ui/theme";
 
function blobToDataURL(blob) {
  return new Promise(function(resolve) {
    var fileReader = new FileReader();
    fileReader.onload = function(e) {
      // ATTENTION: to have the same result than the Flash object we need to split
      // our result to keep only the Base64 part
      resolve(e.target.result);
    };
    fileReader.readAsDataURL(blob);
  });
}

export const EDITOR_ID = "";

export const EDIT_MODE_SELECTION = 'SELECTION';
export const EDIT_MODE_ADD = 'ADD';

const DEFAULT_THEME = 'dark' 

export const editor = new class {
  constructor() {
    this.config = new Config(this);
    this.selection = new Selection();
    this.timeline = new TimelineSelection(this);
    this.projects = []     
    this.popupZIndex = 10000;
    this.scale = 1
    this.symbols = {}
    this.images = {}
    this.openRightPanel = true; 
    this.mode = EDIT_MODE_SELECTION
    this.addType = '' 
    this.locale = loadItem('locale') || 'en_US'

    this.components = {} 

    this.initTheme();
  }

  i18n (key, params = {}, locale) {
    return i18n.get(key, params, locale || this.locale)
  }

  hasI18nkey (key, locale) {
    return i18n.hasKey(key, locale || this.locale)
  }

  initI18n (root = '') {
    return (key, params = {}, locale) => {

      const i18nKey  = `${root}.${key}`;
      if (this.hasI18nkey(i18nKey, locale)) {
        return this.i18n(`${root}.${key}`, params, locale)
      } else {
        return this.i18n(`${key}`, params, locale)
      }

    }
  }

  setLocale (locale = 'en_US') {
    this.locale = locale; 
    saveItem('locale', this.locale);    
  }

  registerComponent (name, Component) {
    this.components[name] = Component;
  }

  getComponentClass(name) {
    return this.components[name]
  }

  createComponent (name, obj = {}) {
    var ComponentClass = this.getComponentClass(name);
    return new ComponentClass(obj);
  }

  setUser (user) {
    this.user = user; 
  }

  initTheme () {
    var theme = DEFAULT_THEME

    if (window.localStorage) {
      theme = window.localStorage.getItem('easylogic.studio.theme')

      theme = ['gray', 'light'].includes(theme) ? theme : DEFAULT_THEME;
    }

    this.theme =  theme || DEFAULT_THEME
    window.localStorage.setItem('easylogic.studio.theme', this.theme);
  }

  themeValue (key, defaultValue = '') {
    return theme[this.theme][key] || defaultValue;
  }

  changeMode (mode = EDIT_MODE_SELECTION) {
    this.mode = mode;   // add or selection  
  }

  isMode (mode) {
    return this.mode === mode; 
  }

  isAddMode () {
    return this.isMode(EDIT_MODE_ADD)
  }

  isSelectionMode () {
    return this.isMode(EDIT_MODE_SELECTION);
  }

  changeAddType (type = '', isComponent = false) {
    this.changeMode(EDIT_MODE_ADD);
    this.addType = type;
    this.isComponent = isComponent
  }

  changeTheme (theme) {
    theme = ['light', 'gray'].includes(theme) ? theme: 'dark';

    this.theme = theme; 
    window.localStorage.setItem('easylogic.studio.theme', theme);
  }

  // 팝업의 zindex 를 계속 높여 주어 
  // 최근에 열린 팝업이 밑으로 가지 않게 한다. 
  get zIndex () {
    return this.popupZIndex++
  }

  getFile (url) {
    return this.images[url] || url;
  }

  setStore($store) {
    this.$store = $store;
  }

  send(...args) {
    this.emit(...args);
  }

  emit(...args) {
    if (this.$store) {
      this.$store.source = "EDITOR_ID";
      this.$store.emit(...args);
    }
  }

  load (projects = []) {
    this.projects = projects
  }

  /**
   * add item
   *
   * @param {string} parentId
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
   * get item
   *
   * @param {String} key
   */
  get(index) {
    return this.projects[index];
  }

}();
