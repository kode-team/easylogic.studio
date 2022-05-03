import locales from "./locales";

/**
 * register i18n default messages
 *
 * @param {Editor} editor
 */
export default function (editor) {
  Object.keys(locales).forEach(function (locale) {
    editor.registerI18nMessage(locale, locales[locale]);
  });
}
