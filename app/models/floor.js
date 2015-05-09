import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  node: DS.belongsTo('node', { async: true }),
  rooms: DS.hasMany('room', { async: true })
});
