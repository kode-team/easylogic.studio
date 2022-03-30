import {
  AlignContent,
  AlignItems,
  FlexDirection,
  JustifyContent,
  Layout,
} from "el/editor/types/model";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { DOMDIFF, LOAD, SUBSCRIBE } from "el/sapa/Event";
import { clone } from "el/sapa/functions/func";
import {
  toRectVerties,
  vertiesToPath,
  vertiesToRectangle,
} from "el/utils/collision";
import { vec3 } from "gl-matrix";

import "./GhostToolView.scss";

const CHECK_RATE = 0.5;

/**
 * 원보 아이템의 크기를 가지고 scale 이랑 조합해서 world 의 크기를 구하는게 기본 컨셉
 */
export default class GhostToolView extends EditorElement {
  template() {
    return (
      <div class="elf--ghost-tool-view">
        <div ref="$containerView"></div>
        <div ref="$view"></div>
      </div>
    );
  }

  [SUBSCRIBE("startGhostToolView")](verties) {
    const screenVerties = this.$selection.verties;

    this.isLayoutItem = this.$selection.isLayoutItem;

    // layer 의 월드 좌표
    this.verties = clone(screenVerties);
    this.ghostVerties = clone(screenVerties);

    // layer 의 스크린 좌표
    this.ghostScreenVerties = this.$viewport.applyVerties(this.ghostVerties);

    // 마우스 클릭 시작지점 위치
    this.initMousePoint = this.$viewport.getWorldPosition();

    // 선택되지 않은 리스트들 중에
    this.filteredLayers = this.$selection.notSelectedLayers;

    // container 리스트 구하기, artboard 나 layout 을 가지고 있는 것들이 대상
    this.containerList = this.filteredLayers
      .filter((it) => it.hasLayout() || it.is("artboard"))
      .map((it) => it.originVerties);

    this.$config.set("set.move.control.point", true);
  }

  collectInformation() {
    const targetMousePoint = this.$viewport.getWorldPosition();

    const newDist = this.getDist();

    // translate
    this.ghostVerties = this.verties.map((v) => {
      return vec3.add([], v, newDist);
    });

    this.ghostScreenVerties = this.$viewport.applyVerties(this.ghostVerties);

    const filteredLayers = this.$selection.filteredLayers.filter(
      (it) => this.$selection.check(it) === false
    );

    // drop target 아이템
    this.targetItem = filteredLayers[0];

    if (this.targetItem) {
      // 현재 targetItem 이 layout 을 가지고 있다면 , container 로 인지하고 마지막 자식을 targetItem 으로 지정한다.
      if (this.targetItem.hasLayout() && this.targetItem?.hasChildren()) {
        this.targetItem = this.targetItem.layers.pop();
      }

      // target 전체 영역 위치
      this.targetOriginPosition = this.$viewport.applyVerties(
        toRectVerties(this.targetItem.contentVerties)
      );

      // console.log(this.targetOriginPosition);

      // 현재 스크린에서 마우스 위치
      this.targetPoint = this.$viewport.applyVertex(targetMousePoint);

      // 마우스 위치가 현재 target 에서 얼마나 떨어져있는지 비율
      this.targetRelativeMousePoint = {
        x:
          (this.targetPoint[0] - this.targetOriginPosition[0][0]) /
          (this.targetOriginPosition[1][0] - this.targetOriginPosition[0][0]),
        y:
          (this.targetPoint[1] - this.targetOriginPosition[0][1]) /
          (this.targetOriginPosition[3][1] - this.targetOriginPosition[0][1]),
      };

      // target 이 layout 의 item 이면 , 부모 정보 수집
      if (this.targetItem.isLayoutItem()) {
        this.targetParent = this.targetItem.parent;

        // layout 을 가진 부모가 있으면
        if (this.targetParent) {
          // 부모 위치를 미리 캐슁해두기
          this.targetParentPosition = this.$viewport.applyVerties(
            this.targetParent.contentVerties
          );
        }
      } else {
        this.targetParent = null;
        this.targetParentPosition = null;
      }
    } else {
      this.targetPoint = null;
      this.targetRelativeMousePoint = null;
      this.targetParent = null;
      this.targetParentPosition = null;
    }
  }

  [SUBSCRIBE("moveFirstGhostToolView")]() {
    this.collectInformation();

    this.load("$containerView");
    this.load("$view");
  }

  [SUBSCRIBE("moveGhostToolView")]() {
    this.collectInformation();

    this.load("$view");
  }

