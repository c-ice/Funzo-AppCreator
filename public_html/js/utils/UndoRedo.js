(function() {
    AppCreator.UndoRedo = function() {
        this._initUndoRedo();
    };

    AppCreator.UndoRedo.prototype = {
        _initUndoRedo: function() {
            this._actions = [];
            this._currentAction = 0;
        },
        addAction: function(action) {
            if (this._actions.length > this._currentAction + 1) {
                this._actions = this._actions.slice(0, this._currentAction);
            }
            
            this.actions.push(action);
            this._currentAction++;
        },
        undoAction: function() {
            // execute previous current to make undo
            if (this._currentAction - 1 >= 0) {
                this._currentAction--;
                this._actions[this._currentAction]();
            }
        },
        redoAction: function() {
            // execute next Action to make redo
            if (this._currentAction + 1 < this._actions.lendth) {
                this._currentAction++;
                this._actions[this._currentAction]();
            }
        }

    };



})();

