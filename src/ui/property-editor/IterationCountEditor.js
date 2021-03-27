
import { registElement } from "@sapa/registerElement";
import { Length } from "@unit/Length";
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

registElement({ IterationCountEditor })