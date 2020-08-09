import { debounce, throttle } from "./functions/func";

export default class BaseStore {
  constructor(opt = {}) {
    this.cachedCallback = {};
    this.callbacks = {};
    this.commandes = [];
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

  on(event, originalCallback, context, debounceDelay = 0, throttleDelay = 0) {
    var callback = originalCallback;
    
    if (debounceDelay > 0)  callback = debounce(originalCallback, debounceDelay);
    else if (throttleDelay > 0)  callback = throttle(originalCallback, throttleDelay);

    this.getCallbacks(event).push({ event, callback, context, originalCallback });
  }

  off(event, originalCallback) {

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
  }

  getCachedCallbacks (event) {
    return this.getCallbacks(event);
  }

  sendMessage(source, event, $2, $3, $4, $5) {
    Promise.resolve().then(() => {
      var list = this.getCachedCallbacks(event);
      if (list) {
        list
        .filter(f => f.originalCallback.source !== source)
        .forEach(f => {
          f.callback($2, $3, $4, $5)
        });
      }

    });
  }

  nextSendMessage(source, callback, $2, $3, $4, $5) {
    Promise.resolve().then(() => {
      callback($2, $3, $4, $5)
    });
  }

  triggerMessage(source, event, $2, $3, $4, $5) {
    Promise.resolve().then(() => {
      var list = this.getCachedCallbacks(event);
      if (list) {
        list
          .filter(f => f.originalCallback.source === source)
          .forEach(f => {      
            f.callback($2, $3, $4, $5)
          });
      } else {
        console.warn(event, ' is not valid event');
      }


    });
  }




  emit($1, $2, $3, $4, $5) {
    this.sendMessage(this.source, $1, $2, $3, $4, $5);
  }

  nextTick ($1, $2, $3, $4, $5) {
    this.nextSendMessage(this.source, $1, $2, $3, $4, $5);
  }

  trigger($1, $2, $3, $4, $5) {
    this.triggerMessage(this.source, $1, $2, $3, $4, $5);
  }

  execute($1, $2, $3, $4, $5){
    this.runCommand(this.source, $1, $2, $3, $4, $5);
  }
}
