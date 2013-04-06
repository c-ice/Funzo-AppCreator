/**
 * Base ContextMenu
 * <ul id="context1" class="dropdown-menu">
 * TODO: nastylovat contextMenu title
 */
(function() {

    AppCreator.ContextMenu = {};

    AppCreator.ContextMenu.Basic = function(config) {
        this._initContextMenuBasic(config);
    };
    /**
     * config = {
     *   title,
     *   id,
     *   selector,
     *   items [{title:action:}, "divider"],
     * };
     */
    AppCreator.ContextMenu.Basic.prototype = {
        _initContextMenuBasic: function(config) {
            var self = this;
            config = config || {};
            this.attrs = {};

            this.setTitle(config.title || "");
            this.setId(config.id || "contextMenu1");
            this.setSelector(config.selector || 'body');

            this.setDOM($("<ul/>", {
                id: self.getId(),
                class: "dropdown-menu"
            }));

            this.getDOM().append('<li class="popover-title">' + this.getTitle() + '</li>');

            if (config.items) {
                for (var i in config.items) {
                    if (config.items[i].action)
                        this.addItem(config.items[i].title, config.items[i].action);
                    else
                        this.addDivider();
                }
            }

            $(this.getSelector()).append(this.getDOM());

            $(document).click(function(event) {
                var target = $(event.target);
                if (!target.is(".popover") && !target.parents().is(".popover")) {
                    if (self.getLast() === event.timeStamp)
                        return;
                    self.getDOM().css({
                        'display': 'none'
                    });
                }
            });
        },
        addDivider: function() {
            this.getDOM().append('<li class="divider"></li>');

            return this;
        },
        addItem: function(title, action) {
            this.getDOM().append($('<li>/').append($('<a/>', {
                text: title,
                click: action
            })));

            return this;
        },
        show: function(event) {
            this.getDOM().css({
                //position: "fixed",
                display: "block",
                left: event.clientX + 'px',
                top: event.clientY + 'px'
            });

            this.setLast(event.timeStamp);
        }
    };

    AppCreator.GO.addGettersSetters(AppCreator.ContextMenu.Basic, ['DOM', 'id', 'title', 'selector', 'last']);

    AppCreator.ContextMenu.instance = new AppCreator.ContextMenu.Basic({
        title: "ContextMenu",
        items: [
            {
                title: 'Remove',
                action: function(e) {
                    console.log("removed...");
                }
            }, {
                title: 'Add',
                action: function(e) {
                    console.log("Added... ");
                }
            }
        ]
    });

})();