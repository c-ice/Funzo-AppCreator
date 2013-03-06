(function() {
    AppCreator.Dialogs = {};

    AppCreator.Dialogs._count = 0;

    AppCreator.Dialogs.SimpleDialog = function(config) {
        this.initDialog(config);
    };

    AppCreator.Dialogs.SimpleDialog.prototype = {
        initDialog: function(config) {
            if (config === 'undefined')
                config = {};
            this._position = {
                x: (config.x ? config.x : 0),
                y: (config.y ? config.y : 0)
            };
            this._id = "simpleDialog_" + AppCreator.Dialogs._count++;
            this._DOM = new Div();// ha ha
        },
        setPosition: function(pos) {
            this._position = pos;
        },
        getPosition: function() {
            return this._position;
        },
        getX: function() {
            return this._position.x;
        },
        setX: function(x) {
            this._position.x = x;
        },
        getY: function() {
            return this._position.y;
        },
        setY: function(y) {
            this._position.y = y;
        },
        show: function() {
            $(this._DOM).show();
        },
        hide: function() {
            $(this._DOM).hide();
        },
        submit: function() {
            console.log(this._id + " Submited");
        },
        cancel: function() {
            console.log(this._id + " Canceled");
        },
        validate: function() {

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

