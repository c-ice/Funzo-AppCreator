(function() {
    AppCreator.Dialogs.CountingTextDialog = function(config) {
        this.initCountingTextDialog(config);
    };

    AppCreator.Dialogs.CountingTextDialog.prototype = {
        initCountingTextDialog: function(config) {
            var self = this;

            AppCreator.Dialogs.BaseDialog.call(this, config);

            self.setTemplateId('CountingTextDialogTpl');
            //self.attrs.templateParams['1'] = config.title || "";
            self.render();
            self._draw();
        },
        validate: function(el) {
//            var o = $(el).serializeObject();
//            if (!o.name || o.name.length === 0) {
//                return false;
//            }

            return true;
        },
        setTitle: function(title) {
            $("#" + this.getId() + " input")[0].val(title);
        },
        focus: function() {
            $('#' + this.getId() + " select")[0].focus();
        }
    };

    Kinetic.Global.extend(AppCreator.Dialogs.CountingTextDialog, AppCreator.Dialogs.BaseDialog);
})();