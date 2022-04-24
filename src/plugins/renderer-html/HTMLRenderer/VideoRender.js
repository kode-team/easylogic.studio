import LayerRender from "./LayerRender";

export default class VideoRender extends LayerRender {
  /**
   *
   * @param {Item} item
   */
  toNestedCSS() {
    return [
      {
        selector: "video",
        cssText: `
                width: 100%;
                height: 100%;
                pointer-events: none;
                `.trim(),
      },
    ];
  }

  /**
   *
   * Resource URL 얻어오기
   *
   * @param {Project} item
   */
  getUrl(item) {
    var { src } = item;
    var project = item.project;

    return project.getVideoValueById(src);
  }

  /**
   *
   * @param {Item} item
   */
  render(item) {
    var { id, controls, muted, poster, loop, crossorigin, autoplay } = item;

    return /*html*/ `
        <div class='element-item video' data-id="${id}">
            ${this.toDefString(item)}
            <video 
                controls="${controls}"
                src="${this.getUrl(item)}
                muted="${muted}"
                poster="${poster}"
                loop="${loop}"
                crossorigin="${crossorigin}"
                autoplay="${autoplay}"
            >
                Sorry, your browser doesn't support embedded videos.
            </video>
        </div>`;
  }

  /**
   *
   * @param {Item} item
   * @param {Dom} currentElement
   */
  update(item, currentElement) {
    const { currentTime, playbackRate, volume } = item;

    // select 하는 부분을 완전히 뺄 수 있을까?
    const $video = currentElement.$("video");
    if ($video) {
      $video.setProp({
        currentTime,
        playbackRate,
        volume,
      });
    }

    super.update(item, currentElement);
  }
}
