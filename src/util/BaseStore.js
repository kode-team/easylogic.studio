import { debounce } from "./functions/func";

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

  on(event, originalCallback, context, delay = 0) {
    var callback = delay > 0 ? debounce(originalCallback, delay) : originalCallback;

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
    setTimeout(() => {
      var list = this.getCachedCallbacks(event);
      if (list) {
        list
        .filter(f => f.originalCallback.source !== source)
        .forEach(f => {
          f.callback($2, $3, $4, $5)
        });
      }

    }, 0);
  }

  triggerMessage(source, event, $2, $3, $4, $5) {
    setTimeout(() => {
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


    }, 0);
  }




  emit($1, $2, $3, $4, $5) {
    this.sendMessage(this.source, $1, $2, $3, $4, $5);
  }

  trigger($1, $2, $3, $4, $5) {
    this.triggerMessage(this.source, $1, $2, $3, $4, $5);
  }

  execute($1, $2, $3, $4, $5){
    this.runCommand(this.source, $1, $2, $3, $4, $5);
  }
}
