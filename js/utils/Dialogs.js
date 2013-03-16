(function() {
    AppCreator.Dialogs = {};

    AppCreator.Dialogs._count = 0;

    AppCreator.Dialogs.SimpleDialog = function(config) {
        this.initDialog(config);
    };

    /**
     * attrs: x,y,width
     */
    AppCreator.Dialogs.SimpleDialog.prototype = {
        initDialog: function(config) {
            var self = this;
            config = config || {};
            self.attrs = {
                x: (config.x ? config.x : 0),
                y: (config.y ? config.y : 0),
                id: "simpleDialog_" + AppCreator.Dialogs._count++,
                DOM: '',
                width: config.width ? config.width : 100
            };

            self.setDOM($.nano($('#SimpleDialogTpl').html(), {'0': this.getId()}));

            $('body').append(self.getDOM());
            $("#" + self.getId()).bind('submit', function(e) {
                e.preventDefault();
                if (self.validate(this)) {
                    self.submit(this);
                }
            });
            self._draw();
        },
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
            $('#' + this.getId()).remove();
        },
        submit: function(el) {

            console.log($(el).serializeObject());
        },
        cancel: function() {
            console.log(this.getId() + " Canceled");
        },
        validate: function(el) {
            // todo: validate Form
            return true;
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
    AppCreator.Globals.addGettersSetters(AppCreator.Dialogs.SimpleDialog, ['x', 'y', 'id', 'DOM', 'width']);

    /**
     * Create Add attribute dialog to set
     * @param {Callback} succes
     * @param {Callback} cancel
     * @returns {undefined}
     */
    AppCreator.Dialogs.addAttributeDialog = function(succes, cancel) {
        var dlg = new AppCreator.Dialogs.SimpleDialog();
        dlg.submit = succes;
        dlg.cancel = cancel;

        return dlg;
    };


})();

