import Ember from "ember";
import LoadPromise from "./mixins/load-promise";
import TypeMappings from "./type-mappings";
import Computed from "../../utils/computed";
import Rev1Serializer from "mb-test-1/serializers/rev1";
import Utils from "../../lib/utils";
import ModelArray from "./model-array";
//import ValidationServerErrorHandler from "mb-test-1/utils/error-handlers/validation-server-error-handler";


var JSON_PROPERTY_KEY = '__json';
var URI_POSTFIX = '_uri';
var URI_METADATA_PROPERTY = '_uris';
var INTEGER_REGEX = /\b[0-9]+\b/;
var PRIVATE_PROPERTIES = ['id', 'validationErrors', '_type'];
var AJAX_ERROR_PARSERS = [];

var Model = Ember.Object.extend(Ember.Evented, Ember.Copyable, LoadPromise, {
    isLoaded: false,
    isSaving: false,
    isDeleted: false,
    isError: false,
    isNew: true,
    isValid: true,

    displayErrorDescription: function() {
        return (!this.get('isValid') || this.get('isError')) &&
            (!this.get('validationErrors') || !_.keys(this.get('validationErrors')).length);
    }.property('isValid', 'isError', 'validationErrors'),

    id: Computed.orProperties('__json.id', '_id'),

    // computes the ID from the URI - exists because at times Ember needs the
    // ID of our model before it has finished loading. This gets overridden
    // when the real model object gets loaded by the ID value from the JSON
    // attribute
    _id: function() {
        var uri = this.get('uri');

        if (uri) {
            return uri.substring(uri.lastIndexOf('/') + 1);
        }
    }.property('uri'),

    save: function(settings) {
        var Adapter = this.constructor.getAdapter();
        var self = this;
        settings = settings || {};
        var data = this.constructor.serializer.serialize(this);

        self.set('isSaving', true);

        var creatingNewModel = this.get('isNew');

        var resolveEvent = creatingNewModel ? 'didCreate' : 'didUpdate';
        var uri = creatingNewModel ? this._createUri() : this.get('uri');
        var adapterFunc = creatingNewModel ? Adapter.createRecord : Adapter.updateRecord;

        var promise = this.resolveOn(resolveEvent);

        Ember.Logger.debug('Model.save: uri=', uri);
        Ember.Logger.debug('Model.save: data=', data);

        adapterFunc.call(Adapter, this.constructor, uri, data, settings).then(function(json) {
            var deserializedJson = self.constructor.serializer.extractSingle(json, self.constructor, (creatingNewModel ? null : self.get('href')));
            self._updateFromJson(deserializedJson);

            self.setProperties({
                isNew: false,
                isSaving: false,
                isValid: true,
                isError: false
            });

            self.trigger(resolveEvent);
            Model.Events.trigger(resolveEvent, self);
        }, $.proxy(self._handleError, self));

        return promise;
    },

    ingestErrorResponse: function(response) {
        var errorHandler = new ValidationServerErrorHandler(this, response);
        errorHandler.execute();
    },

    validateAndSave: function(settings) {
        this.get("validationErrors").clear();
        this.validate();
        if (this.get("isValid")) {
            var Adapter = this.constructor.getAdapter();
            var self = this;
            settings = settings || {};
            var data = this.constructor.serializer.serialize(this);

            self.set('isSaving', true);

            var creatingNewModel = this.get('isNew');
            var uri = creatingNewModel ? this._createUri() : this.get('uri');
            var adapterFunc = creatingNewModel ? Adapter.createRecord : Adapter.updateRecord;
            var deferred = Ember.RSVP.defer();
            var successHandler = function(json) {
                var deserializedJson = self.constructor.serializer.extractSingle(json, self.constructor, (creatingNewModel ? null : self.get('href')));
                self._updateFromJson(deserializedJson);
                self.setProperties({
                    isNew: false,
                    isSaving: false,
                    isValid: true,
                    isError: false
                });
            };

            adapterFunc.call(Adapter, this.constructor, uri, data, settings).then(function(json) {
                successHandler(json);
                deferred.resolve(self);
            }, function(response) {
                self.ingestErrorResponse(response.responseJSON);
                deferred.reject(self);
            });
            return deferred.promise;
        }
        else {
            return Ember.RSVP.reject(this);
        }
    },

    _createUri: function() {
        return this.get('uri');
    },

    delete: function(settings) {
        var self = this;
        settings = settings || {};

        Ember.Logger.debug('Model.delete:');
        Ember.Logger.debug(this);
        Ember.Logger.debug(this.get('uri'));

        this.setProperties({
            isDeleted: true,
            isSaving: true
        });

        this
            .constructor
            .getAdapter()
            .deleteRecord(this.constructor, this.get('uri')).then(function(json) {
                self.set('isSaving', false);
                self.trigger('didDelete');
                Model.Events.trigger('didDelete', self);
            }, $.proxy(self._handleError, self), settings);
        return this.resolveOn('didDelete');
    },

    reload: function() {
        if (!this.get('isLoaded')) {
            return this;
        }

        var self = this;
        this.set('isLoaded', false);

        var promise = this.resolveOn('didLoad');

        Ember.Logger.debug('Model.reload: uri=', this.get('uri'));

        this
            .constructor
            .getAdapter()
            .find(this.constructor, this.get('uri')).then(function(json) {
                var deserializedJson = self.constructor.serializer.extractSingle(json, self.constructor, self.get('href'));
                self._updateFromJson(deserializedJson);
                self.set('isLoaded', true);
                self.trigger('didLoad');
            }, $.proxy(self._handleError, self));

        return promise;
    },

    copy: function() {
        var modelObject = this.constructor.create({
            uri: this.get('uri')
        });

        modelObject._updateFromJson(this.get(JSON_PROPERTY_KEY));
        return modelObject;
    },

    updateFromModel: function(modelObj) {
        this._updateFromJson(modelObj.get(JSON_PROPERTY_KEY));
    },

    populateFromJsonResponse: function(json) {
        var decodingUri = this.get('isNew') ? null : this.get('uri');
        var modelJson = this.constructor.serializer.extractSingle(json, this.constructor, decodingUri);

        if (modelJson) {
            this._updateFromJson(modelJson);
        } else {
            this.setProperties({
                isNew: false,
                isError: true
            });

            this.trigger('becameError');
        }
    },

    getPojoProperties: function(pojo) {
        return Ember.getProperties(pojo, Object.keys(pojo));
    },
    getProxiedProperties: function(proxyObject) {
        // Three levels, first the content, then the prototype, then the properties of the instance itself
        var contentProperties = this.getPojoProperties(proxyObject.get('content')),
            prototypeProperties = Ember.getProperties(proxyObject, Object.keys(proxyObject.constructor.prototype)),
            objectProperties = this.getPojoProperties(proxyObject);
        return Ember.merge(Ember.merge(contentProperties, prototypeProperties), objectProperties);
    },
    getEmberObjectProperties: function(emberObject) {
        var prototypeProperties = Ember.getProperties(emberObject, Object.keys(emberObject.constructor.prototype)),
            objectProperties = this.getPojoProperties(emberObject);
        return Ember.merge(prototypeProperties, objectProperties);
    },
    getProperties: function(object) {
        if (object instanceof Ember.ObjectProxy) {
            return this.getProxiedProperties(object);
        } else if (object instanceof Ember.Object) {
            return this.getEmberObjectProperties(object);
        } else {
            return this.getPojoProperties(object);
        }
    },

    _updateFromJson: function(json) {
        var self = this;
        if (!json) {
            return;
        }

        var changes = {
            isNew: false
        };
        changes[JSON_PROPERTY_KEY] = json;
        //changes['_type'] = this.type_plural;

        //Ember.Logger.debug('_updateFromJson: JSON=', json);

        this.setProperties(changes);

        var class_props = this.getProperties(this.constructor.proto());
        //Ember.Logger.debug('PROPS: ', class_props);

        Ember.changeProperties(function() {
            for (var prop in json) {
                if (json.hasOwnProperty(prop)) {
                    if (class_props[prop] || self[prop] instanceof Ember.ComputedProperty) {
                        //Ember.Logger.debug('--> exclude property ', prop, json[prop]);//*/
                        continue;
                    }
                    if ($.inArray(prop, PRIVATE_PROPERTIES) >= 0) {
                        //Ember.Logger.debug('--> exclude private property ', prop, json[prop]);//*/
                        continue;
                    }
                    if (prop === 'type') {
                        self.set('_type', json[prop]);
                        continue;
                    }
                    //Ember.Logger.debug('--> SET property ', prop, json[prop]);//*/

                    //var desc = Ember.meta(self.constructor.proto(), false);
                    //Ember.Logger.debug(desc);


                    /*var desc = Ember.meta(self.constructor.proto(), false).descs[prop];
                    // don't override computed properties with raw json
                    if (!(desc && desc instanceof Ember.ComputedProperty)) {
                        self.set(prop, json[prop]);
                    }*/
                    var value = json[prop];
                    if (Ember.typeOf(value) === 'object') {
                        self.set(prop, Ember.Object.create(value));
                    } else if (Ember.typeOf(value) === 'array') {
                        var arr = Ember.A();
                        value.forEach(function(item) {
                            arr.pushObject(
                                Ember.Object.create(item)
                            );
                        });
                        self.set(prop, arr);
                    } else {
                        self.set(prop, json[prop]);
                    }
                }
            }
        });

        this.set('isLoaded', true);
        this.trigger('didLoad');
    },

    _handleError: function(jqXHR, textStatus, errorThrown) {
        this.set('isSaving', false);

        if (jqXHR.status >= 400 && jqXHR.status < 500) {
            this.set('isValid', false);
            this.trigger('becameInvalid', jqXHR.responseJSON || jqXHR.responseText);
        } else {
            this.setProperties({
                isError: true,
                errorStatusCode: jqXHR.status
            });
            this.trigger('becameError', jqXHR.responseJSON || jqXHR.responseText);
        }

        if (jqXHR.responseJSON) {
            var res = jqXHR.responseJSON;

            if (res.errors && res.errors.length > 0) {
                var error = res.errors[0];

                _.each(AJAX_ERROR_PARSERS, function(ERROR_PARSER) {
                    var doesMatch = false;
                    if (_.isFunction(ERROR_PARSER.match)) {
                        doesMatch = ERROR_PARSER.match(error);
                    } else if (_.isRegExp(ERROR_PARSER.match)) {
                        doesMatch = ERROR_PARSER.match.test(error.category_code);
                    } else if (_.isString(ERROR_PARSER.match) && ERROR_PARSER.match === error.category_code) {
                        doesMatch = true;
                    } else if (!ERROR_PARSER.match) {
                        doesMatch = true;
                    }

                    if (doesMatch) {
                        error = ERROR_PARSER.parse(error);
                    }
                });

                this.setProperties({
                    validationErrors: Utils.extractValidationErrorHash(res),
                    errorDescription: error.description,
                    requestId: error.request_id,
                    errorCategoryCode: error.category_code,
                    lastError: error
                });
            } else {
                if (res.description) {
                    this.set('errorDescription', res.description);
                }

                if (res.request_id) {
                    this.set('requestId', res.requestId);
                }
            }
        }
    },

    _extractTypeClassFromUrisMetadata: function(uriProperty) {
        var uriMetadataProperty = JSON_PROPERTY_KEY + '.' + URI_METADATA_PROPERTY;

        var metadataType = this.get(uriMetadataProperty + '.' + uriProperty + '._type');
        if (metadataType) {
            var mappedType = TypeMappings.classForType(metadataType);
            if (mappedType) {
                return mappedType;
            } else {
                Ember.Logger.warn('Couldn\'t map _type of %@ for URI: %@'.fmt(metadataType, this.get('uri')));
            }
        }

        return undefined;
    },

    isEqual: function(a, b) {
        b = b || this;
        return Ember.get(a, 'id') === Ember.get(b, 'id');
    }
});