  [LOAD("$containerView")]() {
    if (!this.ghostVerties) {
      return <svg></svg>;
    }

    return (
      <svg>
        {this.containerList?.map((it) => {
          it = this.$viewport.applyVerties(it);
          return (
            <path
              class="container"
              d={`
                    M ${it[0][0]} ${it[0][1]}
                    L ${it[1][0]} ${it[1][1]}
                    L ${it[2][0]} ${it[2][1]}
                    L ${it[3][0]} ${it[3][1]}
                    Z
                `}
            />
          );
        })}
      </svg>
    );
  }

  renderPathForVerties(verties, className) {
    if (!verties) {
      return <g></g>;
    }

    const d = vertiesToPath(verties);

    return (
      <g>
        <path class={className} d={d} />
      </g>
    );
  }

  renderPath(verties, className, data = className) {
    // verties 포인트가 없으면 종료
    if (!verties) return "";

    verties = data === "ghost" ? verties : toRectVerties(verties);

    const textX = className === "flex-item" ? verties[0][0] : verties[0][0];
    const textY =
      className === "flex-item" ? verties[2][1] + 10 : verties[0][1] - 10;

    return (
      <g>
        <text x={textX} y={textY} font-size={8}>
          {data}
        </text>
        {this.renderPathForVerties(verties, className)}
      </g>
    );
  }

  renderLayoutFlexRowArea() {
    // 자식 기준으로 화면에 표시
    if (this.targetRelativeMousePoint.x < CHECK_RATE) {
      return (
        <>
          {this.renderPathForVerties(
            [this.targetOriginPosition[0], this.targetOriginPosition[3]],
            "flex-target"
          )}
        </>
      );
    } else {
      return (
        <>
          {this.renderPathForVerties(
            [this.targetOriginPosition[1], this.targetOriginPosition[2]],
            "flex-target"
          )}
        </>
      );
    }
  }

  renderLayoutFlexForFirstItem(direction) {
    const verticalField =
      direction === FlexDirection.COLUMN ? "align-items" : "justify-content";
    const verticalConst =
      direction === FlexDirection.COLUMN ? AlignItems : JustifyContent;
    const horizontalField =
      direction === FlexDirection.COLUMN ? "justify-content" : "align-items";
    const horizontalConst =
      direction === FlexDirection.COLUMN ? JustifyContent : AlignItems;
    const rect = vertiesToRectangle(this.targetOriginPosition);

    const center = this.ghostScreenVerties[4];

    const width = vec3.dist(
      this.ghostScreenVerties[0],
      this.ghostScreenVerties[1]
    );
    const height = vec3.dist(
      this.ghostScreenVerties[0],
      this.ghostScreenVerties[3]
    );

    let newCenterX = width / 2;
    let newCenterY = height / 2;

    switch (this.targetItem[verticalField]) {
      case verticalConst.FLEX_START:
        newCenterX = rect.x + width / 2;
        break;
      case verticalConst.CENTER:
      case verticalConst.SPACE_BETWEEN:
      case verticalConst.SPACE_AROUND:
        newCenterX = rect.x + rect.width / 2;
        break;
      case verticalConst.FLEX_END:
        newCenterX = rect.x + rect.width - width / 2;
        break;
    }

    switch (this.targetItem[horizontalField]) {
      case horizontalConst.FLEX_START:
        newCenterY = rect.y + height / 2;
        break;
      case horizontalConst.CENTER:
      case horizontalConst.SPACE_BETWEEN:
      case horizontalConst.SPACE_AROUND:
        newCenterY = rect.y + rect.height / 2;
        break;
      case horizontalConst.FLEX_END:
        newCenterY = rect.y + rect.height - height / 2;
        break;
    }

    const newDist = vec3.subtract([], [newCenterX, newCenterY, 0], center);

    // xy 를 빼고 transform 을 한다.
    const renderVerties = this.ghostScreenVerties
      .map((it) => vec3.add([], it, newDist))
      .filter((it, index) => index < 4);

    return this.renderPathForVerties(renderVerties, "flex-item", "ghost");
  }

  renderLayoutFlexColumnArea() {
    if (this.targetRelativeMousePoint.y < 0) {
      return "";
    }

    if (this.targetRelativeMousePoint.y < CHECK_RATE) {
      return this.renderPathForVerties(
        [this.targetOriginPosition[0], this.targetOriginPosition[1]],
        "flex-target"
      );
    } else {
      return this.renderPathForVerties(
        [this.targetOriginPosition[2], this.targetOriginPosition[3]],
        "flex-target"
      );
    }
  }

