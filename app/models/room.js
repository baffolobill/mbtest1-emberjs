import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  floor: DS.belongsTo('floor', { async: true }),
  rows: DS.hasMany('row', { async: true })
});
