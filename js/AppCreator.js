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

    AppCreator.gridSize = 5;
    AppCreator.selectedTool = AppCreator.tools.AddElement;
    AppCreator.clickedElement = null;
    // class instance
    AppCreator.Root = function() {
        this._init();
    };
    AppCreator.Root.prototype = {
        _init: function() {
            var self = this;
            self._stage = new Kinetic.Stage({
                container: 'container',
                width: 878,
                height: 600
            });

            self._gridSize = 5;
            self._layer = new Kinetic.Layer();
            self._linesLayer = new Kinetic.Layer();

            self._stage.add(self._linesLayer);
            self._stage.add(self._layer);

            self._stage.content.onclick = function(e) {
                switch (AppCreator.selectedTool) {
                    case AppCreator.tools.Mouse:
                        {
                            var childs = self._layer.getChildren();
                            for (var i in childs) {
                                if (childs[i].ACType === 'Element') {
                                    childs[i].setSelected(false);
                                }
                            }
                            break;
                        }
                    case AppCreator.tools.AddElement:
                        {
                            e = e || window.event;

                            var x = e.pageX - this.offsetLeft,
                                    y = e.pageY - this.offsetTop,
                                    B = new AppCreator.Element({
                                'x': x,
                                'y': y,
                                width: 50,
                                height: 200,
                                draggable: true
                            });

                            self._layer.add(B);
                            self._layer.draw();
                            AppCreator.selectedTool = AppCreator.tools.Mouse;
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
        }
    };
})();