  renderLayoutItemInsertArea() {
    // 현재 선택된 layer 의 부모를 가지고 온다.
    if (!this.targetParent) {
      return;
    }

    if (this.targetParent.hasLayout()) {
      if (this.targetParent.isLayout(Layout.FLEX)) {
        switch (this.targetParent["flex-direction"]) {
          case FlexDirection.ROW:
            return this.renderLayoutFlexRowArea();
          case FlexDirection.COLUMN:
            return this.renderLayoutFlexColumnArea();
        }
      } else if (this.targetParent.isLayout(Layout.GRID)) {
      }
    }

    return (
      <path
        class="insert-area"
        d={`

        `}
      />
    );
  }

  renderLayoutItemForFirst() {
    if (this.targetItem?.hasChildren() === false) {
      if (this.targetItem.isLayout(Layout.FLEX)) {
        return this.renderLayoutFlexForFirstItem(
          this.targetItem["flex-direction"]
        );
      } else if (this.targetItem.isLayout(Layout.GRID)) {
      }
    }

    return (
      <path
        class="insert-area"
        d={`

        `}
      />
    );
  }

  [LOAD("$view") + DOMDIFF]() {
    const current = this.$selection.current;

    if (!this.ghostVerties || !current) {
      return <svg></svg>;
    }

    const hasTargetView = this.targetItem?.id !== current.id;

    return (
      <svg>
        {this.targetParent &&
          this.renderPathForVerties(this.targetParentPosition, "target-parent")}
        {hasTargetView &&
          this.renderPathForVerties(this.targetOriginPosition, "target", "")}
        {hasTargetView &&
          this.renderPathForVerties(
            this.targetOriginPosition,
            "target-rect",
            ""
          )}
        {hasTargetView && this.renderLayoutItemInsertArea()}
        {hasTargetView && this.renderLayoutItemForFirst()}

        {this.isLayoutItem &&
          this.renderPathForVerties(
            this.ghostScreenVerties.filter((_, index) => index < 4),
            "ghost"
          )}
      </svg>
    );
  }

  initializeGhostView() {
    this.isLayoutItem = false;
    this.ghostVerties = undefined;
    this.ghostScreenVerties = undefined;

    this.targetOriginPosition = undefined;
    this.targetOriginPosition = undefined;

    this.targetRelativeMousePoint = undefined;

    this.targetItem = undefined;
    this.targetParent = undefined;
    this.targetParentPosition = undefined;
  }

  getDist() {
    // targetItem 의 layout 이 default 일 때 , absolute 위치를 그대로 유지해준다.
    const targetMousePoint = this.$viewport.getWorldPosition();
    const newDist = vec3.floor(
      [],
      vec3.subtract([], targetMousePoint, this.initMousePoint)
    );

    return newDist;
  }

  // 백그라운드 영역(world)에 객체 계층 이동
  insertToBackground() {
    const current = this.$selection.current;
    const newDist = this.getDist();

    if (current.isLayoutItem() === false) return;

    this.command(
      "moveLayerToTarget",
      "change target with move",
      current,
      this.$selection.currentProject,
      newDist,
      "appendChild"
    );

    // const lastParent = current.parent;

    // // absolute move
    // current.absoluteMove(newDist);

    // this.$selection.currentProject.appendChild(current);

    // this.command(
    //   "setAttributeForMulti",
    //   "change move",
    //   this.$selection.pack("x", "y")
    // );
    // this.command("setAttributeForMulti", "change move", this.$selection.packByIds([lastParent.id], "children"));

    // this.emit("refreshAllCanvas");
  }

  /**
   *
   * targetAction
   * - appendChild: targetItem의 자식으로 추가
   * - appendBefore: targetItem의 앞으로 추가
   * - appendAfter: targetItem의 뒤에 추가
   *
   * @returns {string}
   */
  getTargetAction() {
    let targetAction = "";

    if (this.targetParent.hasLayout()) {
      if (this.targetParent.isLayout(Layout.FLEX)) {
        switch (this.targetParent["flex-direction"]) {
          case FlexDirection.ROW:
            // left
            if (this.targetRelativeMousePoint.x < CHECK_RATE) {
              targetAction = "appendBefore";
            } else {
              // right
              targetAction = "appendAfter";
            }
            break;
          case FlexDirection.COLUMN:
            // top
            if (this.targetRelativeMousePoint.y < CHECK_RATE) {
              targetAction = "appendBefore";
            } else {
              // bottom
              targetAction = "appendAfter";
            }
            break;
        }
      }
    }

    return targetAction;
  }

