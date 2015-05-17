var JSON_PROPERTY_KEY = '__json';
var LINKS_PROPERTY_KEY = '__links';
var EMBEDDED_DATA_PROPERTY_KEY = '__embedded';

var Rev1Serializer = Ember.Object.extend({
    //  properties which are not echoed back to the server
    privateProperties: ['id', 'uri', 'validationErrors', JSON_PROPERTY_KEY, LINKS_PROPERTY_KEY, EMBEDDED_DATA_PROPERTY_KEY, '_type', 'links'],

    serialize: function(record) {
        Ember.Logger.debug('Rev1Serializer.serialize:', record);
        var attributes = this._propertiesMap(record);
        var json = {};
        json[record.get('type_plural')] = attributes;
        return json;
    },

    extractSingle: function(rootJson, href) {
        var modelObj, modelObjNew;
        var objType;

        Ember.Logger.debug('extractSingle: rootJson=', rootJson);

        var objTypes = _.keys(_.omit(rootJson, "included", "links", "meta", "errors"));
        if (objTypes.length === 0) {
            return null;
        }

        if (objTypes.length > 1) {
            Ember.Logger.debug('extractSingle: objTypes=', objTypes);
            Ember.warn("Got more than we bargained for in extractSingle");
        }

        objType = objTypes[0];

        modelObj = rootJson[objType] && rootJson[objType][0];

        // Hack to make it serialize as rev0 just in case.
        if (!modelObj) {
            modelObj = rootJson[objType];
            //modelObj = rootJson;
        }

        modelObjNew = {};
        for (var k in modelObj) {
            modelObjNew[k] = modelObj[k];
        }


        this._populateObject(modelObjNew, objType, rootJson);
        Ember.Logger.debug('modelObjNew:', modelObjNew);

        return modelObjNew;
    },

    extractCollection: function(rootJson) {
        var collection = [];
        var self = this;

        /*var populateFunc = function(val) {
            collection.push(self._populateObject(val, typeName, rootJson));
        };
        for (var typeName in rootJson) {
            var vals = rootJson[typeName];
            if ($.isArray(vals)) {
                _.each(vals, populateFunc);
            }
        }*/
        rootJson['data'].forEach(function(rec, index){
            collection.push(self._populateObject(rec, rec['type'], rootJson));
        });

        var linked = rootJson.linked ? rootJson.linked : null;
        //var nextUri = rootJson.meta ? rootJson.meta.next : null;
        var nextUri = rootJson.links ? rootJson.links.next : null;
        var counts = rootJson.meta ? rootJson.meta.counts : null;
        var total = rootJson.meta ? rootJson.meta.total : null;

        return {
            items: collection,
            linked: linked,
            next_uri: nextUri,
            counts: counts,
            total: total
        };
    },

    _populateObject: function(modelObj, objType, rootJson) {
        var linksValues = {};
        linksValues[objType + '.id'] = modelObj.id;
        linksValues[objType + '.self'] = modelObj.id;

        if (modelObj.links) {
            for (var key in modelObj.links) {
                linksValues[objType + '.' + key] = modelObj.links[key];

                //dirty hack
                if (rootJson['included']) {
                    var embedded_value = null;
                    for (var i=0, l=rootJson['included'].length; i<l; i++) {
                        var val = rootJson['included'][i];
                        var included_key = null;
                        for (var link in rootJson['links']) {
                            var link_type = link.split('.');
                            if (link_type[link_type.length-1] == key) {
                                included_key = rootJson['links'][link]['type'];
                            }
                        }
                        //var link = rootJson['links'][objType+'.'+key];
                        //var included_key = link && link['type'];
                        if (included_key === val['type'] && modelObj.links[key] == val['id']) {
                            embedded_value = val;
                            break;
                        }
                    }
                    modelObj[key] = embedded_value;
                }
            }
        }

        var replaceHrefFunc = function(match, linkParam) {
            var replacement = linksValues[linkParam];

            if (replacement === undefined) {
                Ember.Logger.warn("Couldn't find replacement for param %@".fmt(linkParam));
                throw new Error("Undefined value for URL macro");
            }

            if (replacement === null) {
                throw new Error("Null value for URL macro");
            }

            return replacement;
        };

        var templatedLinks = {};
        var objPropertyName = objType;
        for (var link in rootJson.links) {
            if (link.indexOf(objPropertyName + ".") === 0) {
                var linkName = link.substring(objPropertyName.length + 1);

                if (linkName.indexOf('.') !== -1) {
                    continue;
                }

                // Template all the links
                var href = rootJson.links[link];

                try {
                    var replacedHref = href.replace(/\{([\.\w]+)\}/g, replaceHrefFunc);
                    templatedLinks[linkName] = replacedHref;
                } catch (e) {
                    templatedLinks[linkName] = null;
                }
            }
        }

        for (link in templatedLinks) {
            modelObj[link + "_uri"] = templatedLinks[link];
        }

        modelObj.uri = modelObj.href;
        modelObj._type = objType;//.replace(/s$/, '');
        return modelObj;
    },

    // Taken from http://stackoverflow.com/questions/9211844/reflection-on-emberjs-objects-how-to-find-a-list-of-property-keys-without-knowi
    _propertiesMap: function(record) {
        var computedProps = [];
        record.constructor.eachComputedProperty(function(prop) {
            computedProps.push(prop);
        });

        var lifecycleProperties = ['isLoaded', 'isNew', 'isSaving', 'isValid', 'isError', 'isDeleted'];

        var props = {};
        for (var prop in record) {
            if (record.hasOwnProperty(prop) &&
                $.inArray(prop, computedProps) === -1 &&
                $.inArray(prop, lifecycleProperties) === -1 &&
                $.inArray(prop, this.privateProperties) === -1 &&
                prop.indexOf('__ember') < 0 &&
                prop.indexOf('_super') < 0 &&
                Ember.typeOf(record.get(prop)) !== 'function'
            ) {
                props[prop] = record[prop];
            }
        }

        return props;
    }
});

export default Rev1Serializer;
