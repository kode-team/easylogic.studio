import { EditorElement } from "el/editor/ui/common/EditorElement";
import { BIND } from "el/sapa/Event";
import { Tabs } from "el/editor/ui/view/Tabs";
import { TabPanel } from "el/editor/ui/view/TabPanel";

export default class Inspector extends EditorElement {
  afterRender() {
    this.$el.toggle(this.$config.get("editor.design.mode") === "design");
  }

  [BIND("$el")]() {
    return {
      style: {
        display:
          this.$config.get("editor.design.mode") === "design"
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
            selectedValue="style"
            onchange={(value) => {
              this.$config.set("inspector.selectedValue", value);
            }}
          >
            <TabPanel
              value="style"
              title={this.$i18n("inspector.tab.title.style")}
            >
              {this.$injectManager.generate("inspector.tab.style")}
              <div class="empty"></div>
            </TabPanel>
            <TabPanel
              value="transition"
              title={this.$i18n("inspector.tab.title.transition")}
            >
              {this.$injectManager.generate("inspector.tab.transition")}
              <div class="empty"></div>
            </TabPanel>
            <TabPanel
              value="code"
              title={this.$i18n("inspector.tab.title.code")}
            >
              {this.$injectManager.generate("inspector.tab.code")}
              <div class="empty"></div>
            </TabPanel>

            {this.$injectManager
              .getTargetMenuItems("inspector.tab")
              .map((it) => {
                const { value, title, loadElements } = it.class;

                return (
                  <TabPanel value={value} title={title} icon={it.icon}>
                    {loadElements.map((element) => craeteElement(element))}
                    {this.$injectManager.generate("inspector.tab." + it.value)}
                    <div class="empty"></div>
                  </TabPanel>
                );
              })}
          </Tabs>
        </div>
      </div>
    );
  }
}