  // target 의 순서에 맞게 들어가기
  insertToLayoutItem() {
    const current = this.$selection.current;
    const newDist = this.getDist();

    if (this.targetParent.hasLayout()) {
      let targetAction = this.getTargetAction();

      if (this.targetParent.isLayout(Layout.FLEX)) {
        if (targetAction) {
          this.command(
            "moveLayerToTarget",
            "change target with move",
            current,
            this.targetItem,
            newDist,
            targetAction
          );
        }
      } else if (this.targetParent.isLayout(Layout.GRID)) {
      }
    }
  }

  /**
   * Ghost 상태에서 움직인 이후에 객체를 이동하는 것을 정의한다.
   *
   * ```
   * * [x] [HTMLRenderView] [백그라운드] -> [백그라운드] = move(newDist)
   * * [x] [HTMLRenderView] [앱솔루트 아이템] -> [백그라운드] = move(newDist), project.appendChild(ghost), refreshAllCanvas
   * * [x] [HTMLRenderView] [앱솔루트 아이템] -> [앱솔루트 아이템] = move(newDist), targetItem.appendChild(ghost), refreshAllCanvas*
   *
   * * [x] [GhostToolView] [레이아웃 아이템] -> [백그라운드] = move(newDist), project.appendChild(ghost), refreshAllCanvas
   * * [x] [GhostToolView] [레이아웃 아이템] -> [앱솔루트 아이템] = move(newDist), targetItem.appendChild(ghost), refreshAllCanvas
   * * [x] [GhostToolView] [앱솔루트 아이템] -> [레이아웃 아이템, 첫번째] = move(newDist), targetItem.appendChild(ghost), refreshAllCanvas
   *   * [ ] [GhostToolView] [앱솔루트 아이템] -> [레이아웃 아이템, 선택, 앞/뒤] = move(newDist), targetItem.appendChild(ghost), refreshAllCanvas
   * * [x] [GhostToolView] [레이아웃 아이템] -> [레이아웃 아이템] = move(newDist), targetItem.appendChild(ghost), refreshAllCanvas
   *   * [ ] [GhostToolView] [레이아웃 아이템] -> [레이아웃 아이템, 선택, 앞/뒤] = move(newDist), targetItem.appendChild(ghost), refreshAllCanvas
   *   * 레이아웃의 순서에 따라서 달라짐
   * ```
   *
   *
   *
   */
  updateLayer() {
    const current = this.$selection.current;

    // 선택된 객체가 없으면 동작하지 않는다.
    if (!current) return;

    const newDist = this.getDist();

    if (newDist[0] === 0 && newDist[1] === 0) {
      // 움직이지 않은 상태는 GhostToolView 에서 아무것도 하지 않음.
      // NOOP
      return;
    }

    // 선택한 레이어와 targetItem 이 같은 경우 추가하지 않는다.
    if (this.targetItem && this.targetItem.id === current?.id) {
      return;
    }

    // 타겟이 없을때는 백그라운드로 인지해서 current 의 부모를 project 로 옮긴다.
    if (!this.targetItem) {
      this.insertToBackground();
      return;
    }

    // target 이 레이아웃이 있고
    if (this.targetItem.hasLayout()) {
      // 자식을 안가지고 있을 때는 그냥 appendChild 를 실행
      if (this.targetItem?.hasChildren() === false) {
        this.command(
          "moveLayerToTarget",
          "change target with move",
          current,
          this.targetItem,
          newDist,
          "appendChild"
        );
        return;
      } else {
        // 내부에 자식이 있을 때는 , 마지막 드래그 위치에 따라 달라짐
      }

    }

    // target parent 가 존재하고
    // 해당 아이템이 layout item 일 때
    if (this.targetParent) {
      this.insertToLayoutItem();
      return;
    }

    // layout item 이고, 부모가 다르면 targetItem(다른 부모)로 이동함
    if (current.isLayoutItem() && current.parent.id !== this.targetItem.id) {
      this.command(
        "moveLayerToTarget",
        "change target with move",
        current,
        this.targetItem,
        newDist,
        "appendChild"
      );
    }
  }

  [SUBSCRIBE("endGhostToolView")]() {
    this.updateLayer();

    this.initializeGhostView();
    this.load();

    this.$config.set("set.move.control.point", false);
  }
}
