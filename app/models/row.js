import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  room: DS.belongsTo('room', { async: true }),
  racks: DS.hasMany('rack', { async: true })
});
