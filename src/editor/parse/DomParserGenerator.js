import ParserGenerator from "./ParserGenerator";
import Dom from "../../util/Dom";
import { isFunction } from "../../util/functions/func";

export class DomParserGenerator extends ParserGenerator {
  setSource(source) {
    this.source = source;
  }

  initialize() {
    this.container.addEventListener("click", e => {
      if (e.target) {
        if (this.source) {
          this.source.removeAttr("data-embed-editor-target");
        }

        var $target = Dom.create(e.target);
        $target.attr("data-embed-editor-target", "true");

        this.setSource($target);

        this.parse();
      }
    });

    this.container.addEventListener("input", e => {
      if (e.target && this.source) {
        this.parseText();
      }
    });
  }

  // 이건 선택된 element 의 style 을 파싱해서 실제로 CSS Editor 가 원하는 객체로 넘겨주는 거임
  // 흠 그런데 가만 생각해보니 이건 여기 있으면 안 될 것 같은데 .......
  // parse 는 단순해야함.
  // 예를 들어  obj.style.backgroundColor 라는게 있었다고 한다면
  // { 'background-color': 'yellow' } 만 전달해야함
  // 실제로 파싱한 객체를 저기서 가지고 있는게 아니라 흠 어렵네 ?
  // 외부에서 쓸 때는 내부 객체를 모를꺼니 그냥 내부에 파싱을 해야겠네.....
  parse() {
    // $target 의 설정 가능한 값 파싱하기
    var data = this.source.getStyleList(
      "width",
      "height",
      "margin",
      "padding",
      "line-height",
      "font-size",
      'font-stretch',
      "letter-spacing",
      "word-spacing",
      'text-indent'
    );
    data.content = this.source.text();

    if (this.target && isFunction(this.target.parseEnd)) {
      this.target.parseEnd(data);
    }
  }

  parseText() {
    // $target 의 설정 가능한 값 파싱하기
    var data = {};
    data.content = this.source.text();

    if (this.target && isFunction(this.target.parseEnd)) {
      this.target.parseEnd(data);
    }
  }

  // 여긴 css editor 가 준 값임. css object 형태로 줌
  // 예를 들어  { 'border-radius': '3px' } 대략 이정도로 줌
  generate(cssObject) {
    // 이건 Dom 기준이라 해당 소스 element에  그냥 CSS 를 넣으면 끝남
    if (this.source) {
      this.source.css(cssObject);
      if (this.source.text() != cssObject.content) {
        this.source.text(cssObject.content);
      }
    }
  }
}
