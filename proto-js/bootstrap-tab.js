/* ========================================================
 * bootstrap-tab.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


/* TAB CLASS DEFINITION
 * ==================== */

var Tab = function (element) {
    this.element = $(element)
}

Tab.prototype = {

    constructor: Tab

    , show: function () {
        var $this = this.element
            , $ul = $this.up('ul:not(.dropdown-menu)')
            , selector = $this.readAttribute('data-target')
            , previous
            , $target
            , e;

        if (!selector) {
            selector = $this.readAttribute('href');
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
        };

        if ($this.up('li').hasClassName('active') ) return;

        previous = $ul.select('.active:last a')[0];

        e = $this.fire('tab:show', {'target': $this, 'relatedTarget': previous});

        $this.fire(e);

        //if (e.isDefaultPrevented()) return

        $target = $$(selector).first();

        this.activate($this.up('li'), $ul);
        this.activate($target, $target.up(), function () {
            $this.fire('tab:shown', {'target': $this, 'relatedTarget' : previous});
        });
    }

    , activate: function ( element, container, callback) {
        var $active = container.select('> .active')[0]
        var transition = false;
//            , transition = callback
//                && $.support.transition
//                && $active.hasClassName('fade')

        function next() {
            if ($active) {
                $active
                    .removeClassName('active')
                    .select('> .dropdown-menu > .active')
                    .invoke('removeClassName', 'active');
            }

            element.addClassName('active');

            if (transition) {
                element[0].offsetWidth; // reflow for transition
                element.addClassName('in');
            } else {
                element.removeClassName('fade');
            };

            if ( element.up('.dropdown-menu') ) {
                element.up('li.dropdown').addClassName('active');
            };

            callback && callback();
        }

//        transition ?
//            $active.one($.support.transition.end, next) :
        next();
        if ($active) {
            $active.removeClassName('in');
        }
    }
}


Element.addMethods({
    tab: function(element, option) {
        if (!(element = $(element))) return;
        var data = element.data('tab');
        if (!data) { element.data('tab', (data = new Tab(element))); };
        if (typeof option == 'string') { data[option](); };
        return element;
    }
});

document.observe("dom:loaded",function(){
    $$('[data-toggle="tab"], [data-toggle="pill"]').invoke('observe','click',function(e){
        this.tab('show');
    });
});
