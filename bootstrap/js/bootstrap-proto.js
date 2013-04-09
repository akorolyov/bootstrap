/**
 * Created with JetBrains PhpStorm.
 * User: akorolyov
 * Date: 02.04.13
 * Time: 00:18
 * To change this template use File | Settings | File Templates.
 */

Element.addMethods({
    data: function(elem, key, val) {
        var DATA_REGEX = /data-(\w+)/;
        var ii = 0;
        var nattr = elem.attributes.length;
        if (key && val) {
            elem.setAttribute('data-' + key, val);
        }
        else {
            for (; ii < nattr; ++ii ) {
                var attr = elem.attributes[ii];
                if (attr && attr.name) {
                    var m = attr.name.match(DATA_REGEX);
                    if (m && m.length > 1) {
                        var datakey = m[1];
                        if (datakey === key) {
                            return attr.value;
                        }
                    }
                }
            }
        }
    }
});

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

//
//!function ($) {
//
//    "use strict"; // jshint ;_;
//
//
//    /* TAB CLASS DEFINITION
//     * ==================== */
//
//    var Tab = function (element) {
//        this.element = $(element)
//    }
//
//    Tab.prototype = {
//
//        constructor: Tab
//
//        , show: function () {
//            var $this = this.element
//                , $ul = $this.closest('ul:not(.dropdown-menu)')
//                , selector = $this.attr('data-target')
//                , previous
//                , $target
//                , e
//
//            if (!selector) {
//                selector = $this.attr('href')
//                selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
//            }
//
//            if ( $this.parent('li').hasClass('active') ) return
//
//            previous = $ul.find('.active:last a')[0]
//
//            e = $.Event('show', {
//                relatedTarget: previous
//            })
//
//            $this.trigger(e)
//
//            if (e.isDefaultPrevented()) return
//
//            $target = $(selector)
//
//            this.activate($this.parent('li'), $ul)
//            this.activate($target, $target.parent(), function () {
//                $this.trigger({
//                    type: 'shown'
//                    , relatedTarget: previous
//                })
//            })
//        }
//
//        , activate: function ( element, container, callback) {
//            var $active = container.find('> .active')
//                , transition = callback
//                    && $.support.transition
//                    && $active.hasClass('fade')
//
//            function next() {
//                $active
//                    .removeClass('active')
//                    .find('> .dropdown-menu > .active')
//                    .removeClass('active')
//
//                element.addClass('active')
//
//                if (transition) {
//                    element[0].offsetWidth // reflow for transition
//                    element.addClass('in')
//                } else {
//                    element.removeClass('fade')
//                }
//
//                if ( element.parent('.dropdown-menu') ) {
//                    element.closest('li.dropdown').addClass('active')
//                }
//
//                callback && callback()
//            }
//
//            transition ?
//                $active.one($.support.transition.end, next) :
//                next()
//
//            $active.removeClass('in')
//        }
//    }
//
//
//    /* TAB PLUGIN DEFINITION
//     * ===================== */
//
//    var old = $.fn.tab
//
//    $.fn.tab = function ( option ) {
//        return this.each(function () {
//            var $this = $(this)
//                , data = $this.data('tab')
//            if (!data) $this.data('tab', (data = new Tab(this)))
//            if (typeof option == 'string') data[option]()
//        })
//    }
//
//    $.fn.tab.Constructor = Tab
//
//
//    /* TAB NO CONFLICT
//     * =============== */
//
//    $.fn.tab.noConflict = function () {
//        $.fn.tab = old
//        return this
//    }
//
//
//    /* TAB DATA-API
//     * ============ */
//
//    $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
//        e.preventDefault()
//        $(this).tab('show')
//    })
//
//}(window.jQuery);

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

        e = $this.fire('bootstrap:show', previous);

        $this.fire(e);

        //if (e.isDefaultPrevented()) return

        $target = $$(selector).first();

        this.activate($this.up('li'), $ul);
        this.activate($target, $target.up(), function () {
            $this.fire('bootstrap:shown', previous);
        });
    }

    , activate: function ( element, container, callback) {

        console.log(arguments);
        var $active = container.select('> .active').first();
        var transition = false;
//            , transition = callback
//                && $.support.transition
//                && $active.hasClassName('fade')

        console.log($active);

        function next() {
            $active
                .removeClassName('active')
                .select('> .dropdown-menu > .active')
                .invoke('removeClassName', 'active');

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

            callback && callback()
        }

//        transition ?
//            $active.one($.support.transition.end, next) :
        next();
        $active.removeClass('in');
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

$$('#myTab a:first').invoke('tab', 'show');
