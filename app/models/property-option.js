import DS from 'ember-data';

export default DS.Model.extend({
  property: DS.belongsTo('property'),
  name: DS.attr('string'),
  position: DS.attr('number')
});
