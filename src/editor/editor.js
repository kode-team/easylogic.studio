import { Config } from "./Config";
import { Selection } from "./Selection";
import { TimelineSelection } from "./TimelineSelection";

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

    this.initTheme();
  }

  initTheme () {
    var theme = DEFAULT_THEME

    if (window.localStorage) {
      theme = window.localStorage.getItem('easylogic.studio.theme')

      theme = theme === 'light' ? 'light' : DEFAULT_THEME;
    }

    this.theme =  theme || DEFAULT_THEME
    window.localStorage.setItem('easylogic.studio.theme', this.theme);
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

  changeAddType (type = '') {
    this.changeMode(EDIT_MODE_ADD);
    this.addType = type;
  }

  changeTheme (theme) {
    theme = theme === 'light' ? 'light': 'dark';

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
