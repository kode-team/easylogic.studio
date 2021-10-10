import { EditorElement } from 'el/editor/ui/common/EditorElement';

import './TextureView.scss';
import { Tabs } from 'el/editor/ui/view/Tabs';
import { variable } from 'el/sapa/functions/registElement';

export default class TextureView extends EditorElement {

  components() {
    return {
      Tabs
    }
  }

  template() {

    const isItemMode = this.$config.get('editor.design.mode') === 'item';

    return /*html*/`<div class='elf--texture'>
      <object refClass="Tabs" 
        ref="$tab" 
        ${variable({
          selectedValue: isItemMode ? 'svg' : 'css',
          onchange: (value) => {
            this.$config.set("inspector.selectedValue", value);
          }
        })}
      >

        ${isItemMode ? '' : /*html*/`
          <object refClass="TabPanel" value="css" title="CSS">
            <object refClass="CSSTextureView" />
          </object>
        `}


        <object refClass="TabPanel" value="svg" title="SVG">
          <object refClass="SVGTextureView" />
        </object>            
      </object>
    </div>`;
  }

}