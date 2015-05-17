import Ember from 'ember';

export default Ember.ArrayController.extend({
  model: Ember.A([
    Ember.Object.create({title: "Nodes", location: 'nodes', active: null}),
    Ember.Object.create({title: "Floors", location: 'floors', active: null}),
    Ember.Object.create({title: "Rooms", location: 'rooms', active: null}),
    Ember.Object.create({title: "Rows", location: 'rows', active: null}),
    Ember.Object.create({title: "Racks", location: 'racks', active: null}),
    Ember.Object.create({title: "Baskets", location: 'baskets', active: null}),
    Ember.Object.create({title: "Servers", location: 'servers', active: null}),
    Ember.Object.create({title: "Server Templates", location: 'servertemplates', active: null}),
    Ember.Object.create({title: "Components", location: 'components', active: null}),
  ]),
  title: "MB Test 1: EmberJS"
});
