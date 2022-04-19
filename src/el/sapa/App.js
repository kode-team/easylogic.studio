import Dom from "./functions/Dom";
import { registRootElementInstance } from "./functions/registElement";
import UIElement from "./UIElement";

/**
 * UIElement 렌더링 하기 
 * 
 * @param {UIElement} ElementClass
 * @returns {UIElement}
 */ 
export const start = async (ElementClass, opt) => {

  const $container = Dom.create(opt.container || document.body);

  const app = new ElementClass(opt, opt);

  await app.render($container);

  registRootElementInstance(app);

  return app; 
};