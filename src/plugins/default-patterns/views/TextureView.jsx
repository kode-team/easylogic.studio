import { EditorElement } from "elf/editor/ui/common/EditorElement";

import "./TextureView.scss";
import { Tabs } from "elf/editor/ui/view/Tabs";
// import { variable } from "sapa";

export default class TextureView extends EditorElement {
  components() {
    return {
      Tabs,
    };
  }

  template() {
    const isItemMode = this.$config.get("editor.design.mode") === "item";

    return (
      <div class="elf--texture">
        <object
          refClass="Tabs"
          ref="$tab"
          selectedValue={isItemMode ? "svg" : "css"}
          onchange={(value) => {
            this.$config.set("inspector.selectedValue", value);
          }}
        >
          {isItemMode ? (
            ""
          ) : (
            <object refClass="TabPanel" value="css" title="CSS">
              <object refClass="CSSTextureView" />
            </object>
          )}

          <object refClass="TabPanel" value="svg" title="SVG">
            <object refClass="SVGTextureView" />
          </object>
        </object>
      </div>
    );
  }
}
