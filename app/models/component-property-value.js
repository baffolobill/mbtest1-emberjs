import DS from 'ember-data';

export default DS.Model.extend({
  component: DS.belongsTo('component'),
  property: DS.belongsTo('property'),
  property_group: DS.belongsTo('property-group'),
  value: DS.attr('string'),
  value_as_float: DS.attr('number'),
  option: DS.belongsTo('property-group')
});
