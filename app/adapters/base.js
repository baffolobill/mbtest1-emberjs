import Ember from "ember";
import DS from "ember-data";
import ENV from "mb-test-1/config/environment";

export default DS.RESTAdapter.extend({
  hostsByType: [],
  defaultSerializer: "mb-test-1/serializers/rev2",
  addTrailingSlashes: false,

  pathForType: function(type) {
    var dasherized = Ember.String.dasherize(type);
    return Ember.String.pluralize(dasherized);
  },

  completeURL: function(uri){
    var url = [uri];
    var host = Ember.get(this, 'host');
    var prefix = this.urlPrefix();

    if (prefix) { url.unshift(prefix); }

    url = url.join('/');
    if (!host && url) { url = '/' + url; }

    return url;
  },

  generateURI: function(type, id, snapshot) {
    var url = [];

    if (type) { url.push(this.pathForType(type)); }

    //We might get passed in an array of ids from findMany
    //in which case we don't want to modify the url, as the
    //ids will be passed in through a query param
    if (id && !Ember.isArray(id)) { url.push(encodeURIComponent(id)); }

    return url.join('/');
  },

  buildURL: function(type, id, snapshot) {
    var uri = this.generateURI(type, id, snapshot);
    var url = this.completeURL(uri);
    if (this.get('addTrailingSlashes')) {
      if (url.charAt(url.length - 1) !== '/') {
        url += '/';
      }
    }
    return url;
  },

  registerHostForType: function(type, host) {
    this.hostsByType.push({
      type: type,
      host: host
    });
  },

  getHostForType: function(type) {
    var hostType = this.hostsByType.findBy("type", type);
    if (hostType) {
      return hostType.host;
    } else {
      return ENV.APP.API_HOST;
    }
  },

  /*get: function(type, uri, success, error) {
    return Ember.assert("Your adapter should override get", false);
  },

  create: function(type, uri, data, success, error) {
    return Ember.assert("Your adapter should override create", false);
  },

  update: function(type, uri, data, success, error) {
    return Ember.assert("Your adapter should override update", false);
  },

  "delete": function(type, uri, success, error) {
    return Ember.assert("Your adapter should override delete", false);
  },*/

  _checkParams: function(type, uri) {
    if (!uri) {
      throw new Error('Missing URI in adapter call for %@'.fmt(type));
    }
    if (!type) {
      throw new Error('Missing type in adapter call for %@'.fmt(uri));
    }
  }
});
