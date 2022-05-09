import {
  LOAD,
  CLICK,
  DOUBLECLICK,
  PREVENT,
  STOP,
  FOCUSOUT,
  DOMDIFF,
  DRAGSTART,
  KEYDOWN,
  DRAGOVER,
  DROP,
  BIND,
  DRAGEND,
  SUBSCRIBE,
  SUBSCRIBE_SELF,
  THROTTLE,
  CONFIG,
  Dom,
} from "sapa";

import "./LayerTreeProperty.scss";

import { PathParser } from "elf/core/parser/PathParser";
import { iconUse, iconUseForPath } from "elf/editor/icon/icon";
import { REFRESH_SELECTION } from "elf/editor/types/event";
import { KEY_CODE } from "elf/editor/types/key";
import { TargetActionType } from "elf/editor/types/model";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";
import { Length } from "elf/editor/unit/Length";

const DRAG_START_CLASS = "drag-start";

export default class LayerTreeProperty extends BaseProperty {
  getTitle() {
    return this.$i18n("layer.tree.property.title");
  }

  getClassName() {
    return "full";
  }

  initState() {
    return {
      hideDragPointer: true,
      lastDragOverPosition: 0,
      lastDragOverOffset: 0,
      rootRect: { top: 0 },
      itemRect: { height: 0 },
    };
  }

  getBody() {
    return /*html*/ `
      <div class="elf--layer-list scrollbar" ref="$layerList"></div>
      <div class='drag-point' ref='$dragPointer'></div>
    `;
  }

  [BIND("$dragPointer")]() {
    var offset = this.state.lastDragOverOffset;
    var dist = this.state.itemRect.height / 3;
    var bound = {};

    if (this.state.lastDragOverOffset < dist) {
      offset = 0;

      var top =
        this.state.lastDragOverPosition + offset - this.state.rootRect.top;

      bound = {
        top: top,
        height: "1px",
        width: "100%",
        left: "0px",
      };

      this.state.lastDragOverItemDirection = "before";
    } else if (
      this.state.lastDragOverOffset >
      this.state.itemRect.height - dist
    ) {
      offset = this.state.itemRect.height;

      var top =
        this.state.lastDragOverPosition + offset - this.state.rootRect.top;

      bound = {
        top: top,
        height: "1px",
        width: "100%",
        left: "0px",
      };
      this.state.lastDragOverItemDirection = "after";
    } else {
      const targetItem = this.$model.get(this.state.lastDragOverItemId);
      // 자식을 가지지 못하는 컴포넌트는 예외처리
      if (targetItem?.enableHasChildren()) {
        offset = 0;

        var top =
          this.state.lastDragOverPosition + offset - this.state.rootRect.top;

        bound = {
          top: top,
          height: this.state.itemRect.height,
          width: "100%",
          left: "0px",
        };
        this.state.lastDragOverItemDirection = "self";
      }
    }

    bound.display = this.state.hideDragPointer ? "none" : "block";

    return {
      style: bound,
    };
  }

  //FIXME: 개별 객체가 아이콘을 리턴 할 수 있도록 구조를 맞춰보자.
  getIcon(item) {
    // return '';

    if (item.d) {
      const path = PathParser.fromSVGString(item.absolutePath().d);

      return iconUseForPath(path.scaleWith(24, 24).d, {
        width: 24,
        height: 24,
        fill: "currentColor",
        stroke: "currentColor",
      });
    }

    if (item.hasLayout() || item.hasChildren() || item.is("artboard")) {
      if (item.isLayout("flex")) {
        return iconUse("layout_flex");
      } else if (item.isLayout("grid")) {
        return iconUse("layout_grid");
      }

      return iconUse("layout_default");
    }

    return this.$icon.get(item.itemType, item);
  }

