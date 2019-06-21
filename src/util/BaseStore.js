import { debounce, isFunction } from "./functions/func";
import { ACTION_PREFIX, GETTER_PREFIX } from "./Store";

export const PREVENT = "PREVENT";

export default class BaseStore {
  constructor(opt) {
    this.cachedCallback = {};
    this.callbacks = {};
    this.commandes = [];
    this.actions = [];
    this.getters = [];
    this.modules = opt.modules || [];
    this.standalone = {
      getters: {},
      actions: {},
      dispatches: {}
    };

    this.initialize();
  }

  initialize() {
    this.initializeModule();
  }

  initializeModule() {
    this.modules.forEach(ModuleClass => {
      this.addModule(ModuleClass);
    });
  }

  makeActionCallback(context, action, actionName) {
    var func = ($1, $2, $3, $4, $5) => {
      return context[action].call(context, this, $1, $2, $3, $4, $5);
    };

    func.context = context;
    func.displayName = actionName;

    return func;
  }

  action(action, context) {
    var actionName = action.substr(
      action.indexOf(ACTION_PREFIX) + ACTION_PREFIX.length
    );

    this.actions[actionName] = this.makeActionCallback(
      context,
      action,
      actionName
    );

    this.standalone.actions[actionName] = ($1, $2, $3, $4, $5) => {
      return this.run(actionName, $1, $2, $3, $4, $5);
    };
    this.standalone.dispatches[actionName] = ($1, $2, $3, $4, $5) => {
      return this.dispatch(actionName, $1, $2, $3, $4, $5);
    };
  }

  getter(action, context) {
    var actionName = action.substr(
      action.indexOf(GETTER_PREFIX) + GETTER_PREFIX.length
    );

    this.getters[actionName] = this.makeActionCallback(
      context,
      action,
      actionName
    );

    this.standalone.getters[actionName] = ($1, $2, $3, $4, $5) => {
      return this.read(actionName, $1, $2, $3, $4, $5);
    };
  }

  dispatch(action, $1, $2, $3, $4, $5) {
    var actionCallback = this.actions[action];

    if (actionCallback) {
      var ret = actionCallback($1, $2, $3, $4, $5);

      if (ret != PREVENT) {
        actionCallback.context.afterDispatch();
      }
    } else {
      throw new Error("action : " + action + " is not a valid.");
    }
  }

  run(action, $1, $2, $3, $4, $5) {
    var actionCallback = this.actions[action];

    if (actionCallback) {
      return actionCallback($1, $2, $3, $4, $5);
    } else {
      throw new Error("action : " + action + " is not a valid.");
    }
  }

  read(action, $1, $2, $3, $4, $5) {
    var getterCallback = this.getters[action];

    if (getterCallback) {
      return getterCallback($1, $2, $3, $4, $5);
    } else {
      throw new Error("getter : " + action + " is not a valid.");
    }
  }

  addModule(ModuleClass) {
    return new ModuleClass(this);
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
          .forEach(f => f.callback($2, $3, $4, $5));
      } else {
        console.warn(event, ' is not valid event');
      }


    }, 0);
  }


  runCommand(source, event, $2, $3, $4, $5) {

      var list = this.getCachedCallbacks(event);
      var results = []
      if (list) {
        results = list
          .filter(f => f.originalCallback.source === source)
          .filter((i, index) => index === 0)
          .map(f => f.callback($2, $3, $4, $5));
      } 

      return results[0]
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
