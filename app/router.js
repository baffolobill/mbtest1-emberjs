import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('nodes', { path: '/nodes' });
  this.route('node', { path: '/nodes/:node_id' });

  this.route('racks', { path: '/racks' });
  this.route('rack', { path: '/racks/:rack_id' });

  this.route('rows', { path: '/rows' });
  this.route('row', { path: '/rows/:row_id' });

  this.route('rooms', { path: '/rooms' });
  this.route('room', { path: '/rooms/:room_id' });

  this.route('floors', { path: '/floors' });
  this.route('floor', { path: '/floors/:floor_id' });

  this.route('servers', { path: '/servers' });
  this.route('server', { path: '/servers/:server_id' });

  this.route('baskets', { path: '/baskets' });
  this.route('basket', { path: '/baskets/:basket_id' });

  this.route('servertemplates', { path: '/servertemplates' });
  this.route('servertemplate', { path: '/servertemplates/:servertemplate_id' });

  this.route('components', { path: '/components' });
  this.route('component', { path: '/components/:component_id' });
});
