import SingleEditor from "./SingleEditor";
import * as App from 'el/base/App'

import { EditorElement } from "el/editor/ui/common/EditorElement";

export default {
  createSingleEditor(opts = { type: "white" }) {

    return App.start(EditorElement, {
      className: 'designeditor',
      container: document.getElementById('app'),
      template: /*html*/`
        <div>
          <object refClass="SingleEditor" />
        </div>
      `,
      ...opts
    });
  },
  SingleEditor,
};
