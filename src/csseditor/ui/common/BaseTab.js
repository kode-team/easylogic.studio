import UIElement from "../../../util/UIElement";
import Dom from "../../../util/Dom";
import { CLICK, IF } from "../../../util/Event";


export default class BaseTab extends UIElement {

    template () {
        return `
        <div class="tab">
            <div class="tab-header" ref="$header">
                <div class="tab-item selected" data-id="1">1</div>
                <div class="tab-item" data-id="2">2</div>
            </div>
            <div class="tab-body" ref="$body">
                <div class="tab-content selected" data-id="1"></div>
                <div class="tab-content" data-id="2"></div>
            </div>
        </div>
        `
    }

    isNotSelectedTab (e) {
        return !e.$delegateTarget.hasClass('selected')
    }

    [CLICK('$header .tab-item') + IF('isNotSelectedTab')] (e, $dt) {
        this.selectTab($dt.attr('data-id'))
    }

    selectTab (id) {

        this.selectedTabId = id; 

        this.refs.$header.children().forEach($dom => {
            $dom.toggleClass('selected', $dom.attr('data-id') == id )
        })

        this.refs.$body.children().forEach($dom => {
            $dom.toggleClass('selected', $dom.attr('data-id') == id )
        })        

        this.onTabShow()
    } 

    onTabShow() {}


    setScrollTabTitle ($scrollPanel) {
        var offset = $scrollPanel.offset();
        var $tabElementTitle = $scrollPanel.$(".tab-element-title") ;

        if (!$tabElementTitle) {
            $scrollPanel.append(Dom.create('div', 'tab-element-title'))
            $tabElementTitle = $scrollPanel.$(".tab-element-title") ;
        }

        var elementsInViewport = $scrollPanel.children().map($dom => {
            var rect = $dom.rect();
            if (offset.top <= rect.bottom ) {
                return { $dom, isElementInViewport: true}
            }
            return { $dom, isElementInViewport: false}
        })

        var title = '';
        if (elementsInViewport.length) {

            var viewElement = elementsInViewport.filter(it => {
                return it.isElementInViewport
            })

            if (viewElement.length) {                                
                var $dom = viewElement[0].$dom;
                var $title = $dom.$(".title");

                if ($title && offset.top > $title.rect().bottom) {
                    title = $title.text();
                }
            }
        }

        if (title) {
            if($tabElementTitle.css('display') == 'none') {
                $tabElementTitle.show()
            }            
            $tabElementTitle.px('top', $scrollPanel.scrollTop()).text(title);            
        } else {
            $tabElementTitle.hide();
        }
    }
} 