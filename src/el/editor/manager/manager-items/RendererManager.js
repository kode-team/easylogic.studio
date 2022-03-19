export class RendererManager {
  constructor(editor) {
    this.editor = editor;
    this.renderers = {} 
    this.rendererTypes = {}
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

  registerRendererType (rendererType, rendererTypeInstance) {

    if (this.rendererTypes[rendererType]) throw new Error('It has duplcated renderer type name. ' + name);
    this.rendererTypes[rendererType] = rendererTypeInstance
  }

  getRenderer(rendererType) {
    return this.rendererTypes[rendererType];
  }

  getRendererInstance(rendererType, name) {
    const typedRenderer = this.getRenderType(rendererType);
    return typedRenderer[name];
  }
};
