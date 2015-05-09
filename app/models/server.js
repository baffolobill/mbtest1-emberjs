import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  node: DS.belongsTo('node', { async: true }),
  rack: DS.belongsTo('rack', { async: true }),
  basket: DS.belongsTo('basket', { async: true }),
  template: DS.belongsTo('server-template', { async: true })
});
