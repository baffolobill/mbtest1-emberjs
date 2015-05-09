import DS from 'ember-data';

export default DS.Model.extend({
  component: DS.belongsTo('component'),
  property: DS.belongsTo('property'),
  position: DS.attr('number')
});
