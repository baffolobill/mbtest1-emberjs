import DS from 'ember-data';

export default DS.Model.extend({
  template: DS.belongsTo('server-template', { async: true }),
  hdd_qty: DS.attr('number'),
  hdd_form_factor: DS.belongsTo('property-option', { async: true }),
  hdd_connection_type: DS.belongsTo('property-option', { async: true })
});
