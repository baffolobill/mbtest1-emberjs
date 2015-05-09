import ENV from "mb-test-1/config/environment";

export default {
    name: 'global-env-mbtest1',
    initialize: function(container, app) {
        container.typeInjection('controller', 'ENV', 'env:main');
        container.typeInjection('route', 'ENV', 'env:main');
        container.register('env:main', ENV, {
            instantiate: false,
            singleton: true
        });
    }
};
