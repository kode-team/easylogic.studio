import DesignPlayer from "./DesignPlayer";
import * as App from '@sapa/App'
import cssProperty from "../property-parser";
import imageResource from "../property-parser/image-resource";
import items from '@items';
import parse from '@parser';
import { Length } from "@unit/Length";

export default {
  createDesignPlayer(opts = { type: "white" }) {
    return App.start({
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
  ...cssProperty,
  ...imageResource,
  ...items,
  ...parse,
  Length
};
