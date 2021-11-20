
import createEmotion from '@emotion/css/create-instance';
import UIElement from 'el/sapa/UIElement';
import WebComponent from 'el/sapa/WebComponent';
import SecondElement from './SecondElement';
import { uuidShort } from 'el/utils/math';



export default class MyElement extends UIElement {

    static get attributes () {
      return ['key', 'value', 'class', 'style']
    }

    static get style() {
        return `
            background-color: blue;

            .my-element {
                background-color: red;
            }
        `
    }

    afterRender() {

        if (!this.__localStyle) {
            const { css } = createEmotion({
                key: uuidShort().replace(/[0-9]/g, ''),
                container: this.$el.el
            })
    
            this.__localStyle = css(MyElement.style)

            this.$el.addClass(this.__localStyle);

        }


    }
  
    components() {
      return {
        SecondElement
      }
    }
    template() {
  
      const {key, value} = this.props;
  
      return `
        <div>나만의 element {key=${key}, value=${value}}}
        
            <div class="my-element">red</div>

          <object refClass="SecondElement" />
  
        </div>`
    }
}


customElements.define('my-element', WebComponent(MyElement))