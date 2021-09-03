
import { EditorElement } from '../common/EditorElement';

export class TabPanel extends EditorElement {

    initState() {
  
      const selected = this.props.selected === 'true' ? true : false;
  
      return {
        value: this.props.value || '',
      }
    }
  
    template() {
      const {content} = this.props;
      const {value} = this.state;
      return /*html*/`
        <div class="tab-content scrollbar" data-value="${value}">
          ${content}
        </div>
      `
    }
  }
  
  