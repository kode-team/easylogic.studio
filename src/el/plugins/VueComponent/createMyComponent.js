import * as Vue from 'vue/dist/vue.esm-bundler';

export default function render (props, container) {
    container.innerHTML = /*html*/`

      <div>
        <a href="https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=${encodeURIComponent(props.value)}" target="_blank">Counter: {{ counter }}</a>
        <div style="background-color: {{ backgroundColor }}">
          color: {{ backgroundColor }}
        </div>

      </div>
    `
    return Vue.createApp({
      data() {
        return {
          counter: props.value,
          backgroundColor: props['background-color']
        }
      }
    }).mount(container);
    
}