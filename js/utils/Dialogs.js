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
            config = config || {};
            this._position = {
                x: (config.x ? config.x : 0),
                y: (config.y ? config.y : 0)
            };
            this._id = "simpleDialog_" + AppCreator.Dialogs._count++;
            this._DOM = $.nano($('#SimpleDialogTpl').html(), {'0': this._id});
            
            $('body').append(this._DOM);
            
        },
        setPosition: function(pos) {
            this._position = pos;
            this._draw();
        },
        getPosition: function() {
            return this._position;
        },
        getX: function() {
            return this._position.x;
        },
        setX: function(x) {
            this._position.x = x;
            this._draw();
        },
        getY: function() {
            return this._position.y;
        },
        setY: function(y) {
            this._position.y = y;
            this._draw();
        },
        show: function() {
            $('#' + this._id).show();
        },
        hide: function() {
            $('#' + this._id).hide();
        },
        submit: function() {
            console.log(this._id + " Submited");
        },
        cancel: function() {
            console.log(this._id + " Canceled");
        },
        validate: function() {

        },
        _draw: function() {
            $('#' + this._id).css('top', this._position.y);
            $('#' + this._id).css('left', this._position.x);
        }
    };

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

