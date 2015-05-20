import Ember from "ember";

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

    extractSingle: function(rawPayload, href) {
        var included_storage = Ember.Object.createWithMixins(Ember.Copyable);
        var payload = this.normalizePayload(rawPayload, included_storage);
        var primaryRecord;

        Ember.Logger.debug('extractSingle: rawPayload=', rawPayload);

        if (!!!payload['data']) {
            Ember.warn('Key <data> is required in payload.');
            return null;
        }

        var value = payload['data'];
        if (value === null) {
            return null;
        }

        if (Ember.typeOf(value) === 'array') {
            Ember.warn('Single object have to be returned under the key <data>.');
            return null;
        }

        //var typeName = value['type'];
        primaryRecord = this.normalize(value, included_storage);

        Ember.Logger.debug('extractSingle: primaryRecord=', primaryRecord);

        return primaryRecord;
    },

    extractCollection: function(rawPayload) {
        var self = this;
        var included_storage = Ember.Object.createWithMixins(Ember.Copyable);

        var nextUri = rawPayload.links ? rawPayload.links.next : null;
        var counts = rawPayload.meta ? rawPayload.meta.counts : null;
        var total = rawPayload.meta ? rawPayload.meta.total : null;

        var payload = this.normalizePayload(rawPayload, included_storage);

        if (Ember.typeOf(payload['data']) !== 'array') {
            Ember.warn('Array must be returned.');
            return null;
        }

        var collection = [];
        payload['data'].forEach(function(value){
            collection.push(self.normalize(value, included_storage));
        });

        return {
            items: collection,
            //linked: linked,
            next_uri: nextUri,
            counts: counts,
            total: total
        };
    },

    resolveLink: function(linkage, included_storage) {
        var original = included_storage[linkage['type']][linkage['id']];
        /*var embered = Ember.Object.createWithMixins(Ember.Copyable);
        for (var prop in original) {
            embered.set(prop, Ember.copy(original[prop], true));
        }
        return embered;*/
        return Ember.copy(original, true);
    },

    /**
    * Flatten links
    */
    normalize: function(hash, included_storage) {
        if (!hash) { return hash; }

        var key, relation, linkage, relation_key;
        var json = { };
        var links = hash['links'];
        var meta = hash['meta'];
        delete hash['links'];
        delete hash['meta'];

        if (Ember.typeOf('links') === 'object') {
            json['uri'] = links['self'];
            delete links['self'];
        }

        for (key in hash) {
            json[key] = hash[key];
        }
        json['_type'] = json['type'];
        delete json['type'];

        if (Ember.typeOf(links) === 'object') {
            for (relation_key in links) {
                relation = links[relation_key];
                if (!!!relation) {
                    json[relation_key] = null;
                    continue;
                }
                linkage = relation['linkage'];
                if (!!!linkage) {
                    Ember.warn('Attribute <linkage> cannot be null.');
                    json[relation_key] = null;
                    continue;
                }
                if (Ember.typeOf(linkage) === 'array' && linkage.length) {
                    json[relation_key] = [];
                    for (var i=0,l=linkage.length; i<l; i++) {
                        json[relation_key].push(this.resolveLink(linkage[i], included_storage));
                    }
                } else {
                    json[relation_key] = this.resolveLink(linkage, included_storage);
                }
            }
        }
        return json;
    },

    /**
    * Extract top-level "links" before normalizing.
    */
    normalizePayload: function(payload, included_storage) {
        if (payload.included) {
            this.extractIncluded(payload.included, included_storage);
            delete payload.included;
        }
        return payload;
    },

    /*
    * Extract top-level "included" containing associated objects
    */
    extractIncluded: function(included, storage) {
        var link, value, relation;
        var typeName, objectId, linkage, linkedTypeName, relationId;

        // fill storage at first
        for (var i=0, l=included.length; i<l; i++) {
            value = included[i];
            value['_type'] = value['type'];
            delete value['type'];
            typeName = value['_type'];
            objectId = value['id']+"";
            storage[typeName] = storage[typeName] || {};
            storage[typeName][objectId] = value;
        }

        // find && replace 'links'
        for (typeName in storage) {
            for (objectId in storage[typeName]) {
                value = Ember.copy(storage[typeName][objectId], true);
                if (!value.links) {
                    continue;
                }
                for (relation in value.links) {
                    linkage = value.links[relation]['linkage'];
                    relationId = linkage['id']+"";
                    linkedTypeName = linkage["type"];
                    value[relation] = Ember.copy(storage[linkedTypeName][relationId], true);
                }
                delete value.links;
                storage[typeName][objectId] = value;
            }
        }
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
