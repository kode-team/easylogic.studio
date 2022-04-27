import { Dom } from "./functions/Dom";
import { registRootElementInstance } from "./functions/registElement";
import { UIElement } from "./UIElement";

/**
 * UIElement 렌더링 하기
 *
 * @param {UIElement|Function} ElementClass
 * @returns {UIElement}
 */
export const start = (ElementClass, opt) => {
  const $container = Dom.create(opt.container || document.body);

  const app = UIElement.createElementInstance(ElementClass, opt);

  app.render($container);

  registRootElementInstance(app);

  return app;
};
