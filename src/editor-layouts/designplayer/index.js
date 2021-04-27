import DesignPlayer from "./DesignPlayer";
import * as App from 'el/base/App'

import 'el/plugins';
import { EditorElement } from "el/editor/ui/common/EditorElement";

export default {
  createDesignPlayer(opts = { type: "white" }) {
    return App.start(EditorElement,{
      className: 'designeditor',
      container: document.getElementById('app'),
      template: /*html*/`
        <div>
          <object refClass="DesignPlayer" />
        </div>
      `,
      ...opts
    });
  },
  DesignPlayer,
};
