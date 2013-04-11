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
            $(document).ready(function() {
                AppCreator.CFG.drawPresettedAttributes();
            });
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

    AppCreator.CFG.drawPresettedAttributes = function() {
        var htmlStr = "", i = 0;

        for (i in AppCreator.CFG.presettedAttributes) {
            htmlStr += "<tr><td>" + i + "</td><td>"
                    + AppCreator.CFG.presettedAttributes[i].name + "</td><td>"
                    + AppCreator.CFG.presettedAttributes[i].type + "</td><td></td></tr>";
        }

        $("#predefinedAttrs tbody").html(htmlStr);
    };

    //---------------------------------------------------------

    AppCreator.CFG.typeahead = function(query) {
        $(query).typeahead({
            items: 4,
            source: AppCreator.CFG.primitiveDataTypes,
            matcher: function(item) {
                if (this.query === '?') {
                    return -1;
                }

                return ~item.toLowerCase().indexOf(this.query.toLowerCase());
            }
        });
    };

    $(document).ready(function() {
        AppCreator.CFG.typeahead("input[name='type']");

        $('#predefinedAttrs form').on('submit', function(e) {
            e.preventDefault();

            var attr = $(this).serializeObject(), that = this;

            AppCreator.CFG.addPresettedAttribute(attr, function() {
                console.log('success');
            });

            return false;
        });
    });

})();

