export default class BaseHandler {
  /**
   *
   * @param {EventMachine} context
   * @param {*} options
   */
  constructor(context, options = {}) {
    this.context = context;
    this.options = options;
  }

  // 초기화 설정
  initialize() {}

  // html 을 로드 할 때
  load() {}

  // 새로고침 할 때
  refresh() {}

  // 화면에 그린 이후에 실행 되는 로직들
  render() {}

  getRef(id) {
    return this.context.getRef(id);
  }

  run() {}

  destroy() {}
}
