import EventMachine from "./EventMachine";
import { debounce, ifCheck, isFunction, throttle } from "./functions/func";

/**
 * @class BaseStore
 * @description BaseStore is the base class for all stores.
 * 
 */ 
export default class BaseStore {
  constructor(editor) {
    this.cachedCallback = {};
    this.callbacks = {};
    this.commandes = [];
    this.editor = editor;
  }

  getCallbacks(event) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }

    return this.callbacks[event]
  }

  setCallbacks(event, list = []) {
    this.callbacks[event] = list; 
  }

  debug (...args) {
    if (this.editor && this.editor.config.get('debug')) {
      console.debug(...args );
    }

  }

  /**
   * 메세지 등록 
   * 
   * @param {string} event 
   * @param {Function} originalCallback 
   * @param {EventMachine} context 
   * @param {number} debounceDelay 
   * @param {number} throttleDelay 
   * @param {boolean} enableAllTrigger
   * @param {boolean} enableSelfTrigger
   * @param {string[]} [beforeMethods=[]]
   * @returns {Function} off callback 
   */
  on(event, originalCallback, context, debounceDelay = 0, throttleDelay = 0, enableAllTrigger = false, enableSelfTrigger = false, beforeMethods = []) {
    var callback = originalCallback;
    
    if (debounceDelay > 0)  callback = debounce(originalCallback, debounceDelay);
    else if (throttleDelay > 0)  callback = throttle(originalCallback, throttleDelay);

    if (beforeMethods.length) {
      callback = ifCheck(callback, context, beforeMethods);
    }

    this.getCallbacks(event).push({ event, callback, context, originalCallback, enableAllTrigger, enableSelfTrigger });

    this.debug('add message event', event, context.sourceName );

    return () => {
      this.off(event, originalCallback);
    }
  }

  /**
   * 메세지 해제
   * 
   * @param {string} event 
   * @param {*} originalCallback 
   */
  off(event, originalCallback) {

    this.debug('off message event', event );

    if (arguments.length == 1) {
      this.setCallbacks(event);
    } else if (arguments.length == 2) {      
      this.setCallbacks(event, this.getCallbacks(event).filter(f => {
        return f.originalCallback !== originalCallback
      }));
    }
  }

  offAll (context) {

    Object.keys(this.callbacks).forEach(event => {
      this.setCallbacks(event, this.getCallbacks(event).filter(f => {
        return f.context !== context;  
      }))
    })
    this.debug('off all message', context.sourceName );
  }

  getCachedCallbacks (event) {
    return this.getCallbacks(event);
  }

  sendMessage(source, event, ...args) {
    Promise.resolve().then(() => {
      var list = this.getCachedCallbacks(event);
      if (list) {

        for(var i = 0, len = list.length; i < len; i++) {
          const f = list[i];
          // console.log(source);
          if (f.enableSelfTrigger) continue;

          if (f.enableAllTrigger || f.originalCallback.source !== source) {
            f.callback.apply(f.context, args)  
          }
        }
      }

    });
  }

  nextSendMessage(source, callback, ...args) {
    Promise.resolve().then(() => {
      callback(...args)
    });
  }

  triggerMessage(source, event, ...args) {
    Promise.resolve().then(() => {
      var list = this.getCachedCallbacks(event);

      if (list) {
        for(var i = 0, len = list.length; i < len; i++) {
          const f = list[i];
          if (f.originalCallback.source === source) {
            f.callback.apply(f.context, args)  
          }
        }
      } else {
        console.warn(event, ' is not valid event');
      }


    });
  }

  emit(event, ...args) {

    if (isFunction(event)) {
      event(...args);
    } else {
      this.sendMessage(this.source, event, ...args);
    }

  }

  /**
   * 마이크로 Task 를 실행 
   * 
   * @param {Function} callback  마이크로Task 형식으로 실행될 함수 
   */
  nextTick (callback) {
    this.nextSendMessage(this.source, callback);
  }

  trigger(event, ...args) {

    if (isFunction(event)) {
      event(...args);
    } else {
      this.triggerMessage(this.source, event, ...args);
    }

  }
}
