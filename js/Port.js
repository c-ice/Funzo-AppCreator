/**
 * Port is for connecting from one port to another port
 * Element Can own more ports
 * Ports provide some Interface that can use connected Element
 */
(function() {
    AppCreator.Port = function(config) {
        this._initPort(config);
    };

    AppCreator.Port.prototype = {
        _initPort: function(config) {
            
            Kinetic.Rect.call(self, config);
            
        }
    };
    
     Kinetic.Global.extend(AppCreator.Port, Kinetic.Rect);
})();


