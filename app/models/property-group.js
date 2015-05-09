import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  components: DS.hasMany('component'),
  position: DS.attr('number')
});
