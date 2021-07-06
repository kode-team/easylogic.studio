import "../../scss/index.scss";
import DesignPlayer from "./DesignPlayer";
import * as App from 'el/base/App'
import exportLibrary from "export-library/";

export default {
  createDesignPlayer(opts = { }) {

    return App.start(DesignPlayer, {
      ...opts
    });
  },
  ...exportLibrary
};
