describe('Welcome', function() {

    beforeEach(module('app'));

    var $controller;

    beforeEach(inject(function(_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    it('message should be "Hello World!"', function() {
        var controller = $controller('WelcomeController');
        expect(controller.message).toEqual('Hello World!');
    });

});
