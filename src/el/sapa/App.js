import Dom from "./functions/Dom";
import UIElement from "./UIElement";

/**
 * UIElement 렌더링 하기 
 * 
 * @param {UIElement} ElementClass
 * @returns {UIElement}
 */ 
export const start = (ElementClass, opt) => {

  const $container = Dom.create(opt.container || document.body);

  const app = new ElementClass(opt, opt);

  app.render($container);

  return app; 
};