(function() {
    Kinetic.DD = {
        anim: new Kinetic.Animation(),
        moving: false,
        offset: {
            x: 0,
            y: 0
        }
    };

    Kinetic.DD._startDrag = function(evt) {
        var dd = Kinetic.DD;
        var node = dd.node;

        if(node) {
            var pos = node.getStage().getUserPosition();
            var dbf = node.attrs.dragBoundFunc;

            var newNodePos = {
                x: pos.x - dd.offset.x,
                y: pos.y - dd.offset.y
            };

            if(dbf !== undefined) {
                newNodePos = dbf.call(node, newNodePos, evt);
            }

            node.setAbsolutePosition(newNodePos);

            if(!dd.moving) {
                dd.moving = true;
                node.setListening(false);

                // execute dragstart events if defined
                node._handleEvent('dragstart', evt);
            }

            // execute user defined ondragmove if defined
            node._handleEvent('dragmove', evt);
        }
    };
    Kinetic.DD._endDrag = function(evt) {
        var dd = Kinetic.DD;
        var node = dd.node;
        if(node) {
            node.setListening(true);
            if(node.nodeType === 'Stage') {
                node.draw();
            }
            else {
                node.getLayer().draw();
            }

            // handle dragend
            if(dd.moving) {
                dd.moving = false;
                node._handleEvent('dragend', evt);
            }
        }
        dd.node = null;
        dd.anim.stop();
    };
    /**
     * set draggable
     * @name setDraggable
     * @methodOf Kinetic.Node.prototype
     * @param {String} draggable
     */
    Kinetic.Node.prototype.setDraggable = function(draggable) {
        this.setAttr('draggable', draggable);
        this._dragChange();
    };
    /**
     * get draggable
     * @name getDraggable
     * @methodOf Kinetic.Node.prototype
     */
    Kinetic.Node.prototype.getDraggable = function() {
        return this.attrs.draggable;
    };
    /**
     * determine if node is currently in drag and drop mode
     * @name isDragging
     * @methodOf Kinetic.Node.prototype
     */
    Kinetic.Node.prototype.isDragging = function() {
        var dd = Kinetic.DD;
        return dd.node && dd.node._id === this._id && dd.moving;
    };

    Kinetic.Node.prototype._listenDrag = function() {
        this._dragCleanup();
        var that = this;
        this.on('mousedown.kinetic touchstart.kinetic', function(evt) {
            that._initDrag();
        });
    };
    Kinetic.Node.prototype._initDrag = function() {
        var dd = Kinetic.DD;
        var stage = this.getStage();
        var pos = stage.getUserPosition();

        if(pos) {
            var m = this.getTransform().getTranslation();
            var am = this.getAbsoluteTransform().getTranslation();
            var ap = this.getAbsolutePosition();
            dd.node = this;
            dd.offset.x = pos.x - ap.x;
            dd.offset.y = pos.y - ap.y;

            /*
             * if dragging and dropping the stage,
             * draw all of the layers
             */
            if(this.nodeType === 'Stage') {
                dd.anim.node = this;
            }
            else {
                dd.anim.node = this.getLayer();
            }
            dd.anim.start();
        }
    };
    Kinetic.Node.prototype._dragChange = function() {
        if(this.attrs.draggable) {
            this._listenDrag();
        }
        else {
            // remove event listeners
            this._dragCleanup();

            /*
             * force drag and drop to end
             * if this node is currently in
             * drag and drop mode
             */
            var stage = this.getStage();
            var dd = Kinetic.DD;
            if(stage && dd.node && dd.node._id === this._id) {
                dd._endDrag();
            }
        }
    };
    Kinetic.Node.prototype._dragCleanup = function() {
        this.off('mousedown.kinetic');
        this.off('touchstart.kinetic');
    };

    /**
     * get draggable.  Alias of getDraggable()
     * @name isDraggable
     * @methodOf Kinetic.Node.prototype
     */
    Kinetic.Node.prototype.isDraggable = Kinetic.Node.prototype.getDraggable;

    Kinetic.Node.addGettersSetters(Kinetic.Node, ['dragBoundFunc']);

    /**
     * set drag bound function.  This is used to override the default
     *  drag and drop position
     * @name setDragBoundFunc
     * @methodOf Kinetic.Node.prototype
     * @param {Function} dragBoundFunc
     */

    /**
     * get dragBoundFunc
     * @name getDragBoundFunc
     * @methodOf Kinetic.Node.prototype
     */
})();
