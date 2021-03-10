import DesignEditor from "./DesignEditor";
import * as App from '@core/App'
import cssProperty from "../property-parser";
import imageResource from "../property-parser/image-resource";
import items from '@items';
import parse from '@parser';
import { Length } from "@unit/Length";

export default {
  createDesignEditor(opts = { type: "white" }) {
    return App.start({
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
  ...cssProperty,
  ...imageResource,
  ...items,
  ...parse,
  Length
};
