/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var AppCreator = {};
(function() {
    // static Global
    AppCreator.tools = {
        Mouse: 1,
        Association: 2,
        AddElement: 3
    };

    AppCreator.setCursorTo = function(cursorType) {
        document.body.style.cursor = cursorType;
//        document.onselectstart = function() {
//            return false;
//        };
    };
    AppCreator.defaultCursor = function() {
        document.body.style.cursor = 'default';
    };

    AppCreator.gridSize = 1;
    AppCreator.selectedTool = AppCreator.tools.Mouse;

    AppCreator.setSelectedTool = function(tool) {
        for (var i in AppCreator.otherInstances) {
            if (AppCreator.otherInstances[i] !== null) {
                AppCreator.otherInstances[i].setSelectedTool(tool);
            }
        }

        AppCreator.selectedTool = tool;
    };

    AppCreator.models = [];

    AppCreator.clickedElement = null;
    /**
     * Current selected instance
     */
    AppCreator.instance = null;

    AppCreator.switchInstance = function(instance) {
        var ins = AppCreator.otherInstances[instance];
        //if not exists yet then create one 
        // lazy load
        if (!ins) {
            ins = new AppCreator.Root({
                container: instance + "Container",
                type: instance
            });
        }

        AppCreator.instance = ins;
    };

    AppCreator.otherInstances = {
        model: null,
        view: null,
        router: null
    };

    // class instance
    AppCreator.Root = function(config) {
        this._init(config);
    };
    AppCreator.Root.prototype = {
        /**
         * 
         * @param {Object} config 
         * {
         *  container:ID of DIV element, 
         *  type:(model|view|router)
         * }
         * @returns {undefined}
         */
        _init: function(config) {
            var self = this;

            self._stage = new Kinetic.Stage({
                container: config.container || 'container',
                width: 1920,
                height: 1080
            });

            AppCreator.otherInstances[config.type] = self;
            AppCreator.instance = self;

            self.currentAssoc = null;
            self._gridSize = 5;
            self._layer = new Kinetic.Layer();
            self._linesLayer = new Kinetic.Layer();
            self._selectedTool = AppCreator.tools.Mouse;

            self._stage.add(self._linesLayer);
            self._stage.add(self._layer);

            // prevent cursor changing on move
            self._stage.content.addEventListener("mousedown", function(e) {
                e.preventDefault();
            }, false);

            self._stage.content.addEventListener("click", self._mouseToolClickEventListener, false);

            $(self._stage.content).ready(function() {
                self._offset = $(self._stage.content).offset();
            });

            self._stage.content.addEventListener("contextmenu", function(e) {
                e.preventDefault();
                var pos = {x: e.layerX, y: e.layerY}, element, assoc,
                        intersection = self._stage.getIntersection(pos);
                if (!intersection) {
                    intersection = {'shape': self._stage.getIntersections(pos)[0]};
                }

                element = AppCreator.GO.findAppCreatorParent(intersection.shape, 'Element');
                assoc = (intersection.shape && intersection.shape.getOwner ? intersection.shape.getOwner() : null);
                AppCreator.clickedElement = null;
                AppCreator.GO.resetSelection(element);
                AppCreator.ContextMenu.instance.show(e, assoc || element);
            }, false);

            self._stage.content.onmousedown = function(e) {
                switch (AppCreator.selectedTool) {
                    case AppCreator.tools.AddElement:
                        {
                            e = e || window.event;

                            var x = e.pageX - this.offsetLeft,
                                    y = e.pageY - this.offsetTop,
                                    B = new AppCreator.Element({
                                'x': x - 50,
                                'y': y - 5,
                                width: 100,
                                height: 50,
                                draggable: true
                            });

                            self._layer.add(B);
                            B.afterInit();
                            self._layer.draw();
                            AppCreator.setSelectedTool(AppCreator.tools.Mouse);
                            $('ul.nav a.toolButton')[0].click();
                            B.fire('mousedown');
                            break;
                        }
                    case AppCreator.tools.Association:
                        {
                            e = e || window.event;

                            var i = 0, pos = {x: e.layerX, y: e.layerY},
                            intersects = self._layer.getIntersections(pos);

                            for (i in intersects) {
                                if (intersects[i].getParent().ACType === 'Element') {
                                    if (!self.currentAssoc) {
                                        self.currentAssoc = new AppCreator.Association();
                                        self.currentAssoc.setSource(intersects[i].getParent());

                                        self._linesLayer.add(self.currentAssoc);

                                        self.currentAssoc.addMovePoint(pos);
                                        this.addEventListener('mousemove', self._assocMouseMoveEventListener, false);
                                    } else {
                                        //TODO: when only 2 points are setted asscoation is un reachable
                                        //if (intersects[i].getParent() !== self.currentAssoc.getSource()) {
                                        this.removeEventListener('mousemove', self._assocMouseMoveEventListener, false);
                                        self.currentAssoc.getPoints().pop().destroy();
                                        self.currentAssoc.setTarget(intersects[i].getParent());
                                        intersects[i].getParent().fire('dragmove');
                                        self.currentAssoc = null;
                                        AppCreator.setSelectedTool(AppCreator.tools.Mouse);
                                        $('ul.nav a.toolButton')[0].click();
                                        //}
                                    }

                                    break;
                                }
                            }

                            // ak nic netrafil a zaroven existuje tahana ciara
                            if (intersects.length === 0 &&
                                    self.currentAssoc) {
                                self.currentAssoc.addMovePoint(pos);
                            }

                            break;
                        }
                }
            };
        },
        getStage: function() {
            return this._stage;
        },
        getLayer: function() {
            return this._layer;
        },
        getLinesLayer: function() {
            return this._linesLayer;
        },
        add2LinesLayer: function(obj) {
            this._linesLayer.add(obj);
        },
        getDOMOffset: function() {
            return this._offset;
        },
        fire: function(evt) {
            $(this).trigger(evt);
        },
        setSelectedTool: function(tool) {
            if (tool === this._selectedTool) {
                return;
            }

            if (tool === AppCreator.tools.Association ||
                    this._selectedTool === AppCreator.tools.Association)
            {
                var register = (tool === AppCreator.tools.Association);

                var childs = this._layer.getChildren();
                for (var i in childs) {
                    if (childs[i].ACType === 'Element') {
                        childs[i].setSelected(false);
                        childs[i].setDraggable(!register);
                    }
                }
            }

            this._selectedTool = tool;
            $(this).trigger("selectedToolChanged");
        },
        _assocMouseMoveEventListener: function(e) {
            var points = AppCreator.instance.currentAssoc.getPoints();

            points[points.length - 1].setX(e.layerX);
            points[points.length - 1].setY(e.layerY);
            AppCreator.instance.currentAssoc.getParent().draw();
        },
        _mouseToolClickEventListener: function(evt) {
            //console.log("clicked " + evt);
            if (Kinetic.DD.isDragging) {
                Kinetic.DD.isDragging = false;
                return;
            }

            if (AppCreator.selectedTool === AppCreator.tools.Mouse && !evt.ctrlKey) {
                AppCreator.GO.resetSelection(AppCreator.clickedElement);

                AppCreator.clickedElement = null;
            }
        }
    };
})();