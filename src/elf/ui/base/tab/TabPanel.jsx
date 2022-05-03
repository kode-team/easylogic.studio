import { UIElement } from "sapa";

export class TabPanel extends UIElement {
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
