import CSSEditor from "./editor/index";
import * as App from '../util/App'
import cssProperty from "../editor/css-property";
import imageResource from "../editor/image-resource";
import items from '../editor/items';
import parse from '../editor/parse';
import { Length } from "../editor/unit/Length";


export default {
  createCSSEditor(opts = { type: "white" }) {
    return App.start({
      components: { CSSEditor },
      template: /*html*/`<CSSEditor ${opts.embed ? 'embed="true"' : ""} />`,
      ...opts
    });
  },
  CSSEditor,
  ...cssProperty,
  ...imageResource,
  ...items,
  ...parse,
  Length
};
