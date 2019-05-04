import BaseProperty from "./BaseProperty";

export default class FilterProperty extends BaseProperty {

    getTitle () { return 'Filter'; }
    getBody () {
        return `<!-- FilterList /-->`
    }
}