export const ComponentManager = new class {
  constructor(opt = {}) {
    this.components = {} 
  }

  registerComponent (name, Component) {
    this.components[name] = Component;
  }

  getComponentClass(name) {
    return this.components[name]
  }

  createComponent (name, obj = {}) {
    var ComponentClass = this.getComponentClass(name);
    if (!ComponentClass) {
      throw new Error(`${name} type is not valid.`)
    }
    return new ComponentClass(obj);
  }

}();
