import BaseProperty from "./BaseProperty";
import { INPUT, CHANGE } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { editor } from "../../../../../editor/editor";
import { Length } from "../../../../../editor/unit/Length";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_SELECTION,
  CHANGE_EDITOR,
  CHANGE_ARTBOARD
} from "../../../../types/event";

export default class FontSpacingProperty extends BaseProperty {
  getTitle() {
    return "Spacing";
  }

  [EVENT(CHANGE_EDITOR, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }

  refresh() {
    var current = editor.selection.current;
    if (current) {
      var spacing = current.spacing;
      if (spacing.letter) {
        this.refs.$letter.val(spacing.letter.value);
        this.refs.$letterNumber.val(spacing.letter.value);
        this.refs.$letterUnit.val(spacing.letter.unit);
      }

      if (spacing.word) {
        this.refs.$word.val(spacing.word.value);
        this.refs.$wordNumber.val(spacing.word.value);
        this.refs.$wordUnit.val(spacing.word.unit);
      }
    }
  }

  getBody() {
    return html`
      <div class="property-item font-item">
        <label>Letter</label>
        <div class="input">
          <div class="input-field">
            <input type="range" max="100" min="-100" value="0" ref="$letter" />
          </div>
          <div class="input-field">
            <input
              type="number"
              max="100"
              min="-100"
              value="0"
              ref="$letterNumber"
            />
          </div>
          <select ref="$letterUnit">
            <option value="px">px</option>
            <option value="em">em</option>
            <option value="rem">rem</option>
          </select>
        </div>
      </div>

      <div class="property-item font-item">
        <label>Word</label>
        <div class="input">
          <div class="input-field">
            <input type="range" max="100" min="-100" value="0" ref="$word" />
          </div>
          <div class="input-field">
            <input
              type="number"
              max="100"
              min="-100"
              value="0"
              ref="$wordNumber"
            />
          </div>
          <select ref="$wordUnit">
            <option value="px">px</option>
            <option value="em">em</option>
            <option value="rem">rem</option>
          </select>
        </div>
      </div>

      <div class="property-item font-item">
        <label>Indent</label>
        <div class="input">
          <div class="input-field">
            <input type="range" max="100" min="-100" value="0" ref="$indent" />
          </div>
          <div class="input-field">
            <input
              type="number"
              max="100"
              min="-100"
              value="0"
              ref="$indentNumber"
            />
          </div>
          <select ref="$indentUnit">
            <option value="px">px</option>
            <option value="em">em</option>
            <option value="rem">rem</option>
          </select>
        </div>
      </div>
    `;
  }

  [INPUT("$letter")](e) {
    this.refs.$letterNumber.val(this.refs.$letter.value);
    this.setContent();
  }

  [INPUT("$letterNumber")](e) {
    this.refs.$letter.val(this.refs.$letterNumber.value);
    this.setContent();
  }

  [CHANGE("$letterUnit")]() {
    this.setContent();
  }

  [INPUT("$word")](e) {
    this.refs.$wordNumber.val(this.refs.$word.value);
    this.setContent();
  }

  [INPUT("$wordNumber")](e) {
    this.refs.$word.val(this.refs.$wordNumber.value);
    this.setContent();
  }

  [CHANGE("$wordUnit")]() {
    this.setContent();
  }


  [INPUT("$indent")](e) {
    this.refs.$indentNumber.val(this.refs.$indent.value);
    this.setContent();
  }

  [INPUT("$indentNumber")](e) {
    this.refs.$indent.val(this.refs.$indentNumber.value);
    this.setContent();
  }

  [CHANGE("$indentUnit")]() {
    this.setContent();
  }

  setContent() {
    var current = editor.selection.current;
    if (current) {
      var letter = new Length(
        this.getRef("$letterNumber").value,
        this.getRef("$letterUnit").value
      );

      var word = new Length(
        this.getRef("$wordNumber").value,
        this.getRef("$wordUnit").value
      );

      var indent = new Length(
        this.getRef("$indentNumber").value,
        this.getRef("$indentUnit").value
      );      

      current.reset({
        spacing: { letter, word, indent }
      });

      this.emit("refreshCanvas");
    }
  }
}
