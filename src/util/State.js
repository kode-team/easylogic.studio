import { debounce, keyEach } from "./functions/func";
import { EMPTY_STRING } from "./css/types";

const DELEGATE_SPLIT = ".";

export default class State {
  constructor(masterObj, settingObj = {}) {
    this.masterObj = masterObj;
    this.settingObj = settingObj;
  }

  initialize() {
    this.settingObj = {};
  }

  update(obj) {
    keyEach(obj, (key, value) => {
      this.set(key, value);
    });
  }

  set(key, value, defaultValue = undefined) {
    this.settingObj[key] = value || defaultValue;
  }

  init(key, ...args) {
    if (!this.has(key)) {
      const arr = key.split(DELEGATE_SPLIT);

      const obj =
        this.masterObj.refs[arr[0]] || this.masterObj[arr[0]] || this.masterObj;
      const method = arr.pop();

      if (obj[method]) {
        const value = obj[method].apply(obj, args);

        this.set(key, value);
      }
    }
  }

  get(key, defaultValue = EMPTY_STRING) {
    this.init(key, defaultValue);

    return this.settingObj[key] || defaultValue;
  }

  has(key) {
    return !!this.settingObj[key];
  }
}
