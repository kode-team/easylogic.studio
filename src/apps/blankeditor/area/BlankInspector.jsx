import { BIND, createElement } from "sapa";

import { DesignMode } from "elf/editor/types/editor";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { TabPanel, Tabs } from "elf/ui";

export default class BlankInspector extends EditorElement {
  afterRender() {
    this.$el.toggle(this.$config.is("editor.design.mode", DesignMode.DESIGN));
  }

  [BIND("$el")]() {
    return {
      style: {
        display: this.$config.is("editor.design.mode", DesignMode.DESIGN)
          ? "block"
          : "none",
      },
    };
  }

  template() {
    return (
      <div class="feature-control inspector">
        <div>
          <Tabs
            ref="$tab"
            selectedValue={this.$config.get("inspector.selectedValue")}
            onchange={(value) => {
              this.$config.set("inspector.selectedValue", value);
            }}
          >
            {this.$injectManager.getTargetUI("inspector.tab").map((it) => {
              const { value, title, icon, loadElements = [] } = it.class;

              return (
                <TabPanel value={value} title={title} icon={icon}>
                  <div style="display: flex: flex-direction: column;">
                    {loadElements?.map((element) => createElement(element))}
                    {this.$injectManager.generate("inspector.tab." + value)}
                    <div class="empty" style="order: 1000000;"></div>
                  </div>
                </TabPanel>
              );
            })}
          </Tabs>
        </div>
      </div>
    );
  }
}
