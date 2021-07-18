import "../../scss/index.scss";
import "./layout.scss"
import CanvasEditor from "./CanvasEditor";
import * as App from 'el/base/App'
import exportLibrary from "export-library/";

export default {
  createCanvasEditor(opts = { type: "white" }) {

    return App.start(CanvasEditor, {
      ...opts
    });
  },
  ...exportLibrary
};
