import UIElement, { EVENT } from "../../../util/UIElement";

const shapeList = ['circle', 'ellipse', 'inset', 'polygon', 'path']

export default class ShapeEditor extends UIElement {

    initState() {
        return {
            value: this.props.value
        }
    }

    updateData(opt = {}) {
        this.setState(opt);
        this.modifyShape();
    }

    modifyShape() {
        this.state.target.trigger(this.state.onchange, this.state.key, this.state.value, this.state.params);
    }

    [EVENT('showShapeEditor')] (opt = {}) {
        this.setState(opt, false)
        this.refresh();
        this.el.show();
    }

    [EVENT('hideShapeEditor')] () {
        this.el.hide();
    }

    refresh () {

        shapeList.forEach(key => {
            var comp = this.children[`$${key}`];
            if (this.state.value.includes(key)) {
                comp.show()
                comp.setValue(this.state.value)
            } else {
                comp.hide()
            }
        })
    }

    template() {
        return /*html*/`
            <div class='shape-editor'>
                <CircleShapeEditor ref='$circle' onchange="changeShapeValue" />
                <EllipseShapeEditor ref='$ellipse' onchange="changeShapeValue" />
                <InsetShapeEditor ref='$inset' onchange="changeShapeValue" />
                <PolygonShapeEditor ref='$polygon' onchange="changeShapeValue" />
                <PathShapeEditor ref='$path' onchange="changeShapeValue" />            
            </div>
        `
    }

    [EVENT('changeShapeValue')] (value) {
        this.updateData({ value })
    }



}