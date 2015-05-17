import Model from "./core/model";

export default Model.extend({
    /*rack: DS.belongsTo('rack', { async: true }),
    position: DS.attr('number'),
    basket: DS.belongsTo('basket', { async: true }),
    server: DS.belongsTo('server', { async: true })*/
    uri: '/units',
    route_name: 'units',
    type_name: 'Unit',
    type_plural: 'Units',
});
