import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  node: DS.belongsTo('node', { async: true }),
  row: DS.belongsTo('row', { async: true }),
  total_units: DS.attr('number'),
  max_gap: DS.attr('number'),
  units: DS.hasMany('unit', { async: true }),
  servers: DS.hasMany('server', { async: true })
});
