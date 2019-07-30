import { Config } from "./Config";
import { Selection } from "./Selection";

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
export const editor = new class {
  constructor() {
    this.config = new Config(this);
    this.selection = new Selection(this);
    this.projects = []     
    this.popupZIndex = 10000;
    this.scale = 1
    this.symbols = {}
    this.images = {}
    this.openRightPanel = true; 
    this.theme = 'light'
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
