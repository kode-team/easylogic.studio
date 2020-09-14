import UIElement from "@core/UIElement";
import { LOAD, INPUT, DEBOUNCE, CLICK } from "@core/Event";
import PathParser from "@parser/PathParser";


export default class PathDataEditor extends UIElement {

    initState() { 
        var parser = new PathParser(this.props.value || '')
        return {
            parser
        }
    }

    makeSegments () {
        return this.refs.$data.$$('.segment').map($segment => {
            var $command = $segment.$('.command');
            var command = $command.attr('data-command');
            
            if (command === 'Z' && $command.attr('data-toggle') === 'false') {
                return null; 
            }

            var values = $segment.$$('.values input[type=number]').map(it => {
                return +it.value; 
            })

            return {
                command,
                values
            }
        }).filter(it => it);
    }

    updateData() {
        var segments = this.makeSegments()

        this.state.parser.resetSegments(segments);

        this.modifyPathData();
    }

    modifyPathData() {
        this.parent.trigger(this.props.onchange, this.props.key, this.getValue(), this.props.params);
    }

    setValue (value) {
        this.setState({
            parser: new PathParser(value)
        })
    }

    getValue () {
        return this.state.parser.joinPath();
    }

    template() {

        return /*html*/`
            <div class='path-data-editor'>
                <div class='data' ref='$data'></div>
            </div>
        `
    }

    [LOAD('$data')] () {


        var  segments = []
        
        this.state.parser.segments.forEach((it, index) => {

            var s = {...it}

            segments.push(s);
            var next = this.state.parser.segments[index+1]
            if (next && next.command === 'M') {
                if (s.command !== 'Z') {
                    segments.push({command: 'Z', toggle: false, values: []})
                } else {
                    s.toggle = true; 
                } 
            }      

        });

        var last = this.state.parser.segments[this.state.parser.segments.length-1];
        if (last && last.command !== 'Z') {
            segments.push({command: 'Z', toggle: false, values: [] })
        }




        var arr = segments.map(it => {
            var cls = it.command === 'M' ? 'm' : '';
            return /*html*/`
                <div class='segment ${cls}'>
                    <div class='command' data-command='${it.command}' data-toggle="${it.toggle}" title='Toggle'>${it.command}</div>
                    <div class='values'>
                        ${it.values.map(v => {
                            return /*html*/`<input type="number" value="${v}" />`
                        }).join('')}

                        ${it.command === 'Z' ? (
                            it.toggle === false ? "opened" : 'closed'
                        ) : ''}
                    </div>
                </div>
            `
        })

        arr.unshift(/*html*/`
            <div class='segment-empty'>
                <div class='command'></div>
                <div class='values'>
                    <span>X</span>
                    <span>Y</span>
                </div>
            </div>
        `)

        return arr; 
    }

    [INPUT('$data input[type=number]') + DEBOUNCE(300)] (e) {
        this.updateData();
    }

    [CLICK('$data .command[data-toggle]')] (e) {
        var [command, toggle] = e.$dt.attrs('data-command', 'data-toggle');
        if (command === 'Z') {
            if (toggle !== 'false') {
                toggle = 'false'; 
            } else {
                toggle = 'true'
            }

            e.$dt.attr('data-toggle', toggle);

            this.updateData();
        }
    }
}