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

    AppCreator.clickedElement = null;
    AppCreator.instance = null;
    // class instance
    AppCreator.Root = function() {
        this._init();
    };
    AppCreator.Root.prototype = {
        _init: function() {
            var self = this;
            self._stage = new Kinetic.Stage({
                container: 'container',
                width: 1920,
                height: 1080
            });

            AppCreator.instance = self;

            self.currentAssoc = null;
            self._gridSize = 5;
            self._layer = new Kinetic.Layer();
            self._linesLayer = new Kinetic.Layer();

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
                                height: 30,
                                draggable: true
                            });

                            self._layer.add(B);
                            self._layer.draw();
                            AppCreator.selectedTool = AppCreator.tools.Mouse;
                            $('#toolbox button')[0].click();
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
                                        self.currentAssoc = new AppCreator.Association({
                                            'source': intersects[i].getParent()
                                        });

                                        self._linesLayer.add(self.currentAssoc);

                                        self.currentAssoc.addMovePoint(pos);
                                        this.addEventListener('mousemove', self._assocMouseMoveEventListener, false);
                                    } else {
                                        if (intersects[i] !== self.currentAssoc.getSource()) {
                                            this.removeEventListener('mousemove', self._assocMouseMoveEventListener, false);
                                            self.currentAssoc.getPoints().pop().destroy();
                                            self.currentAssoc.setTarget(intersects[i].getParent());
                                            intersects[i].getParent().fire('dragmove');
                                            self.currentAssoc = null;
                                        }
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
        setSelectedTool: function(tool) {
            if (tool === AppCreator.selectedTool) {
                return;
            }

            if (tool === AppCreator.tools.Association ||
                    AppCreator.selectedTool === AppCreator.tools.Association)
            {
                var register = tool === AppCreator.tools.Association;

                var childs = this._layer.getChildren();
                for (var i in childs) {
                    if (childs[i].ACType === 'Element') {
                        childs[i].setSelected(false);
                        childs[i].setDraggable(!register);
                    }
                }
            }

            AppCreator.selectedTool = tool;
        },
        _assocMouseMoveEventListener: function(e) {
            var points = AppCreator.instance.currentAssoc.getPoints();

            points[points.length - 1].setX(e.layerX);
            points[points.length - 1].setY(e.layerY);
            AppCreator.instance.currentAssoc.getParent().draw();
        },
        _mouseToolClickEventListener: function(evt) {
            if (AppCreator.selectedTool === AppCreator.tools.Mouse &&
                !evt.targetNode) {
                console.log("clicked "+evt.targetNode);
//                var pos = {x: y:},
//                        childs = AppCreator.instance._layer.getChildren();
//                if (!AppCreator.instance._stage.getIntersection(pos)) {
//                    for (var i in childs) {
//                        if (childs[i].ACType === 'Element') {
//                            //childs[i].setSelected(false);
//                        }
//                    }
//                }
            }
        }
    };
})();