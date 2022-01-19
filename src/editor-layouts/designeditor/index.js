import "../../scss/index.scss";
import "./layout.scss";
import DesignEditor from "./DesignEditor";
import * as App from 'el/sapa/App'
import exportLibrary from "export-library/";

export default {
  createDesignEditor(opts = { type: "white" }) {

    return App.start(DesignEditor, {
      ...opts
    });
  },
  ...exportLibrary
};
