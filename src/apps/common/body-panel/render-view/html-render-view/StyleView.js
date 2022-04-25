import { BIND, SUBSCRIBE, Dom, isString } from "sapa";

import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { Project } from "plugins/default-items/layers/Project";

const TEMP_DIV = Dom.create("div");

export default class StyleView extends EditorElement {
  initState() {
    return {
      cacheStyleElement: {},
      lastChangedList: {},
    };
  }

  template() {
    return /*html*/ `
    <div class='style-view' style='pointer-events: none; position: absolute;display:inline-block;left:-1000px;'>
      <div ref='$svgArea'></div>
      <style ref="$innerStyleView" type="text/css"></style>
    </div>
    `;
  }

  initialize() {
    super.initialize();

    this.refs.$styleView = Dom.create(document.head);
  }

  makeStyle(item) {
    return this.$editor.html.toStyle(item);
  }

  toStyleData(item) {
    return this.$editor.html.toStyleData(item);
  }

  refreshStyleHead() {
    var project = this.$selection.currentProject || new Project();
    this.refs.$styleView
      .$$(`style[data-renderer-type="html"]`)
      .forEach(($style) => $style.remove());

    // project setting
    this.changeStyleHead(project);

    // artboard setting
    project.layers.forEach((item) => this.changeStyleHead(item));
  }

  changeStyleHead(item) {
    var $temp = Dom.create("div");

    const styleTag = this.makeStyle(item);

    $temp
      .html(styleTag)
      .children()
      .forEach(($item) => {
        this.refs.$styleView.append($item);
      });
  }

  refreshStyleHeadOne(item, isOnlyOne = false) {
    var list = [item];
    if (!isOnlyOne) {
      list = item.allLayers;
    }

    var selector = list
      .map((it) => {
        return `style[data-renderer-type="html"][data-id="${it.id}"]`;
      })
      .join(",");

    let isChanged = false;
    this.refs.$styleView.$$(selector).forEach((it) => {
      const renderItem = this.$model.get(it.data("id"));

      if (renderItem.isChanged(this.state.lastChangedList[renderItem.id])) {
        isChanged = true;
        it.remove();
        this.state.lastChangedList[renderItem.id] = renderItem.timestamp;
      }
    });

    if (isChanged) {
      this.changeStyleHead(item);
    }
  }

  // [LOAD('$svgArea') + DOMDIFF] () {
  //   var project = this.$selection.currentProject || {  }

  //   return this.$editor.html.renderSVG(project);
  // }

  // timeline 에서 테스트 할 때 이걸 활용할 수 있다.
  // 움직이기 원하는 객체가 타임라인 전체라
  // 전체를 리프레쉬 하는걸로 한다.
  // 애니메이션이 진행되는 동안 임의의 객체는 없는 것으로 하자.
  [SUBSCRIBE("refreshStyleView", "moveTimeline", "playTimeline")](
    current,
    isOnlyOne = false
  ) {
    if (current) {
      this.load();
      this.refreshStyleHeadOne(current, isOnlyOne);
    } else {
      this.refresh();
    }
  }

  [SUBSCRIBE("refreshSVGArea")]() {
    this.load("$svgArea");
  }

  getStyleElement(item) {
    if (!this.state.cacheStyleElement[item.id]) {
      const selector = `style[data-renderer-type="html"][data-id="${item.id}"]`;
      this.state.cacheStyleElement[item.id] = this.refs.$styleView.$(selector);
    }

    // 부모가 없으면 없는 것으로 판단한다.
    if (!this.state.cacheStyleElement[item.id]?.$parent) {
      this.state.cacheStyleElement[item.id] = undefined;
      return null;
    }

    return this.state.cacheStyleElement[item.id];
  }

  //  style 태그를 만들어서 추가한다.
  // 이미 있으면 업데이트 한다.
  // 삭제 하는 경우는 어떻게 할지 고민해보자.
  loadStyle(items) {
    const obj = {};

    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i];
      obj[item.id] = item;

      const $itemStyle = this.getStyleElement(item);

      if ($itemStyle) {
        const cssString = this.toStyleData(item).cssString;

        $itemStyle.text(cssString);
      } else {
        const styleCode = this.makeStyle(item);
        var $fragment = TEMP_DIV.html(styleCode).createChildrenFragment();

        this.refs.$styleView.append($fragment);
      }
    }
  }

  /**
   *
   * @param {String|Object|Array<string>|Array<object>} obj  ,  id 리스트를 만들기 위한 객체, 없으면 selection에 있는 객체 전체
   */
  [SUBSCRIBE("refreshSelectionStyleView")](obj = null) {
    var ids = obj;

    if (Array.isArray(obj)) {
      ids = obj;
    } else if (obj !== null) {
      ids = [obj];
    }

    let items = [];

    if (!ids) {
      items = this.$selection.items;
    } else if (isString(ids[0])) {
      items = this.$selection.itemsByIds(ids);
    } else {
      items = ids;
    }

    if (items.length === 1) {
      this.loadStyle(items);
      return;
    }

    const styleTags = [];
    const removeStyleSelector = [];

    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i];

      if (item.is("project")) {
        // style 변화가 project 일 때는 자기 자신만 처리하도록 한다.
        // 나머지는 다른 곳에서 오는 것들을 같이 적용한다.
        var selector = `style[data-renderer-type="html"][data-id="${item.id}"]`;
      } else {
        var selector = item.allLayers
          .map((it) => {
            return `style[data-renderer-type="html"][data-id="${it.id}"]`;
          })
          .join(",");
      }

      removeStyleSelector.push(selector);
      styleTags.push(this.makeStyle(item));
    }

    if (removeStyleSelector.length) {
      this.refs.$styleView.$$(removeStyleSelector).forEach((it) => {
        it.remove();
      });
    }

    var $fragment = TEMP_DIV.html(styleTags.join("")).createChildrenFragment();

    this.refs.$styleView.append($fragment);
  }

  refresh() {
    this.load();
    this.refreshStyleHead();
  }

  [BIND("$innerStyleView")]() {
    return {
      html: `${this.$visibleManager.list
        .map((id) => {
          return `[data-id="${id}"]`;
        })
        .join(",")} { 
        display: none;
      }`,
    };
  }

  [SUBSCRIBE("refreshVisibleView")]() {
    this.bindData("$innerStyleView");
  }
}
