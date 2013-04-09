var dismiss = '[data-dismiss="alert"]';

var Alert = function (el) {
    $$(dismiss).invoke('observer', 'click', function(){
        this.close;
    }.bind(el));
};

Alert.prototype.close = function (e) {
    var $this = e.findElement()
        , selector = $this.readAttribute('data-target')
        , $parent

    if (!selector) {
        selector = $this.readAttribute('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    (selector != undefined && selector.length > 0) ? $parent = $(selector) : '';
    ($parent != undefined && $parent.length) || ($parent = $this.hasClassName('alert') ? $this : $this.up())

    $parent.fire('alert:close')

    //if (e.isDefaultPrevented()) return

    $parent.removeClassName('in')

    function removeElement() {
        $parent.fire('alert:closed');
        $parent.remove();
    }

//    $.support.transition && $parent.hasClass('fade') ?
//        $parent.on($.support.transition.end, removeElement) :
    removeElement()
}


Element.addMethods({
    alert: function(element, option) {
        if (!(element = $(element))) return;
        var data = element.data('alert');
        if (!data) { element.data('alert', (data = new Alert(element))); };
        if (typeof option == 'string') { data[option].call(element); };
        return element;
    }
});

document.observe("dom:loaded",function(){
    $$(dismiss).invoke('observe', 'click', Alert.prototype.close);
});
