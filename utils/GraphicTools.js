/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


(function(){
    //static tools
    AppCreator.GraphicTools = {};
    AppCreator.GraphicTools.xCor = function(len, dir) {
        return Math.floor(len * Math.cos(dir));
    };
    
    AppCreator.GraphicTools.yCor = function(len, dir) {
        return Math.floor(len * Math.sin(dir));
    };
    
})();