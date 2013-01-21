/**
 * point redered around element for resizing
 */
(function() {
    
    AppCreator.ResizePoint = function(config) {
        this._initResizePoint(config);
    };
    
    AppCreator.ResizePoint.Type = {
        NorthWest:  {id:1, value:"nw-resize"},
        West:       {id:2, value:'w-resize'},
        SouthWest:  {id:3, value:'sw-resize'},
        South:      {id:4, value:'s-resize'},
        SouthEast:  {id:5, value:'se-resize'},
        East:       {id:6, value:'e-resize'},
        NorthEast:  {id:7, value:'ne-resize'},
        North:      {id:8, value:'n-resize'}
    };
    
    AppCreator.ResizePoint.prototype = {
        _initResizePoint: function(config) {
            this._type = {};
            this._target = config.target;
            this.setDefaultAttrs({
                width: 5,
                height: 5,
                x: -5,
                y: -5,
                fill: 'black', 
                draggable: true
            });
            // call super constructor
            Kinetic.Rect.call(this, config);
            this.nodeType = 'ResizePoint';
            
            this.on('mouseout', function(){
                document.body.style.cursor = 'default';
            });
            
            this.on('dragmove', function(){
                
            });
        },
        /**
         * One from Enum ResizePoint.Type
         * @param {Type}
         */
        setType: function(type) {
            this.on('mouseover', function(){
                document.body.style.cursor = type.value;
            });
            
            this._type = type;
        }
    }
    
    Kinetic.Global.extend(AppCreator.ResizePoint, Kinetic.Rect);
})();