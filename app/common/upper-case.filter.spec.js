describe('upperCase filter', function() {

    beforeEach(module('app'));

    var $filter;

    beforeEach(inject(function(_$filter_) {
        $filter = _$filter_;
    }));

    it('"hello world!" hould be "HELLO WORLD!"', function() {
        var filter = $filter('upperCase');
        expect(filter('hello world!')).toEqual('HELLO WORLD!');
    });

});