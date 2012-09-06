var assert      = require('assert'),
    domains     = require('../src/domains'),
    _           = require('underscore');


describe('Domains', function () {
  describe('tidy up', function () {

    it('should reduce urls to a root domain', function() {
      var tests = {
        'foo.com':                      'foo.com',
        'FOO.COM':                      'foo.com',
        'www.foo.com':                  'foo.com',
        'http://foo.com/':              'foo.com',
        'https://foo.com/':             'foo.com',
        'http://foo.com/bar/baz':       'foo.com',
        'http://foo.com/bar?query=baz': 'foo.com',
        'http://foo.com/#frag':         'foo.com',
      };
      
      _.each(tests, function (expected, input) {
        assert.equal( domains.cleanup(input), expected, input );
      });
      
    });

    it('should extract hostname from email', function () {
      var tests = {
        'test@example.com':    'example.com',
        'hello+there@foo.com': 'foo.com',
      };
      _.each(tests, function (expected, input) {
        assert.equal( domains.cleanup(input), expected, input );
      });
    });

    it('should handle bad entries', function () {
      var tests = {
        '':               '',
        '   foo.com  ':   'foo.com',
        '   foo . com  ': 'foo.com',
      };
      _.each(tests, function (expected, input) {
        assert.equal( domains.cleanup(input), expected, input );
      });
    });

  });
});