Model.reopenClass({
    getAdapter: function() {
        return MbTestApp.__container__.lookup("adapter:main");
    },

    serializer: Rev1Serializer.create(),

    find: function(uri, settings) {
        Ember.Logger.debug('Model.find: uri=', uri);
        var modelClass = this;
        var modelObject = modelClass.create({
            uri: uri
        });

        modelObject.setProperties({
            isLoaded: false,
            isNew: false
        });

        this
            .getAdapter()
            .find(modelClass, uri).then(function(json) {
                Ember.Logger.debug('Model.find: json=', json);
                modelObject.populateFromJsonResponse(json, uri);
            }, $.proxy(modelObject._handleError, modelObject));

        //Ember.Logger.debug('modelObject:', modelObject);

        return modelObject;
    },

    fetch: function(uri, settings) {
        var modelClass = this;
        var deferred = Ember.RSVP.defer();
        this
            .getAdapter()
            .get(modelClass, uri, function(json) {
                var object = modelClass.create({
                    uri: uri,
                    isLoaded: false,
                    isNew: false
                });
                object.populateFromJsonResponse(json, uri);
                deferred.resolve(object);
            }, function(error) {
                deferred.reject(error.responseJSON);
            });
        return deferred.promise;
    },

    findAll: function(settings) {
        var uri = this.create().get('uri');

        if (!uri) {
            throw new Error('Can\'t call findAll for class that doesn\'t have a default URI: %@'.fmt(this));
        }

        return ModelArray.newArrayLoadedFromUri(uri, this);
    },

    constructUri: function(id) {
        var uri = this.create().get('uri');
        if (id) {
            return Utils.combineUri(uri, id);
        }
        return uri;
    },

    /*
     * Used for adding a one-to-one association to a model.
     *
     * Params:
     * - propertyName - The property whose value we'll get to determine the URI
     *  or embedded data to use for the association
     *  - defaultType - Used as a fallback in case the object doesn't have a
     * _type or the _uris doesn't have data for this association
     *
     * Example:
     *
     * Marketplace = UserMarketplace.extend({
     *      owner_customer: Model.belongsTo('owner_customer_json', 'customer')
     * });
     */
    belongsTo: function(propertyName, defaultType) {
        defaultType = defaultType || 'model';

        var embeddedProperty = JSON_PROPERTY_KEY + '.' + propertyName;
        var uriProperty = propertyName + URI_POSTFIX;
        var fullUriProperty = JSON_PROPERTY_KEY + '.' + propertyName + URI_POSTFIX;

        return Ember.computed(function() {
            var typeClass = TypeMappings.typeClass(defaultType);

            var embeddedPropertyValue = this.get(embeddedProperty);
            var uriPropertyValue = this.get(fullUriProperty);

            if (embeddedPropertyValue) {
                if (!embeddedPropertyValue._type) {
                    var response_like = {};
                    response_like[embeddedPropertyValue.type] = [embeddedPropertyValue];
                    embeddedPropertyValue = typeClass.serializer.extractSingle(response_like, typeClass) || embeddedPropertyValue;
                }

                var embeddedObj = typeClass._materializeLoadedObjectFromAPIResult(embeddedPropertyValue);
                return embeddedObj;
            } else if (uriPropertyValue) {
                var metadataTypeClass = this._extractTypeClassFromUrisMetadata(uriProperty);
                if (metadataTypeClass) {
                    typeClass = metadataTypeClass;
                    return typeClass.find(uriPropertyValue);
                } else {
                    // if we can't figure out what type it is from the
                    // metadata, fetch it and set the result as an embedded
                    // property in our JSON. That'll force an update of the
                    // association
                    var self = this;
                    this
                        .constructor
                        .getAdapter()
                        .get(defaultType, uriPropertyValue, function(json) {
                            var modelJson = typeClass.serializer.extractSingle(json, typeClass, uriPropertyValue);
                            self.set(embeddedProperty, modelJson);
                        });

                    return embeddedPropertyValue;
                }
            } else {
                return embeddedPropertyValue;
            }
        }).property(embeddedProperty, fullUriProperty);
    },

    belongsToWithUri: function(defaultType, uriPropertyName) {
        return Ember.computed(function() {
            var typeClass = this.get("container").lookupFactory("model:" + defaultType);
            var uriPropertyValue = this.get(uriPropertyName);
            if (uriPropertyValue) {
                return typeClass.find(uriPropertyValue);
            } else {
                return null;
            }
        }).property(uriPropertyName);
    },

    /*
     * Used for adding a one-to-many association to a model.
     *
     * Params:
     * - propertyName - The property whose value we'll get to determine the URI
     *  or embedded data to use for the association
     *  - defaultType - Used to find/construct child objects. If the _type
     * field is present in the returned JSON, we'll map that to create objects
     * of the correct type. Since we use the type of object to pick which host
     * to use, it's important to set the defaultType, even if your returned
     * data uses the _type field.
     *
     * Example:
     *
     * Marketplace = UserMarketplace.extend({
     *      customers: Model.hasMany('customers_json', 'customer')
     * });
     */
    hasMany: function(propertyName, defaultType) {
        defaultType = defaultType || 'model';

        var embeddedProperty = JSON_PROPERTY_KEY + '.' + propertyName;
        var uriProperty = propertyName + URI_POSTFIX;
        var fullUriProperty = JSON_PROPERTY_KEY + '.' + uriProperty;
        var uriMetadataProperty = JSON_PROPERTY_KEY + '.' + URI_METADATA_PROPERTY;

        return Ember.computed(function() {
            var typeClass = TypeMappings.typeClass(defaultType);
            var embeddedPropertyValue = this.get(embeddedProperty);
            // if the URI isn't defined in the JSON, check for a property on
            // the model. This way we can hardcode URIs if necessary to support
            // undocumented URIs
            var uriPropertyValue = this.get(fullUriProperty) || this.get(uriProperty);

            if (embeddedPropertyValue) {
                return ModelArray.newArrayCreatedFromJson(embeddedPropertyValue, defaultType);
            } else if (uriPropertyValue) {
                return ModelArray.newArrayLoadedFromUri(uriPropertyValue, defaultType);
            } else {
                return ModelArray.create({
                    content: Ember.A(),
                    typeClass: typeClass
                });
            }
        }).property(embeddedProperty, uriProperty, fullUriProperty, uriMetadataProperty + '.@each');
    },

    _materializeLoadedObjectFromAPIResult: function(json) {
        //Ember.Logger.debug('ok, me. Lets test _materializeLoadedObjectFromAPIResult: ');
        //Ember.Logger.debug('input data: ');
        //Ember.Logger.debug(json);

        var objClass = this;

        if (json._type) {
            var mappedTypeClass = TypeMappings.classForType(json._type);
            if (mappedTypeClass) {
                objClass = mappedTypeClass;
            }
        } else {
            // HACK - once we fix the API response from the auth proxy, we should take out the if
            Ember.Logger.warn('No _type field found on URI: ' + json.uri);
        }

        var typedObj = objClass.create();
        typedObj.set('isNew', false);
        typedObj._updateFromJson(json);
        typedObj.trigger('didLoad');

        //Ember.Logger.debug('typedObj: ');
        //Ember.Logger.debug(typedObj);

        return typedObj;
    },

    _isEmbedded: function(propertyName, settings) {
        settings = settings || {};

        var embedded = !(/_uri$/.test(propertyName));
        if (settings.hasOwnProperty('embedded')) {
            embedded = settings.embedded;
        }

        return embedded;
    }
});

Model.Events = Ember.Object.extend(Ember.Evented).create();

export default Model;
