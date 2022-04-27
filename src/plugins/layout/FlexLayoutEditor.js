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
    const current = this.$selection.current;

    if (!current) return "";

    const realPaddingTop = Math.min(current["padding-top"] || 0, 50);
    const realPaddingLeft = Math.min(current["padding-left"] || 0, 50);
    const realPaddingRight = Math.min(current["padding-right"] || 0, 50);
    const realPaddingBottom = Math.min(current["padding-bottom"] || 0, 50);

    const padding = `padding-top:${realPaddingTop}px;padding-left: ${realPaddingLeft}px;padding-right:${realPaddingRight}px;padding-bottom: ${realPaddingBottom}px;`;

    return /*html*/ `
            <div class='flex-layout-item'>
                <div class="grid-2">
                    <div>
                        ${createComponent("SelectIconEditor", {
                          key: "flex-direction",
                          ref: "$flexDirection",
                          value:
                            this.state["flex-direction"] || FlexDirection.ROW,
                          options: this.getDirectionOptions(),
                          icons: ["east", "south"],
                          onchange: "changeKeyValue",
                        })}
                    </div>
                    <div>
                        ${createComponent("NumberInputEditor", {
                          compact: true,
                          ref: "$flex-gap",
                          label: iconUse("space"),
                          key: "gap",
                          value: this.state.gap,
                          min: 0,
                          max: 100,
                          step: 1,
                          onchange: "changeKeyValue",
                        })}
                    </div>
                    <div>
                        ${createComponent("NumberInputEditor", {
                          compact: true,
                          label: iconUse("padding"),
                          key: "padding",
                          ref: "$padding",
                          value: current["padding-top"],
                          min: 0,
                          max: 100,
                          step: 1,
                          onchange: "changePadding",
                        })}
                    </div>


                    <div>
                        ${createComponent("ToggleButton", {
                          compact: true,
                          key: "flex-wrap",
                          ref: "$wrap",
                          checkedValue: "wrap",
                          value: this.state["flex-wrap"] || FlexWrap.NOWRAP,
                          toggleLabels: [iconUse("wrap"), iconUse("wrap")],
                          toggleValues: [FlexWrap.NOWRAP, FlexWrap.WRAP],
                          onchange: "changeKeyValue",
                        })}
                    </div>
                </div>

            </div>

            <div class="select-flex-direction">
                <div>
                    <div class="flex-group-padding">            
                        <div class="padding-top" style="height: ${
                          current["padding-top"]
                        }px"></div>
                        <div class="padding-left" style="width: ${
                          current["padding-left"]
                        }px"></div>
                        <div class="padding-right" style="width: ${
                          current["padding-right"]
                        }px"></div>
                        <div class="padding-bottom" style="height: ${
                          current["padding-bottom"]
                        }px"></div>
                    </div>
                    <div class="flex-group" style="
                            --flex-group-gap: ${Math.floor(
                              this.state["gap"] / 10
                            )}px;
                            --flex-group-padding: ${realPaddingTop}px;
                            ${padding};
                            flex-direction: ${this.state["flex-direction"]};
                            flex-wrap: ${this.state["flex-wrap"]};
                            justify-content:${this.state["justify-content"]};
                            align-items: ${this.state["align-items"]};
                            align-content:${this.state["align-content"]};
                    ">
                        ${[1, 2, 3]
                          .map(() => {
                            return /*html*/ `
                                <div class="flex-direction" data-value="${this.state["flex-direction"]}" style="flex-direction: ${this.state["flex-direction"]};align-items: ${this.state["align-items"]};">
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
                            data-direction="${this.state["flex-direction"]}"  
                            data-justify-content="${
                              this.state["justify-content"]
                            }"
                            data-align-items="${this.state["align-items"]}"
                            data-align-content="${
                              this.state["align-content"]
                            }"                            
                            style="
                                --flex-group-gap: ${Math.floor(
                                  this.state["gap"] / 10
                                )}px;
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
                  key: "justify-content",
                  ref: "$justify",
                  value:
                    this.state["justify-content"] || JustifyContent.FLEX_START,
                  options: this.getJustifyContentOptions(),
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
                  key: "align-items",
                  ref: "$alignItems",
                  value: this.state["align-items"] || AlignItems.FLEX_START,
                  options: this.getAlignItemsOptions(),
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
    return /*html*/ `
            <div class='flex-layout-editor' ref='$body' ></div>
        `;
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
      "padding-top": value,
      "padding-left": value,
      "padding-right": value,
      "padding-bottom": value,
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

    if (this.state["justify-content"] === JustifyContent.SPACE_BETWEEN) {
      // space 관련된게 있으면 align-content 만 변경한다.

      this.setState(
        {
          "align-items": alignItems,
        },
        false
      );

      this.modifyData("align-item", alignItems);
    } else if (this.state["justify-content"] === JustifyContent.SPACE_AROUND) {
      // space 관련된게 있으면 align-content 만 변경한다.

      this.setState(
        {
          "align-items": alignItems,
        },
        false
      );

      this.modifyData("align-item", alignItems);
    } else {
      this.setState(
        {
          "justify-content": justifyContent,
          "align-items": alignItems,
        },
        false
      );

      this.modifyData("justify-content", justifyContent);
      this.modifyData("align-items", alignItems);
    }

    this.refresh();
  }
}
