import CSSEditor from "./CSSEditor";
import * as App from '@core/App'
import cssProperty from "../property-parser";
import imageResource from "../property-parser/image-resource";
import items from '@items';
import parse from '@parser';
import { Length } from "@unit/Length";


export default {
  createCSSEditor(opts = { type: "white" }) {
    return App.start({
      components: { CSSEditor },
      template: /*html*/`<div><CSSEditor /></div>`,
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
