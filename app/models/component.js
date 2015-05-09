import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  manufacturer: DS.attr('string'),
  model_name: DS.attr('string'),
  serial_number: DS.attr('string'),
  state: DS.attr('string'),
  server: DS.belongsTo('server'),
  kind: DS.belongsTo('property-option')
});
