var Affix = function (element, options) {
    this.options = Object.extend({}, options, Element.affix.defaults)

    this.$window = document
        .observe('scroll', this.checkPosition.bind(this))
        .observe('click',  function () { setTimeout(this.checkPosition.bind(this), 1)}.bind(this))
    this.$element = element
    this.checkPosition()
}

Affix.prototype.checkPosition = function () {
    if (!this.$element.isVisible()) return

    var scrollHeight = this.$window.getHeight()
        , scrollTop = this.$window.viewport.getScrollOffsets().top
        , positionTop = this.$element.viewportOffset().top + this.$window.viewport.getScrollOffsets().top
        , offset = this.options.offset
        , offsetBottom = offset.bottom
        , offsetTop = offset.top
        , reset = 'affix affix-top affix-bottom'
        , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()


    affix = this.unpin != null && (scrollTop + this.unpin <= positionTop) ?
        false    : offsetBottom != null && (positionTop + this.$element.getHeight() >= scrollHeight - offsetBottom) ?
        'bottom' : offsetTop != null && scrollTop <= offsetTop ?
        'top'    : false;
    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? positionTop - scrollTop : null

    this.$element
        .removeClassName('affix')
        .removeClassName('affix-top')
        .removeClassName('affix-bottom')
        .addClassName('affix' + (affix ? '-' + affix : ''));
}

Element.addMethods({
    affix: function(element, option) {
        if (!(element = $(element))) return;
        var data = element.data('affix');
        var options = typeof option == 'object' && option;

        if (!data) { element.data('affix', (data = new Affix(element, options))); };
        if (typeof option == 'string') { data[option](); };
        return element;
    }
});

Element.affix.defaults = {
    offset: 0
};

document.observe("dom:loaded",function(){
    $$('[data-spy="affix"]').each(function(item){
        var data = item.data()

        data.offset = data.offset || {}

        data.offsetBottom && (data.offset.bottom = data.offsetBottom)
        data.offsetTop && (data.offset.top = data.offsetTop)
        item.affix(data);
    });
});
