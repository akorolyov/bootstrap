/**
 * Created with JetBrains PhpStorm.
 * User: akorolyov
 * Date: 02.04.13
 * Time: 00:18
 * To change this template use File | Settings | File Templates.
 */

Element.addMethods({
    data: function(elem, key, val) {
        if (key && val) {
            if (typeof elem.__data == 'object') {
                elem.__data[key] = val;
            } else {
                elem.__data = {};
                elem.__data[key] = val;
            }
        } else if (key && typeof elem.__data == 'object') {
            return elem.__data[key];
        } else {
            return elem.__data;
        }
    }
});
