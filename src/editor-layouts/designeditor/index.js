import "../../scss/index.scss";
import DesignEditor from "./DesignEditor";
import * as App from 'el/base/App'

export default {
  createDesignEditor(opts = { type: "white" }) {

    return App.start(DesignEditor, {
      ...opts
    });
  },
};
