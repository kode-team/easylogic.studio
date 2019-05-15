import CSSEditor from "./editor/index";
import * as App from "../util/App";
import cssProperty from "../editor/css-property";
import imageResource from "../editor/image-resource";
import parse from "../editor/parse";

export default {
  createCSSEditor(opts = { type: "white" }) {
    return App.start({
      components: { CSSEditor },
      template: `<CSSEditor ${opts.embed ? 'embed="true"' : ""} />`,
      ...opts
    });
  },
  CSSEditor,
  ...cssProperty,
  ...imageResource,
  ...parse
};
