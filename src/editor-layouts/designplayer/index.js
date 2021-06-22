import DesignPlayer from "./DesignPlayer";
import * as App from 'el/base/App'

export default {
  createDesignPlayer(opts = { type: "white" }) {
    return App.start(DesignPlayer, {
      ...opts
    });
  },
  DesignPlayer,
};
