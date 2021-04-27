export const RendererManager = new class {
  constructor(opt = {}) {
    this.renderers = {} 
  }

  getRenderType(rendererType) {
    if (!this.renderers[rendererType]) {
      this.renderers[rendererType] = {}
    }

    return this.renderers[rendererType];
  }

  registerRenderer (rendererType, name, rendererInstance) {

    const typedRenderer = this.getRenderType(rendererType);

    if (typedRenderer[name]) throw new Error("It has duplicated renderer name. " + name);
    typedRenderer[name] = rendererInstance;
  }

  getRendererInstance(rendererType, name) {
    const typedRenderer = this.getRenderType(rendererType);
    return typedRenderer[name];
  }
}();
