(function() {
    AppCreator.Images = {};
    
    AppCreator.Images.getImage = function(key) {
        // image lazy load ?
        var image = AppCreator.Images.all[key];
        if (!image.obj) {
            image.obj = new Image();
            image.obj.src = image.src;
            
            AppCreator.Images.all[key] = image;
        }

        return image.obj;
    };
    
    AppCreator.Images.all = {
        "plusButton": {"obj": null, "src": "img/glyphicons_190_circle_plus.png"}
    };
})();
