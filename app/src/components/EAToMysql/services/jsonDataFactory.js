
let  jsonDataFactory = function () {
    "use strict";
    var JSONSchema = null;
    return {
        getData: function() {
            return JSONSchema;
        },
        setData: function(data) {
            JSONSchema = data;

        },
        isEmpty: function() {
            for(var prop in JSONSchema) {
                if(JSONSchema.hasOwnProperty(prop))
                    return false;
            }
            return true;
        },
        clear: function() {
            JSONSchema = null;
        }
    };

};

export default jsonDataFactory;
