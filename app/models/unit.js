import DS from 'ember-data';

export default DS.Model.extend({
  rack: DS.belongsTo('rack', { async: true }),
  position: DS.attr('number'),
  basket: DS.belongsTo('basket', { async: true }),
  server: DS.belongsTo('server', { async: true })
});
