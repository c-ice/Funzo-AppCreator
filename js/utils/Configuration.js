(function() {
    AppCreator.CFG = {};

    AppCreator.CFG.primitiveDataTypes = ['String', 'Number', 'Bool', 'Reference'];

    AppCreator.CFG.ModelView = {};

    AppCreator.CFG.presettedAttributes = [];//{"name": "ID", "type": "Number"}

    /**
     * {
     *  id?:
     *  name:string
     *  type:string
     * }
     * @param {Object} attr
     * @param {Function} success
     * @returns {undefined}
     */
    AppCreator.CFG.addPresettedAttribute = function(attr, success) {
        AppCreator.CFG.presettedAttributesStore.put(attr, success);
        AppCreator.CFG.presettedAttributes.push(attr);
    };
    
    AppCreator.CFG.loadCFGs = function() {
        console.log("ready...");
        AppCreator.CFG.presettedAttributesStore.getAll(function(data) {
            console.log(data);
            AppCreator.CFG.presettedAttributes = data;
        });
        
    };
    
    AppCreator.CFG.presettedAttributesStore = new IDBStore({
        storeName: 'presettedAttributes',
        storePrefix: 'CFG-',
        dbVersion: 1,
        keyPath: 'id',
        autoIncrement: true,
        indexes: [
            {name: 'nameIDX', keyPath: 'name', unique: true, multiEntry: false}
        ],
        onError: function(error) {
            throw error;
        },
        onStoreReady: AppCreator.CFG.loadCFGs
    });


})();