  makeLayerList(parentObject, depth = 0) {
    if (!parentObject.layers) return "";

    const layers = parentObject.layers;
    const data = [];

    for (var last = layers.length - 1; last > -1; last--) {
      var layer = layers[last];

      var selectedPathClass = this.$context.selection.hasPathOf(layer)
        ? "selected-path"
        : "";
      var selectedClass = this.$context.selection.check(layer)
        ? "selected"
        : "";
      var hovered = this.$context.selection.checkHover(layer) ? "hovered" : "";
      var name = layer.is("boolean-path")
        ? layer["boolean-operation"]
        : layer.name;

      if (layer.is("text")) {
        name = layer.text || layer.name;
      }
      var title = "";

      if (layer.hasLayout()) {
        title = this.$i18n("layer.tree.property.layout.title." + layer.layout);
      }

      const isHide = layer.isTreeItemHide();
      const depthPadding = depth * 20;
      const hasChildren = layer.hasChildren();
      const lock = this.$lockManager.get(layer.id);
      const visible = this.$visibleManager.get(layer.id);

      data[data.length] = /*html*/ `        
        <div class='layer-item ${selectedClass} ${selectedPathClass} ${hovered}' data-is-group="${hasChildren}" data-depth="${depth}" data-layout='${
        layer.layout
      }' data-layer-id='${layer.id}' data-is-hide="${isHide}"  draggable="true">
          <div class='detail'>
            <label data-layout-title='${title}' style='padding-left: ${Length.px(
        depthPadding
      )}' > 
              <div class='folder ${layer.collapsed ? "collapsed" : ""}'>${
        hasChildren ? iconUse("arrow_right") : ""
      }</div>
              <span class='icon' data-item-type="${
                layer.itemType
              }">${this.getIcon(layer)}</span> 
              <span class='name'>${name}</span>
            </label>
            <div class="tools">
              <button type="button" class="lock" data-lock="${lock}" title='Lock'>${
        lock ? iconUse("lock") : iconUse("lock_open")
      }</button>
              <button type="button" class="visible" data-visible="${visible}" title='Visible'>${iconUse(
        "visible"
      )}</button>
              <button type="button" class="remove" title='Remove'>${iconUse(
                "remove2"
              )}</button>                          
            </div>
          </div>
        </div>

        ${this.makeLayerList(layer, depth + 1)}
      `;
    }

    return data.join(" ");
  }

  [SUBSCRIBE("refreshContent")]() {
    this.refresh();
  }

  [LOAD("$layerList") + DOMDIFF]() {
    var project = this.$context.selection.currentProject;
    if (!project) return "";

    return [
      this.makeLayerList(project, 0),
      /*html*/ `
        <div class='layer-item ' data-depth="0" data-is-last="true">
        </div>
      `,
    ];
  }

  [DRAGSTART("$layerList .layer-item")](e) {
    var layerId = e.$dt.attr("data-layer-id");
    e.$dt.addClass(DRAG_START_CLASS);
    e.dataTransfer.setData("layer/id", layerId);
    this.state.rootRect = this.refs.$layerList.rect();
    this.state.itemRect = e.$dt.rect();
    this.setState(
      {
        hideDragPointer: false,
      },
      false
    );

    this.bindData("$dragPointer");
  }

  [DRAGEND("$layerList .layer-item")]() {
    this.setState(
      {
        hideDragPointer: true,
      },
      false
    );

    this.bindData("$dragPointer");

    this.refs.$layerList.$$(`.${DRAG_START_CLASS}`).forEach((it) => {
      it.removeClass(DRAG_START_CLASS);
    });
  }

  [DRAGOVER(`$layerList .layer-item:not(.${DRAG_START_CLASS})`) + PREVENT](e) {
    var targetLayerId = e.$dt.attr("data-layer-id");
    // console.log({targetLayerId, x: e.offsetX, y: e.offsetY});

    this.state.lastDragOverItemId = targetLayerId;
    this.state.lastDragOverPosition = e.$dt.rect().top;
    this.state.lastDragOverOffset = e.offsetY;

    this.bindData("$dragPointer");
  }
  [DROP(`$layerList .layer-item:not(.${DRAG_START_CLASS})`)](e) {
    var targetLayerId = e.$dt.attr("data-layer-id");
    var sourceLayerId = e.dataTransfer.getData("layer/id");

    if (targetLayerId === sourceLayerId) return;

    var targetItem = this.$model.get(targetLayerId);
    var sourceItem = this.$model.get(sourceLayerId);

    // 자식을 가지지 못하는 컴포넌트는 예외처리
    if (targetItem?.enableHasChildren() === false) return;
    if (targetItem && targetItem.hasParent(sourceItem.id)) return;

    // drop 이 먼저 일어나게 되어서 mouse up 한 상태가 아니라서
    // history.xxx 형태로 emit 을 바로 날린다.
    switch (this.state.lastDragOverItemDirection) {
      case "self":
        this.$commands.emit(
          "history.moveLayerToTarget",
          "change target with move",
          sourceItem,
          targetItem,
          undefined,
          TargetActionType.APPEND_CHILD
        );
        break;
      case "before":
        this.$commands.emit(
          "history.moveLayerToTarget",
          "change target with move",
          sourceItem,
          targetItem,
          undefined,
          TargetActionType.INSERT_BEFORE
        );
        break;
      case "after":
        this.$commands.emit(
          "history.moveLayerToTarget",
          "change target with move",
          sourceItem,
          targetItem,
          undefined,
          TargetActionType.INSERT_AFTER
        );
        break;
    }

    this.nextTick(() => {
      this.$commands.emit("recoverBooleanPath");
      this.$context.selection.select(sourceItem);
      this.setState({
        hideDragPointer: true,
      });
    }, 10);
  }

  [DOUBLECLICK("$layerList .layer-item")](e) {
    this.startInputEditing(e.$dt.$(".name"));
  }

