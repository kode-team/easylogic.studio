import { LOAD, CONFIG, BIND, Dom, POINTERSTART } from "sapa";

import ContextMenuRenderer from "./ContextMenuRenderer";
import "./ContextMenuView.scss";

import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Length } from "elf/editor/unit/Length";

export class ContextMenuView extends EditorElement {
  template() {
    return <div class="elf--context-menu-view"></div>;
  }

  [BIND("$el")]() {
    const contextMenuOpenInfo = this.$context.config.get("context.menu.open");

    if (!contextMenuOpenInfo) {
      return;
    }

    // 열리는 시점에 뷰 영역을 넘어가는지 체크해서 넘어가면 위치를 바꿔준다.
    // 특히 direction 을 지정해줘야 할수도 있다.

    return {
      style: {
        left: Length.px(contextMenuOpenInfo.x),
        top: Length.px(contextMenuOpenInfo.y + 10),
      },
    };
  }

  [LOAD("$el")]() {
    const info = this.$context.config.get("context.menu.open");
    if (!info) return;
    const items = this.$menu.getTargetMenu(info.target);
    return <ContextMenuRenderer items={[{ type: "dropdown", items }]} />;
  }

  [CONFIG("context.menu.open")]() {
    this.refresh();

    if (this.$context.config.get("context.menu.open")) {
      this.$el.show();
    } else {
      this.$el.hide();
    }
  }

  close() {
    this.$el.hide();
    this.$context.config.set("context.menu.open", null);
  }

  [POINTERSTART("document")](e) {
    const $target = Dom.create(e.target);

    const $dropdown = $target.closest("elf--context-menu-view");

    if (!$dropdown) {
      this.close();
    } else if ($dropdown.el !== this.$el.el) {
      this.close();
    }
  }
}
