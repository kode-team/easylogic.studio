import { CLICK, DOMDIFF, LOAD, SUBSCRIBE_SELF, createComponent } from "sapa";

import "./FlexLayoutEditor.scss";

import { iconUse } from "elf/editor/icon/icon";
import {
  AlignItems,
  FlexDirection,
  FlexWrap,
  JustifyContent,
} from "elf/editor/types/model";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class FlexLayoutEditor extends EditorElement {
  initialize() {
    super.initialize();

    this.directionOptions = this.getDirectionOptions();
    this.wrapOptions = this.getWrapOptions();
    this.justifyContentOptions = this.getJustifyContentOptions();
    this.alignItemsOptions = this.getAlignItemsOptions();
  }

  getDirectionOptions() {
    return this.makeOptionsFunction("row,column");
  }

  getWrapOptions() {
    return this.makeOptionsFunction("nowrap,wrap");
  }

  getJustifyContentOptions() {
    return this.makeOptionsFunction(
      "flex-start,flex-end,center,space-between,space-around"
    );
  }

  getAlignItemsOptions() {
    return this.makeOptionsFunction(
      "flex-start,flex-end,center,baseline,stretch"
    );
  }

  getAlignContentOptions() {
    return this.makeOptionsFunction(
      "flex-start,flex-end,center,space-between,space-around,stretch"
    );
  }

  makeOptionsFunction(options) {
    return options.split(",").map((it) => {
      return { value: it, text: this.$i18n("flex.layout.editor." + it) };
    });
  }

  initState() {
    return {
      ...this.props.value,
    };
  }

  setValue(value) {
    this.setState({
      ...value,
    });
  }

  getValue() {
    return this.state;
  }

  modifyData(key, value) {
    this.parent.trigger(this.props.onchange, key, value);
  }

  [LOAD("$body") + DOMDIFF]() {
    const current = this.$context.selection.current;

    if (!current) return "";

    const realPaddingTop = Math.min(current.paddingTop || 0, 50);
    const realPaddingLeft = Math.min(current.paddingLeft || 0, 50);
    const realPaddingRight = Math.min(current.paddingRight || 0, 50);
    const realPaddingBottom = Math.min(current.paddingBottom || 0, 50);

    const padding = `padding-top:${realPaddingTop}px;padding-left: ${realPaddingLeft}px;padding-right:${realPaddingRight}px;padding-bottom: ${realPaddingBottom}px;`;

    return /*html*/ `<div class='flex-layout-item'><div class="grid-2"><div>${createComponent(
      "SelectIconEditor",
      {
        key: "flexDirection",
        ref: "$flexDirection",
        value: this.state.flexDirection || FlexDirection.ROW,
        options: this.directionOptions,
        icons: ["east", "south"],
        onchange: "changeKeyValue",
      }
    )}</div><div>${createComponent("NumberInputEditor", {
      compact: true,
      ref: "$flex-gap",
      label: iconUse("space"),
      key: "gap",
      value: this.state.gap,
      min: 0,
      max: 100,
      step: 1,
      onchange: "changeKeyValue",
    })}</div><div>${createComponent("NumberInputEditor", {
      compact: true,
      label: iconUse("padding"),
      key: "padding",
      ref: "$padding",
      value: current.paddingTop,
      min: 0,
      max: 100,
      step: 1,
      onchange: "changePadding",
    })}</div><div>${createComponent("ToggleButton", {
      compact: true,
      key: "flexWrap",
      ref: "$wrap",
      size: 30,
      checkedValue: "wrap",
      value: this.state.flexWrap || FlexWrap.NOWRAP,
      toggleLabels: [iconUse("wrap"), iconUse("wrap")],
      toggleValues: [FlexWrap.NOWRAP, FlexWrap.WRAP],
      onchange: "changeKeyValue",
    })}</div></div></div>
  <div class="select-flex-direction">
      <div>
          <div class="flex-group-padding">            
              <div class="padding-top" style="height: ${
                current.paddingTop
              }px"></div>
              <div class="padding-left" style="width: ${
                current.paddingLeft
              }px"></div>
              <div class="padding-right" style="width: ${
                current.paddingRight
              }px"></div>
              <div class="padding-bottom" style="height: ${
                current.paddingBottom
              }px"></div>
          </div>
          <div class="flex-group" style="
                  --flex-group-gap: ${Math.floor(this.state.gap / 10)}px;
                  --flex-group-padding: ${realPaddingTop}px;
                  ${padding};
                  flex-direction: ${this.state.flexDirection};
                  flex-wrap: ${this.state.flexWrap};
                  justify-content:${this.state.justifyContent};
                  align-items: ${this.state.alignItems};
                  align-content:${this.state.alignContent};
          ">
              ${[1, 2, 3]
                .map(() => {
                  return /*html*/ `
                      <div class="flex-direction" data-value="${this.state.flexDirection}" style="flex-direction: ${this.state.flexDirection};align-items: ${this.state.alignItem};">
                          <div class="flex-direction-item" data-index="1"></div>
                          <div class="flex-direction-item" data-index="2"></div>
                          <div class="flex-direction-item" data-index="3"></div>
                      </div>
                  `;
                })
                .join("\n")}
          </div>
          <div class="flex-group-tool"  style="${padding};">
              <div class="tool-area"  
                  data-direction="${this.state.flexDirection}"  
                  data-justify-content="${this.state.justifyContent}"
                  data-align-items="${this.state.alignItems}"
                  data-align-content="${
                    this.state.alignContent
                  }"                            
                  style="
                      --flex-group-gap: ${Math.floor(this.state["gap"] / 10)}px;
                      --flex-group-padding: ${realPaddingTop}px;
                  "
              >
                  <div class="tool-area-item" data-index="1" data-justify-content="flex-start" data-align-items="flex-start"></div>
                  <div class="tool-area-item" data-index="2"  data-justify-content="center" data-align-items="flex-start"></div>
                  <div class="tool-area-item" data-index="3"  data-justify-content="flex-end" data-align-items="flex-start"></div>
                  <div class="tool-area-item" data-index="4"  data-justify-content="flex-start" data-align-items="center"></div>
                  <div class="tool-area-item" data-index="5"  data-justify-content="center" data-align-items="center"></div>
                  <div class="tool-area-item" data-index="6"  data-justify-content="flex-end" data-align-items="center"></div>
                  <div class="tool-area-item" data-index="7"  data-justify-content="flex-start" data-align-items="flex-end"></div>
                  <div class="tool-area-item" data-index="8"  data-justify-content="center" data-align-items="flex-end"></div>
                  <div class="tool-area-item" data-index="9"  data-justify-content="flex-end" data-align-items="flex-end"></div>                            
              </div>
          </div>
      </div>
  </div>

  <div class='flex-layout-item'>
      <div class="title">${this.$i18n(
        "flex.layout.editor.justify-content"
      )}</div>
      ${createComponent("SelectIconEditor", {
        key: "justifyContent",
        ref: "$justify",
        value: this.state.justifyContent || JustifyContent.FLEX_START,
        options: this.justifyContentOptions,
        icons: [
          "start",
          "end",
          "horizontal_align_center",
          "horizontal_distribute",
          "justify_content_space_around",
        ],
        onchange: "changeKeyValue",
      })}
  </div>
  <div class='flex-layout-item'>
      <div class="title">${this.$i18n(
        "flex.layout.editor.align-items"
      )}</div>            
      ${createComponent("SelectIconEditor", {
        key: "alignItems",
        ref: "$alignItems",
        value: this.state.alignItems || AlignItems.FLEX_START,
        options: this.alignItemsOptions,
        icons: [
          "vertical_align_top",
          "vertical_align_bottom",
          "vertical_align_center",
          "vertical_align_baseline",
          "vertical_align_stretch",
        ],
        onchange: "changeKeyValue",
      })}
  </div>
        `;
  }

  template() {
    return /*html*/ `<div class='flex-layout-editor' ref='$body' ></div>`;
  }

  [SUBSCRIBE_SELF("changeKeyValue")](key, value) {
    this.setState(
      {
        [key]: value,
      },
      false
    );

    this.modifyData(key, value);

    this.refresh();
  }

  [SUBSCRIBE_SELF("changePadding")](key, value) {
    this.setState(
      {
        [key]: value,
      },
      false
    );

    this.modifyData(key, {
      paddingTop: value,
      paddingLeft: value,
      paddingRight: value,
      paddingBottom: value,
    });

    this.refresh();
  }

  [CLICK("$body .tool-area-item")](e) {
    const $target = e.$dt;
    const [justifyContent, alignItems] = $target.attrs(
      "data-justify-content",
      "data-align-items",
      "data-align-content"
    );

    if (this.state.justifyContent === JustifyContent.SPACE_BETWEEN) {
      // space 관련된게 있으면 align-content 만 변경한다.

      this.setState(
        {
          alignItems,
        },
        false
      );

      this.modifyData("alignItems", alignItems);
    } else if (this.state.justifyContent === JustifyContent.SPACE_AROUND) {
      // space 관련된게 있으면 align-content 만 변경한다.

      this.setState(
        {
          alignItems,
        },
        false
      );

      this.modifyData("align-item", alignItems);
    } else {
      this.setState(
        {
          justifyContent: justifyContent,
          alignItems: alignItems,
        },
        false
      );

      this.modifyData("justifyContent", justifyContent);
      this.modifyData("alignItems", alignItems);
    }

    this.refresh();
  }
}
