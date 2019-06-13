import UIElement, { EVENT } from "../../../../../util/UIElement";
import { Length } from "../../../../../editor/unit/Length";
import { LOAD, CHANGE, INPUT } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import RangeEditor from "./RangeEditor";

export default class IterationCountEditor extends RangeEditor {

    initState() {
        var value = this.props.value

        if (value === 'infinite') {
            value = new Length(0, 'infinite')
        } else {
            value = Length.number(value.split('normal')[0])
        }
        var units = this.props.units || 'px,em,%';
        
        return {
            ...super.initState(), 
            ...{
                key: this.props.key,
                params: this.props.params || '',
                units,
                value
            }
        }
    }

}