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

export async function renderToString(ElementClass, opt) {
  const app = UIElement.createElementInstance(ElementClass, opt);
  // server 인지 확인
  app.setServer(true);
  const instance = await app.render();

  return instance.html;
}
