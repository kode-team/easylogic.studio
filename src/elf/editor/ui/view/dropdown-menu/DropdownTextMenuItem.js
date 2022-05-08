export function DropdownTextMenuItem() {
  return /*html*/ `<li class='text'><label>${this.$i18n(
    this.props.text
  )}</label></li>`;
}
