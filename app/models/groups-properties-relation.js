import DS from 'ember-data';

export default DS.Model.extend({
  group: DS.belongsTo('property-group'),
  property: DS.belongsTo('property'),
  position: DS.attr('number')
});
