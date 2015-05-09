import DS from 'ember-data';

export default DS.Model.extend({
  basket: DS.belongsTo('basket'),
  position: DS.attr('number'),
  server: DS.belongsTo('server')
});
