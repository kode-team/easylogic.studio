import { getDist } from "elf/core/math";

export class SegmentManager {
  /**
   *
   * @param {ViewportManager} viewport
   */
  constructor(viewport) {
    this.viewport = viewport;
    this.segmentList = [];
  }

  get hasViewport() {
    return Boolean(this.viewport);
  }

  reset() {
    this.segmentList = [];
    return this;
  }

  checkInViewport(point) {
    if (!this.hasViewport) return true;

    const vertext = this.viewport.applyVertexInverse([point.x, point.y, 0]);

    return this.viewport.checkInViewport(vertext);
  }

  addLine(a, b) {
    if (this.hasViewport && getDist(a.x, a.y, b.x, b.y) < 1) return this;

    if (this.checkInViewport(a) || this.checkInViewport(b)) {
      this.segmentList.push({
        line: true,
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y,
      });
    }
    return this;
  }

  addGuideLine(a, b) {
    if (this.hasViewport && getDist(a.x, a.y, b.x, b.y) < 1) return this;

    if (this.checkInViewport(a) || this.checkInViewport(b)) {
      this.segmentList.push({
        line: true,
        guide: true,
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y,
      });
    }
    return this;
  }

  addDistanceLine(a, b) {
    if (this.hasViewport && getDist(a.x, a.y, b.x, b.y) < 1) return this;

    this.segmentList.push({
      line: true,
      distance: true,
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
    });
    return this;
  }

  addDistanceAngle(center, rx, ry, degree, last, line) {
    this.segmentList.push({
      angle: true,
      rx,
      ry,
      line,
      degree,
      center,
      last,
    });
    return this;
  }

  addPoint(obj, point, index, segment, selected = false) {
    if (this.checkInViewport(point)) {
      this.segmentList.push({
        ...obj,
        cx: point.x,
        cy: point.y,
        selected,
        index,
        segment,
        isFirst: point.isFirst,
        isLast: point.isLast,
        isSecond: point.isSecond,
      });
    }

    return this;
  }

  addStartPoint(obj, point) {
    if (this.checkInViewport(point)) {
      this.segmentList.push({
        ...obj,
        cx: point.x,
        cy: point.y,
        start: true,
      });
    }

    return this;
  }

  addCurvePoint(point, index, segment, selected = false) {
    if (this.checkInViewport(point)) {
      this.segmentList.push({
        curve: true,
        cx: point.x,
        cy: point.y,
        index,
        selected,
        segment,
        isFirst: point.isFirst,
        isLast: point.isLast,
        isSecond: point.isSecond,
      });
    }

    return this;
  }

  addText(point, text) {
    this.segmentList.push({
      type: "text",
      cx: point.x,
      cy: point.y,
      text: text + "",
    });

    return this;
  }

  toString() {
    this.segmentList.sort((a, b) => {
      if (a.line && !b.line) {
        return -1;
      } else if (!a.line && b.line) {
        return 1;
      }
      return 0;
    });

    return this.segmentList
      .map((it) => {
        if (it.angle) {
          return /*html*/ `
                <path stroke-width='1' 
                    data-distance='true'
                    fill="rgba(0,0,0,0.5)"
                    d="M ${it.center.x},${it.center.y} A ${it.rx} ${it.ry},${it.degree},0,0,${it.last.x} ${it.last.y} L${it.line.x} ${it.line.y} Z"
                />`;
        } else if (it.line) {
          return /*html*/ `
                <line stroke-width='1' 
                    data-segment="true"
                    data-is-last="${it.isLast}"                
                    data-guide='${it.guide}'
                    data-distance='${it.distance}'
                    x1='${it.x1}' x2='${it.x2}' y1='${it.y1}' y2='${it.y2}' 
                />`;
        } else if (it.text) {
          return "";
          // return /*html*/ `
          // <text x="${it.cx}" y="${it.cy}" dx="5" dy="-5" text-anchor="start">${it.text}</text>
          // `
        } else if (it.curve && it.segment !== "startPoint") {
          return /*html*/ `
                <path stroke-width='1'
                    class='curve' 
                    ${it.selected && `data-selected="true"`}
                    ${it.isLast && `data-is-last="true"`}
                    ${it.isFirst && `data-is-first="true"`}
                    ${it.isSecond && `data-is-second="true"`}
                    title="${it.segment} curve"  
                    data-index='${it.index}'
                    data-segment-point='${it.segment}'
                    data-segment="true" 
                    d="M ${it.cx} ${it.cy - 4}L ${it.cx + 4} ${it.cy} L ${
            it.cx
          } ${it.cy + 4} L ${it.cx - 4} ${it.cy} Z"
                />`;
        } else if (it.start) {
          return /*html*/ `
                <circle 
                    cx='${it.cx}' 
                    cy='${it.cy}' 
                    r='4'                    
                    class='segment'
                    data-selected='${it.selected}'
                    title="Center"
                    data-start="true" 
                    tabIndex="-1"
                />`;
        } else {
          return /*html*/ `
                <circle 
                    cx='${it.cx}' 
                    cy='${it.cy}' 
                    r='4'                    
                    class='segment'
                    data-selected='${it.selected}'
                    title="${it.segment}"
                    data-is-last="${it.isLast}"
                    data-is-first="${it.isFirst}"
                    data-is-second="${it.isSecond}"
                    data-index='${it.index}' 
                    data-segment-point='${it.segment}' 
                    data-segment="true" 
                    tabIndex="-1"                    
                />`;
        }
      })
      .join("");
  }
}
