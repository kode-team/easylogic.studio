import _icon_template from "./_icon_template";

export default function (transform = "") {
  return /*html*/ _icon_template(
    `
        <g transform='${transform}'><path fill='#fff' d='M2.6 5.6L0 8.3 2.6 11l1.2-1.2-.5-.5h9.4l-.5.5 1.2 1.2L16 8.3l-2.6-2.7-1.2 1.2.5.5H3.3l.5-.5-1.2-1.2z'/><path fill='#231f20' d='M5.1 279h-4v1h5v-5h-1zm5 0v5h-5v1h5v5h1v-5h5v-1h-5v-5z'/><path fill='#fff' d='M.6 278.5h4v-4h2v6h-6zm4.5.5h-4v1h5v-5h-1zm4.5-.5h2v5h5v2h-5v5h-2v-5h-5v-2h5zm.5 5.5h-5v1h5v5h1v-5h5v-1h-5v-5h-1z'/><path fill='#000' d='M2.6 6.3l-2 2 2 2 .6-.5-1-1H14l-1 1 .5.5 2-2-2-2-.5.5 1 1H2.1l1-1-.5-.5z'/></g>
    `,
    { width: 24, height: 24, viewBoxWidth: 16, viewBoxHeight: 16 }
  );
}
