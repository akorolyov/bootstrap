function ScrollSpy(element, options) {
    var process = this.process.bind(this);
    var $element = element.match('body') ? document : element;
    var href;

    this.options = Object.extend(options, Element.scrollspy.defaults);

    this.$scrollElement = $element.observe('scroll', process);

    this.selector = (this.options.target || ((href = element.readAttribute('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) || '') + ' .nav li > a';

    this.$body = $$('body').first();
    this.refresh();
    this.process()
}

ScrollSpy.prototype = {

    constructor: ScrollSpy

    , refresh: function () {
        var self = this;
        var $targets;

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
            .select(this.selector)
            .map(function (item, index) {
                var $el = item;
                var href = $el.data('target') || $el.readAttribute('href');
                var $href = /^#\w/.test(href) && $$(href);
                return ( $href
                    && $href.length
                    && [Element.cumulativeOffset($href.first()).top + (Element.viewportOffset(self.$scrollElement).top), href ]) || null
            })
            .sort(function (a, b) { if (!a || !b) {return 1}; return a[0] - b[0] })
            .each(function (item) {
                if (item) {
                    self.offsets.push(item[0]);
                    self.targets.push(item[1]);
                }
            });
    }

    , process: function () {
        var scrollTop = ((this.$scrollElement.viewport && this.$scrollElement.viewport.getScrollOffsets().top) || this.$scrollElement.scrollTop) + parseInt(this.options.offset);
        var scrollHeight = this.$scrollElement.scrollHeight || this.$body.scrollHeight;
        var maxScroll = scrollHeight - ((this.$scrollElement.viewport && this.$scrollElement.viewport.getDimensions().height) || this.$scrollElement.getHeight());
        var offsets = this.offsets;
        var targets = this.targets;
        var activeTarget = this.activeTarget;
        var i;

        if (scrollTop >= maxScroll) {
            return activeTarget != (i = targets.last())
                && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
            activeTarget != targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1]) && this.activate( targets[i] )
        }
    }

    , activate: function (target) {
        var active
            , selector

        this.activeTarget = target

        $$(this.selector).each(function(item){
            if (item.up('.active')){
                item.up('.active').removeClassName('active');
            };
        });

        selector = this.selector
            + '[data-target="' + target + '"],'
            + this.selector + '[href="' + target + '"]';

        active = $$(selector).each(function(item){
            var p = item.up('li');
            p.addClassName('active');
        });

        if (active[0].up('.dropdown-menu') && active[0].up('.dropdown-menu').length)  {
            active = active[0].up('li.dropdown').addClassName('active')
        }

        active.invoke('fire', 'scroll:activate');
    }

}

Element.addMethods({
    scrollspy: function(element, option) {
        if (!(element = $(element))) return;
        var data = element.data('scrollspy');
        var options = typeof option == 'object' && option;

        if (!data) { element.data('scrollspy', (data = new ScrollSpy(element, options))); };
        if (typeof option == 'string') { data[option](); };
        return element;
    }
});

Element.scrollspy.defaults = {
    offset: 10
};


document.observe("dom:loaded",function(){
    $$('[data-spy="scroll"]').each(function (item) {
        item.scrollspy(item.data());
    });
});