  modifyDoneInputEditing(input, event) {
    if (KEY_CODE.enter === event.keyCode) {
      this.endInputEditing(input, () => {
        var id = input.closest("layer-item").attr("data-layer-id");
        var text = input.text();

        this.$commands.executeCommand("setAttribute", "change name", {
          [id]: {
            name: text,
          },
        });
      });
    } else {
      var id = input.closest("layer-item").attr("data-layer-id");
      var text = input.text();

      this.$commands.executeCommand("setAttribute", "change name", {
        [id]: {
          name: text,
        },
      });
    }
  }

  [KEYDOWN("$layerList .layer-item .name") + STOP](e) {
    this.modifyDoneInputEditing(e.$dt, e);
  }

  [FOCUSOUT("$layerList .layer-item .name") + PREVENT + STOP](e) {
    this.modifyDoneInputEditing(e.$dt, { keyCode: KEY_CODE.enter });
  }

  selectLayer(layer) {
    if (layer) {
      this.$context.selection.select(layer);
    }

    this.refresh();
    this.emit(REFRESH_SELECTION);
  }

  addLayer(layer) {
    if (layer) {
      this.$context.selection.select(layer);

      this.$commands.emit("refreshArtboard");
    }
  }

  [CLICK("$add")]() {
    this.$commands.emit("newComponent", "rect", {
      "background-color": "#ececec",
      width: 200,
      height: 100,
    });
  }

  [CLICK("$layerList .layer-item label .name")](e) {
    var $item = e.$dt.closest("layer-item");
    $item.onlyOneClass("selected");

    var id = $item.attr("data-layer-id");
    this.$context.selection.select(id);

    this.$commands.executeCommand(REFRESH_SELECTION);
  }

  [CLICK("$layerList .layer-item label .folder")](e) {
    var $item = e.$dt.closest("layer-item");
    var id = $item.attr("data-layer-id");
    var item = this.$model.get(id);

    item.reset({
      collapsed: !item.collapsed,
    });

    this.refresh();
  }

  [CLICK("$layerList .layer-item .visible")](e) {
    var $item = e.$dt.closest("layer-item");
    var id = $item.attr("data-layer-id");

    this.$visibleManager.toggle(id);

    var visible = this.$visibleManager.get(id);
    e.$dt.attr("data-visible", visible);

    this.emit("refreshVisibleView");
  }

  [CLICK("$layerList .layer-item .remove")](e) {
    var $item = e.$dt.closest("layer-item");
    var id = $item.attr("data-layer-id");

    this.$commands.executeCommand("removeLayer", "remove a layer", [id]);

    this.nextTick(() => {
      this.refresh();
    }, 1000);
  }

  [CLICK("$layerList .layer-item .lock")](e) {
    var $item = e.$dt.closest("layer-item");
    var id = $item.attr("data-layer-id");

    this.$lockManager.toggle(id);
    var lastLock = this.$lockManager.get(id);
    e.$dt.attr("data-lock", lastLock);

    // 클릭한게 lock 이고, selection 에 포함 되어 있으면 selection 영역에서 제외한다.
    if (lastLock) {
      this.$context.selection.removeById(id);
      this.emit(REFRESH_SELECTION);
    }
  }

  [SUBSCRIBE("changeHoverItem")]() {
    this.refs.$layerList.$$(".hovered").forEach((it) => {
      it.removeClass("hovered");
    });

    if (this.$context.selection.hoverItems.length) {
      var selector = this.$context.selection.hoverItems
        .map((it) => {
          return `[data-layer-id="${it.id}"]`;
        })
        .join(",");
      this.refs.$layerList.$$(selector).forEach((it) => {
        it.addClass("hovered");
      });
    }
  }

  [SUBSCRIBE_SELF("changeSelection")](isSelection = false) {
    if (isSelection && this.refs.$layerList) {
      this.refs.$layerList.$$(".selected").forEach((it) => {
        it.removeClass("selected");
      });

      this.refs.$layerList.$$(".selected-path").forEach((it) => {
        it.removeClass("selected-path");
      });

      var selector = this.$context.selection.items
        .map((it) => {
          return `[data-layer-id="${it.id}"]`;
        })
        .join(",");

      if (selector) {
        this.refs.$layerList.$$(selector).forEach((it) => {
          it.addClass("selected");

          var item = this.$context.selection.itemKeys[it.attr("data-layer-id")];
          if (item.is("svg-path", "svg-polygon")) {
            it.$(".icon").html(this.getIcon(item));
          }
        });
      }
    }
  }

  [SUBSCRIBE(REFRESH_SELECTION, "refreshAllCanvas")]() {
    this.refresh();
  }

  [SUBSCRIBE("refreshLayerTreeView") + THROTTLE(100)]() {
    this.refresh();
  }

  [SUBSCRIBE("changeItemLayout")]() {
    this.refresh();
  }

  [CONFIG("bodyEvent")]() {
    const $target = Dom.create(this.$config.get("bodyEvent").target);
    const $layerItem = $target.closest("layer-item");

    if ($layerItem) {
      this.emit("refreshHoverView", $layerItem.data("layer-id"));
    }
  }
}
