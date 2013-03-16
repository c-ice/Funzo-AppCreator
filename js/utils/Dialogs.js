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
            this.attrs = {
                x: (config.x ? config.x : 0),
                y: (config.y ? config.y : 0),   
                id: "simpleDialog_" + AppCreator.Dialogs._count++,
                DOM: ''
            };
            
            this.setDOM($.nano($('#SimpleDialogTpl').html(), {'0': this.getId()}));
            
            $('body').append(this.getDOM());
            
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
            return {x: this.getX(), y:this.getY()};
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
            $('#' + this.getId()).css({
                'top': this.getY(), 
                'left': this.getX(),
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

