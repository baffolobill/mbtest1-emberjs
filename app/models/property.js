import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  title: DS.attr('string'),
  groups: DS.hasMany('property-group'),
  components: DS.hasMany('component'),
  position: DS.attr('number'),
  unit: DS.attr('string'),
  type: DS.attr('number'),
  required: DS.attr('boolean'),
  options: DS.hasMany('property-option')
});
