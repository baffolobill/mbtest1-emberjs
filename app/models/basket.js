import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  rack: DS.belongsTo('rack'),
  slot_qty: DS.attr('number'),
  unit_takes: DS.attr('number'),
  servers: DS.hasMany('server')
});
