import CSSEditor from "./editor/index";
import * as App from "../util/App";
export default {
  createCSSEditor(opts = { type: "white" }) {
    switch (opts.type) {
      default:
        return App.start({
          components: { CSSEditor },
          template: `<CSSEditor />`
        });
    }
  },
  CSSEditor
};
