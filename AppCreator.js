/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

(function(){
    AppCreator = function(){
        this._init();
    };
    
    AppCreator.Tools = {
        Mouse: 1,
        Association: 2
    };
    
    AppCreator.gridSize = 5;
    AppCreator.selectedTool = AppCreator.Tools.Mouse;
    
    AppCreator.prototype = {
        _init: function () {
            var self = this;
            self._stage =  new Kinetic.Stage({
                container: 'container',
                width: 878,
                height: 600
            });
            
            self._gridSize = 5;
            self._layer = new Kinetic.Layer();
            self._linesLayer = new Kinetic.Layer();

            self._stage.add(self._linesLayer);
            self._stage.add(self._layer);     
                
            self._stage.content.onclick = function(){
                var childs = self._layer.getChildren();
                for(var i in childs) {
                    if (childs[i].ACType == 'Element') {
                        childs[i].setSelected(false);
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