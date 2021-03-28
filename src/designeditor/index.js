import DesignEditor from "./DesignEditor";
import * as App from 'el/base/App'

import { EditorElement } from "el/editor/ui/common/EditorElement";

export default {
  createDesignEditor(opts = { type: "white" }) {

    return App.start(EditorElement, {
      className: 'designeditor',
      container: document.getElementById('app'),
      template: /*html*/`
        <div>
          <object refClass="DesignEditor" />
        </div>
      `,
      ...opts
    });
  },
  DesignEditor,
};
