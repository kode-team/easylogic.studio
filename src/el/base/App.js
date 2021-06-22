import Dom from "./Dom";

export const start = (UIElement, opt) => {

  const $container = Dom.create(opt.container || document.body);

  const app = new UIElement(opt, opt);

  app.render($container);

  return app; 
};