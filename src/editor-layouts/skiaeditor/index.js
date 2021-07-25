import "../../scss/index.scss";
import "./layout.scss"
import SkiaEditor from "./SkiaEditor";
import * as App from 'el/base/App'
import exportLibrary from "export-library/";

export default {
  createSkiaEditor(opts = { type: "white" }) {

    return App.start(SkiaEditor, {
      ...opts
    });
  },
  ...exportLibrary
};
