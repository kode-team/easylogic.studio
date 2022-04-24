import { EditorElement } from "../common/EditorElement";

export class TabPanel extends EditorElement {
  initState() {
    return {
      value: this.props.value || "",
    };
  }

  template() {
    const { content } = this.props;
    const { value } = this.state;
    return (
      <div class="tab-content scrollbar" data-value={value}>
        {content}
      </div>
    );
  }
}
