import Ember from "ember";
//import DS from "ember-data";
import LoadPromise from "./mixins/load-promise";
import TypeMappings from "./type-mappings";
import {
  _bind,
  _guard,
  _objectIsAlive
} from "mb-test-1/lib/ember-data/system/store/common";
import {
  serializerForAdapter
} from "mb-test-1/lib/ember-data/system/store/serializers";

var Promise = Ember.RSVP.Promise;

var getAdapter = function() {
    return MbTestApp.__container__.lookup("adapter:main");
};

var ModelArray = Ember.ArrayProxy.extend(LoadPromise, {
    hasNextPage: false,
    loadingNextPage: false,

    loadNextPage: function() {
        var self = this;

        var promise = this.resolveOn('didLoad');
        self.set('loadingNextPage', true);

        if (this.get('hasNextPage')) {
            var typeClass = this.get('typeClass');
            getAdapter().find(typeClass, this.get('next_uri')).then(function(json) {
                var deserializedJson = typeClass.serializer.extractCollection(json);
                self._populateModels(deserializedJson);
                self.set('loadingNextPage', false);
            });
        } else {
            promise.reject(this);
            self.set('loadingNextPage', false);
        }

        return promise;
    },

    loadAll: function() {
        var self = this;
        var loadAll = _.bind(this.loadAll, this);

        if (this.get('isLoaded')) {
            _.defer(function() {
                if (self.get('hasNextPage') && !self.get('loadingNextPage')) {
                    self.loadNextPage().then(loadAll);
                }
            });
        } else {
            this.one('didLoad', loadAll);
        }
    },

    reload: function() {
        var deferred = Ember.RSVP.defer();
        if (!this.get('isLoaded')) {
            return this;
        }

        var self = this;
        this.set('isLoaded', false);
        var typeClass = this.get('typeClass');

        getAdapter().find(this.constructor, this.get('uri')).then(function(json) {
            // todo, maybe we should go through and reload each item rather
            // than nuking and re-adding
            self.clear();
            var deserializedJson = typeClass.serializer.extractCollection(json);
            self._populateModels(deserializedJson);
            deferred.resolve(self);
        }, function() {
            deferred.reject(self);
        });
        return deferred.promise;
    },

    _populateModels: function(json) {
        //Ember.Logger.debug('input data:');
        //Ember.Logger.debug(json);
        var self = this;

        var typeClass = this.get('typeClass');

        var itemsArray;
        if (json && $.isArray(json)) {
            itemsArray = json;
            this.setProperties({
                next_uri: undefined,
                hasNextPage: false,
                counts: {},
                total: json.length
            });
        } else {
            if (json && json.items && $.isArray(json.items)) {
                //Ember.Logger.debug('next step is here - parse json.items: ');
                //Ember.Logger.debug(json.items);

                itemsArray = json.items;

                if (json.linked) {
                    this.set('linked', json.linked);
                }

                if (json.next_uri) {
                    this.set('next_uri', json.next_uri);
                    this.set('hasNextPage', true);
                } else {
                    this.set('next_uri', undefined);
                    this.set('hasNextPage', false);
                }

                this.set('counts', json.counts);
                this.set('total', json.total);
            } else {
                this.set('isError', true);
                return;
            }
        }

        var typedObjects = _.map(itemsArray, function(item) {
            var typedObj = typeClass._materializeLoadedObjectFromAPIResult(item);

            // if an object is deleted, remove it from the collection
            typedObj.on('didDelete', function() {
                self.removeObject(typedObj);
            });

            return typedObj;
        });

        //Ember.Logger.debug('typedObjects is equal to: ');
        //Ember.Logger.debug(typedObjects);

        this.addObjects(typedObjects);
        this.set('isLoaded', true);
        this.trigger('didLoad');
    },

    _handleError: function(jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 400) {
            this.set('isValid', false);
            this.trigger('becameInvalid', jqXHR.responseText);
        } else {
            this.set('isError', true);
            this.trigger('becameError', jqXHR.responseText);
        }
    },


    _findAll: function(adapter, store, type, uri) {
        var self = this;
        var promise = adapter.find(store, type, uri);
        var serializer = serializerForAdapter(store, adapter, type);
        var label = "ModelArray: Handle Adapter#findAll of " + type;

        promise = Promise.cast(promise, label);
        promise = _guard(promise, _bind(_objectIsAlive, store));

        return promise.then(function(adapterPayload) {
            store._adapterRun(function() {
                var payload = serializer.extract(store, type, adapterPayload, null, 'array');
                Ember.assert("The response from a findAll must be an Array, not " + Ember.inspect(payload), Ember.typeOf(payload) === 'array');

                payload.forEach(function(data) {
                    self.addObject(store.push(type, store.normalize(type, data)));
                });
            });

            //store.didUpdateAll(type);
        }, null, "ModelArray: Extract payload of findAll " + type);
    }
});

ModelArray.reopenClass({
    newArrayLoadedFromUri: function(uri, defaultType) {
        var typeClass = TypeMappings.typeClass(defaultType);
        var modelObjectsArray = this.create({
            content: Ember.A(),
            typeClass: typeClass,
            uri: uri
        });

        if (!uri) {
            //Ember.Logger.warn("DELETE ME: No URI");
            return modelObjectsArray;
        }
        modelObjectsArray.set('isLoaded', false);
        getAdapter().find(typeClass, uri).then(function(json) {
            var deserializedJson = typeClass.serializer.extractCollection(json);
            //Ember.Logger.debug('deserializedJson: ');
            //Ember.Logger.debug(deserializedJson);
            modelObjectsArray._populateModels(deserializedJson);
        }, function(jqXHR, textStatus, errorThrown) {
            //Ember.Logger.debug(arguments);
            modelObjectsArray._handleError(jqXHR, textStatus, errorThrown);
        });//*/

        return modelObjectsArray;
    },

    newArrayCreatedFromJson: function(json, defaultType) {
        var typeClass = TypeMappings.typeClass(defaultType);
        var modelObjectsArray = this.create({
            content: Ember.A(),
            typeClass: typeClass,
            uri: null
        });

        if (!json) {
            return modelObjectsArray;
        }

        var deserializedJson = typeClass.serializer.extractCollection(json);
        modelObjectsArray._populateModels(deserializedJson);

        return modelObjectsArray;
    }
});

export default ModelArray;
