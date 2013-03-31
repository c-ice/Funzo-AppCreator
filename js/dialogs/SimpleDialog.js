/**
 * BaseDialog subclass provide dialog for adding or modifying attribute 
 */
(function() {
    AppCreator.Dialogs.SimpleDialog = function(config) {
        this.initSimpleDialog(config);
    };

    AppCreator.Dialogs.SimpleDialog.prototype = {
        initSimpleDialog: function(config) {
            var self = this;

            AppCreator.Dialogs.BaseDialog.call(this, config);

            self.setTemplateId('SimpleDialogTpl');

            self.render();
            self._draw();
        },
        validate: function(el) {
            var o = $(el).serializeObject();
            if (!o.name || !o.type || o.type.length === 0 || o.name.length === 0) {
                return false;
            }

            return true;
        }
    };

    Kinetic.Global.extend(AppCreator.Dialogs.SimpleDialog, AppCreator.Dialogs.BaseDialog);
})();