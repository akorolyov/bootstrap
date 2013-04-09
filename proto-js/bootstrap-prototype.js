/**
 * Created with JetBrains PhpStorm.
 * User: akorolyov
 * Date: 02.04.13
 * Time: 00:18
 * To change this template use File | Settings | File Templates.
 */

document.getHeight = function() {
    var body = document.body,
        html = document.documentElement;

    return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

Element.addMethods({
    data: function(elem, key, val) {
        var DATA_REGEX = /data-(\w+)/;
        var ii = 0;
        var nattr = elem.attributes.length;

        if (Object.isUndefined(elem['__data']) || !Object.isHash(elem['__data'])){
            elem['__data'] = $H();
            for (; ii < nattr; ++ii ) {
                var attr = elem.attributes[ii];
                if (attr && attr.name) {
                    var m = attr.name.match(DATA_REGEX);
                    if (m && m.length > 1) {
                        var datakey = m[1];
                        elem['__data'].set(datakey, attr.value);
                    }
                }
            }
        }

        if (key && val) {
            elem['__data'].set(key, val);
        } else if (key) {
            return elem['__data'].get(key);
        } else {
            return elem['__data'].toObject();
        }
    },

    isWindow: function(elem) {
        var toString = Object.prototype.toString.call(elem);
        return toString == '[object global]' || toString == '[object Window]' || toString == '[object DOMWindow]';
    },

    isVisible: function(elem) {
        return !elem.isHidden();
    },

    isHidden: function(elem) {
//        console.log(elem.offsetWidth <= 0 && elem.offsetHeight <= 0, ((elem.style && elem.style.display) || Element.getStyle( elem, "display" )) === "none");
        return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
            (((elem.style && elem.style.display) || Element.getStyle( elem, "display" )) === "none")
//            (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
    }
});
