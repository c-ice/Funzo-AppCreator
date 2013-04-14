/**
 * BaseDialog subclass provide dialog for adding or modifying attribute 
 */
(function() {
    AppCreator.Dialogs.TitleDialog = function(config) {
        this.initTitleDialog(config);
    };

    AppCreator.Dialogs.TitleDialog.prototype = {
        initTitleDialog: function(config) {
            var self = this;

            AppCreator.Dialogs.BaseDialog.call(this, config);

            self.setTemplateId('TitleDialogTpl');
            self.attrs.templateParams['1'] = config.title || "";
            self.attrs.templateParams['2'] = config.placeholder || "Title";
            self.render();
            self._draw();
        },
        validate: function(el) {
            var o = $(el).serializeObject();
            if (!o.name || o.name.length === 0) {
                return false;
            }

            return true;
        },
        setTitle: function(title) {
            $("#" + this.getId() + " input")[0].val(title);
        }
    };

    Kinetic.Global.extend(AppCreator.Dialogs.TitleDialog, AppCreator.Dialogs.BaseDialog);
})();