var Typeahead = function (element, options) {
    this.$element = element;
    this.options = Object.extend(Element.typeahead.defaults, options);
    this.matcher = this.options.matcher || this.matcher;
    this.sorter = this.options.sorter || this.sorter;
    this.highlighter = this.options.highlighter || this.highlighter;
    this.updater = this.options.updater || this.updater;
    this.source = this.options.source;
    this.$menu = this.options.menu.clone(true);
    this.shown = false;
    this.listen();


};


Typeahead.prototype = {

    constructor: Typeahead,

    select: function () {
        var val = this.$menu.select('.active').first().getAttribute('data-value')
        this.$element.value  = this.updater(val);
        Event.simulate(this.$element, 'change');
        return this.hide();
    },

    updater: function (item) {
        return item
    },

    show: function () {
        var pos = this.$element.getLayout();
        var height = this.$element.offsetHeight;

        this.$element.insert({'after': this.$menu});

        this.$menu.setStyle({
            top: (pos.get('top') + height)+'px',
            left: pos.get('left') + 'px',
            display: 'block'
        });
        this.shown = true
        return this
    },

    hide: function () {
        this.$menu.setStyle({display:'none'});
        this.shown = false;
        return this;
    },

    lookup: function (event) {
        var items

        this.query = this.$element.value;

        if (!this.query || this.query.length < this.options.minLength) {
            return this.shown ? this.hide() : this
        }

        items = (typeof this.source === 'function') ? this.source(this.query, this.process.bind(this)) : this.source;

        return items ? this.process(items) : this
    },

    process: function (items) {
        items = items.filter(function (item) {
            return this.matcher(item)
        }.bind(this))

        items = this.sorter(items)

        if (!items.length) {
            return this.shown ? this.hide() : this
        }

        return this.render(items.slice(0, this.options.items)).show()
    },

    matcher: function (item) {
        return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    },

    sorter: function (items) {
        var beginswith = []
            , caseSensitive = []
            , caseInsensitive = []
            , item

        while (item = items.shift()) {
            if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
            else if (~item.indexOf(this.query)) caseSensitive.push(item)
            else caseInsensitive.push(item)
        }

        return beginswith.concat(caseSensitive, caseInsensitive)
    },

    highlighter: function (item) {
        var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
        return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
            return '<strong>' + match + '</strong>'
        })
    },

    render: function (items) {
        this.$menu.innerHTML = '';
        items = $(items).map(function (item) {
            var el = this.options.item.clone(true);
            el.writeAttribute('data-value', item);
            el.select('a').first().update(this.highlighter(item))
            return el;
        }.bind(this));

        items.first().addClassName('active');
        items.each(function(i){
            this.$menu.insert(i);
            i.on('mouseenter', this.mouseenter.bindAsEventListener(this));
            i.on('mouseleave', this.mouseleave.bindAsEventListener(this));
        }.bind(this))

        return this;
    },

    next: function () {
        var active = this.$menu.select('.active').first();
        active.removeClassName('active');
        var next = active.nextSiblings()[0];

        if (!next) {
            next = this.$menu.select('li').first();
        }

        next.addClassName('active')
    },

    prev: function () {
        var active = this.$menu.select('.active').first();
        active.removeClassName('active');
        var prev = active.previousSiblings()[0]

        if (!prev) {
            prev = this.$menu.select('li').last();
        };

        prev.addClassName('active');
    },

    listen: function () {
        this.$element.on('focus', this.focus.bind(this));
        this.$element.on('blur', this.blur.bind(this));
        this.$element.on('keypress', this.keypress.bind(this));
        this.$element.on('keyup', this.keyup.bind(this));

        if (this.eventSupported('keydown')) {
            this.$element.on('keydown', this.keydown.bindAsEventListener(this))
        }


        this.$menu.on('click', this.click.bindAsEventListener(this));
    },

    eventSupported: function(eventName) {
        return true;
        var isSupported = eventName in this.$element
        if (!isSupported) {
            this.$element.setAttribute(eventName, 'return;')
            isSupported = typeof this.$element[eventName] === 'function'
        }
        return isSupported
    },

    move: function (e) {
        if (!this.shown) return

        switch(e.keyCode) {
            case 9: // tab
            case 13: // enter
            case 27: // escape
                e.preventDefault()
                break

            case 38: // up arrow
                e.preventDefault()
                this.prev()
                break

            case 40: // down arrow
                e.preventDefault()
                this.next()
                break
        }

        e.stopPropagation()
    },

    keydown: function (e) {
        var keysCodes = new Array([40,38,9,13,27]);
        this.suppressKeyPressRepeat = ~keysCodes.indexOf(e.keyCode);
        this.move(e)
    },

    keypress: function (e) {
        if (this.suppressKeyPressRepeat > -1) return
        this.move(e)
    },

    keyup: function (e) {
        switch(e.keyCode) {
            case 40: // down arrow
            case 38: // up arrow
            case 16: // shift
            case 17: // ctrl
            case 18: // alt
                break

            case 9: // tab
            case 13: // enter
                if (!this.shown) return
                this.select()
                break

            case 27: // escape
                if (!this.shown) return
                this.hide()
                break

            default:
                this.lookup()
        }

        e.stop()
        e.preventDefault()
    },

    focus: function (e) {
        this.focused = true
    }

    , blur: function (e) {
        this.focused = false
        if (!this.mousedover && this.shown) this.hide()
    },

    click: function (e) {
        e.stop()
        e.preventDefault()
        this.select()
        this.$element.focus()
    },

    mouseenter: function (e) {
        this.mousedover = true
        this.$menu.select('.active').invoke('removeClassName', 'active');
        $(e.currentTarget).addClassName('active')
    },

    mouseleave: function (e) {
        this.mousedover = false
        if (!this.focused && this.shown) this.hide()
    }

};

Element.addMethods({
    typeahead: function(element, option) {
        if (!(element = $(element))) return;
        var data = element.data('typeahead');
        var options = typeof option == 'object' && option;

        if (!data) { element.data('typeahead', (data = new Typeahead(element, options))); };
        if (typeof option == 'string') { data[option](); };
        return element;
    }
});

Element.typeahead.defaults = {
    source: [],
    items: 8,
    menu: new Element('ul', {class:'typeahead dropdown-menu'}),
    item: new Element('li').insert(new Element('a', {href:'#'})),
    minLength: 1
};

document.observe("dom:loaded",function(){
    $$('[data-provide="typeahead"]').each(function (item) {
        if (item.data('typeahead')) return;
        item.typeahead(item.data());
    });
});