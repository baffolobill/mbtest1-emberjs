import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  cpu_socket: DS.belongsTo('property-option', { async: true }),
  cpu_qty: DS.attr('number'),
  ram_standard: DS.belongsTo('property-option', { async: true }),
  ram_qty: DS.attr('number'),
  unit_takes: DS.attr('number'),
  hdds: DS.hasMany('server-template-hdd', { async: true })
});
