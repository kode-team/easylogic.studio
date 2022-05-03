import { LOAD, createComponent, DOMDIFF, CLICK } from "sapa";

import { EditorElement } from "elf/editor/ui/common/EditorElement";

export class TreeModel {
  constructor() {
    this.items = [];
  }

  add(item) {
    this.items.push(item);
  }

  remove(item) {
    this.items = this.items.filter((i) => i !== item);
  }
}

export class TreeProvider {
  constructor() {}

  async getRoot() {
    return [];
  }

  async getChildren(element) {
    return await element;
  }

  async getParent(element) {
    return await element.parent;
  }

  async getTreeItem(element) {
    return {
      label: element.label,
      icon: element.icon,
      element: element,
      collapased: element.collapsed,
      command: {
        title: "",
        command: "tree.select",
        args: [element],
      },
    };
  }

  async traverse() {
    return await [...(await this.getRoot())];
  }
}

export class TreeItem extends EditorElement {
  components() {
    return {
      TreeItem,
    };
  }
  initState() {
    return {
      item: this.props.item,
    };
  }
  template() {
    console.log(this.state.item);

    return (
      <div class="tree-item">
        <div class="tree-item-label" ref="$label">
          <span class="tree-item-icon">
            <span class="tree-item-icon-image"></span>
          </span>
          <span class="tree-item-label-text">{this.state.item.title}</span>
        </div>
        <div class="tree-item-children">
          {(this.state.item.children || [])
            ?.map((item, index) => {
              return createComponent("TreeItem", {
                ref: `${this.id}-${index}`,
                item,
              });
            })
            .join("")}
        </div>
      </div>
    );
  }

  [CLICK("$label")]() {
    console.log(this.state.item);
  }
}

export class TreeView extends EditorElement {
  components() {
    return {
      TreeItem,
    };
  }

  initState() {
    return {
      provider: this.props.provider || new TreeProvider(),
    };
  }

  template() {
    // console.log(this.state.provider);
    return <div class="tree-view"></div>;
  }

  async [LOAD("$el") + DOMDIFF]() {
    return (await this.state.provider.traverse()).map((it, index) => {
      return createComponent("TreeItem", {
        ref: `${this.id}-${index}`,
        item: it,
      });
    });
  }
}
