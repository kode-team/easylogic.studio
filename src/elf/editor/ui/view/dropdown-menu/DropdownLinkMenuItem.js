export function DropdownLinkMenuItem() {
  return /*html*/ `<li>
        <a href="${this.props.href}" target="${
    this.props.target || "_blank"
  }">${this.$i18n(this.props.title)}</a>
      </li>`;
}
