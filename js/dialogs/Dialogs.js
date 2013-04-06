(function() {
    AppCreator.Dialogs = {};

    AppCreator.Dialogs._count = 0;

    AppCreator.Dialogs.BaseDialog = function(config) {
        this.initDialog(config);
    };

    /**
     * attrs: x,y,width
     */
    AppCreator.Dialogs.BaseDialog.prototype = {
        initDialog: function(config) {
            var self = this;
            config = config || {};
            self.attrs = {
                x: (config.x ? config.x : 0),
                y: (config.y ? config.y : 0),
                id: "dialog_" + AppCreator.Dialogs._count++,
                DOM: '',
                width: config.width ? config.width : 100,
                height: 22,
                rendered: false,
                templateId: '',
                templateParams:  {}
            };

            self.attrs.templateParams["0"] = self.getId();
            //self.render();
            //self._draw();
        },
        /**
         * set XY with array = [x, y] or with object {x:y:}
         * @param {Array|Object} pos
         */
        setPosition: function(pos) {
            if (Kinetic.Type._isArray(pos)) {
                this.setX(pos[0]);
                this.setY(pos[1]);
            } else {
                this.setX(pos.x);
                this.setY(pos.y);

            }
        },
        getPosition: function() {
            return {x: this.getX(), y: this.getY()};
        },
        show: function() {
            $('#' + this.getId()).show();
        },
        hide: function() {
            $('#' + this.getId()).hide();
        },
        remove: function() {
            $('#' + this.getId()).remove().popover('destroy');
            this.setRendered(false);
        },
        submit: function(el) {

            console.log($(el).serializeObject());
        },
        cancel: function() {
            this.remove();
            console.log(this.getId() + " Canceled");
        },
        focus: function() {
            $('#' + this.getId() + " input")[0].focus();
        },
        validate: function(el) {
            return true;
        },
        /**
         * Render DOM
         */
        render: function() {
            if (!this.getRendered()) {
                var self = this;

                self.setRendered(true);
                self.setDOM($.nano($('#' + this.getTemplateId()).html(), self.getTemplateParams()));

                $('body').append(self.getDOM());

                $("#" + self.getId()).bind('submit', function(e) {
                    e.preventDefault();
                    if (self.validate(this)) {
                        self.submit(this);
                    }
                }).bind('reset', function(e) {
                    e.preventDefault();
                    self.cancel();
                });

                this.focus();
            }
        },
        _draw: function() {
            $('#' + this.getId()).css({
                'top': AppCreator.instance.getDOMOffset().top + this.getY(),
                'left': AppCreator.instance.getDOMOffset().left + this.getX() - 1,
                'width': this.getWidth()
            });

        }
    };

    /** 
     * add methods
     */
    AppCreator.GO.addGettersSetters(AppCreator.Dialogs.BaseDialog, ['x', 'y',
        'id', 'DOM', 'width', 'rendered', 'templateId', 'templateParams']);
    AppCreator.GO.addGetters(AppCreator.Dialogs.BaseDialog, ['height']);
    /**
     * Create Add attribute dialog to set
     * @param {Callback} succes
     * @param {Callback} cancel
     * @returns {undefined}
     */
    AppCreator.Dialogs.addAttributeDialog = function(succes, cancel) {
        var dlg = new AppCreator.Dialogs.BaseDialog();
        dlg.submit = succes;
        dlg.cancel = cancel;

        return dlg;
    };


})();

