(function() {
    AppCreator.CFG = {};

    AppCreator.CFG.primitiveDataTypes = ['String', 'Number', 'Bool', 'Reference'];

    AppCreator.CFG.ModelView = {};

    AppCreator.CFG.presettedAttributes = [{"name": "ID", "type": "Number"}];

    AppCreator.CFG.store = new IDBStore({
        storeName: 'Configuration',
        storePrefix: 'AC',
        dbVersion: 2,
        keyPath: 'id',
        autoIncrement: true,
        indexes: [
            {name: 'nameIDX', keyPath: 'name', unique: true, multiEntry: false}
        ],
        onError: function(error) {
            throw error;
        }
    });
})();

