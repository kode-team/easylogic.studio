import { createElement } from "sapa";

import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { TabPanel, Tabs } from "elf/ui";

export default class BlankLayerTab extends EditorElement {
  template() {
    return (
      <div class="layer-tab">
        <Tabs
          ref="$tab"
          type="side"
          direction="left"
          selectedValue={this.$config.get("layertab.selectedValue")}
          onchange={(value) => {
            this.$config.set("layertab.selectedValue", value);
          }}
        >
          {this.$injectManager.getTargetUI("layertab.tab").map((it) => {
            const { value, title, icon, loadElements = [] } = it.class;

            return (
              <TabPanel value={value} title={title} icon={icon}>
                <div style="display: flex: flex-direction: column;">
                  {loadElements?.map((element) => createElement(element))}
                  {this.$injectManager.generate("layertab.tab." + value)}
                  <div class="empty" style="order: 1000000;"></div>
                </div>
              </TabPanel>
            );
          })}
        </Tabs>
      </div>
    );
  }
}
