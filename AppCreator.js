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
            this._stage =  new Kinetic.Stage({
                container: 'container',
                width: 878,
                height: 600
            });
            
            this._gridSize = 5;
            this._layer = new Kinetic.Layer();
            this._linesLayer = new Kinetic.Layer();

            this._stage.add(this._linesLayer);
            this._stage.add(this._layer);     
    
            this._layer.on('click', function(){
                console.log("_layer clicked");}
            );
    
            this._stage.on('click', function(){
                console.log("_stage clicked");}
            );
                
            this._stage.content.onclick = function(){
                var childs = this._layer.getChildren();
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