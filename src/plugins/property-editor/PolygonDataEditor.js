import { LOAD, INPUT, DEBOUNCE } from "sapa";
import PolygonParser from "elf/editor/parser/PolygonParser";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

import "./PolygonDataEditor.scss";

export default class PolygonDataEditor extends EditorElement {
  initState() {
    var parser = new PolygonParser(this.props.value || "");
    return {
      parser,
    };
  }

  makeSegments() {
    return this.refs.$data.$$(".segment").map(($segment) => {
      var x = +$segment.$('[data-key="x"]').value;
      var y = +$segment.$('[data-key="y"]').value;

      return { x, y };
    });
  }

  updateData() {
    var segments = this.makeSegments();

    this.state.parser.resetSegments(segments);

    this.modifyPolygonData();
  }

  modifyPolygonData() {
    this.parent.trigger(
      this.props.onchange,
      this.props.key,
      this.getValue(),
      this.props.params
    );
  }

  setValue(value) {
    this.setState({
      parser: new PolygonParser(value || ""),
    });
  }

  getValue() {
    return this.state.parser.joinPoints();
  }

  template() {
    return /*html*/ `
            <div class='elf--polygon-data-editor'>
                <div class='data' ref='$data'></div>
            </div>
        `;
  }

  [LOAD("$data")]() {
    return this.state.parser.segments.map((it) => {
      return /*html*/ `
                <div class='segment'>
                    <div class='values'>
                        <label>X <input type="number" data-key="x" value="${it.x}" /></label>
                        <label>Y <input type="number" data-key="y" value="${it.y}" /></label>
                    </div>
                </div>
            `;
    });
  }

  [INPUT("$data input[type=number]") + DEBOUNCE(300)]() {
    this.updateData();
  }
}
