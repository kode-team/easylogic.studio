import { debounce, isFunction } from "./functions/func";
import { ACTION_PREFIX, GETTER_PREFIX } from "./Store";

export const PREVENT = "PREVENT";

export default class BaseStore {
  constructor(opt) {
    this.cachedCallback = {};
    this.callbacks = [];
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

  removeAction(context) {
    this.callbacks = this.callbacks.filter(it => {
      return it.context != context; 
    })
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

  mapGetters(...args) {
    return args.map(actionName => {
      return this.standalone.getters[actionName];
    });
  }

  mapActions(...args) {
    return args.map(actionName => {
      return this.standalone.actions[actionName];
    });
  }

  mapDispatches(...args) {
    return args.map(actionName => {
      return this.standalone.dispatches[actionName];
    });
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

  on(event, originalCallback, context, delay = 0) {
    var callback = delay > 0 ? debounce(originalCallback, delay) : originalCallback;
    this.callbacks.push({ event, callback, context, originalCallback });
  }

  off(event, originalCallback) {
    if (arguments.length == 0) {
      this.callbacks = [];
      this.cachedCallback = {};
    } else if (arguments.length == 1) {
      this.callbacks = this.callbacks.filter(f => {
        return f.event != event;
      });
      this.cachedCallback = {};
    } else if (arguments.length == 2) {
      this.callbacks = this.callbacks.filter(f => {
        return !(f.event == event && f.originalCallback == originalCallback);
      });
      this.cachedCallback = {};
    }
  }

  getCachedCallbacks (event) {
    if (!this.cachedCallback[event]) {
      this.cachedCallback[event] = this.callbacks.filter(
        f => f.event === event
      );
    }

    return this.cachedCallback[event]
  }

  sendMessage(source, event, $2, $3, $4, $5) {
    setTimeout(() => {
      var list = this.getCachedCallbacks(event);
      if (list) {
        list
        .filter(f => f.originalCallback.source !== source)
        .forEach(f => {
          // console.log(f);
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

  // makeCachedCallback(event) {

  //   this.cachedCallback[event] = this.callbacks.filter(
  //     f => f.event === event
  //   );

  //   console.log(this.cachedCallback, event);
  // }

  emit($1, $2, $3, $4, $5) {
    // var event = $1;
    // console.log('emit', event, this.source);
    // this.makeCachedCallback(event);
    this.sendMessage(this.source, $1, $2, $3, $4, $5);
  }

  trigger($1, $2, $3, $4, $5) {
    // var event = $1;

    // this.makeCachedCallback(event);
    this.triggerMessage(this.source, $1, $2, $3, $4, $5);
  }
}
