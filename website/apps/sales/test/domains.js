var assert      = require('assert'),
    domains     = require('../src/domains'),
    _           = require('underscore'),
    config      = require('config');


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
  
  describe('report', function () {
    it('should correctly identify messages to show', function () {

      var our_ip = config.general.redirector_ip_address;

      var tests = [
        {
          input: {
            root_ip_address: [],
            www_ip_address:  [],
          },
          expected: {
            root_ip_status:   'does_not_resolve',
            www_ip_status:    'does_not_resolve',
          }
        },
        {
          input: {
            root_ip_address: [our_ip],
            www_ip_address:  [our_ip],
          },
          expected: {
            root_ip_status:   'is_our_ip',
            www_ip_status:    'is_our_ip',
          }
        },
        {
          input: {
            root_ip_address: ['1.2.3.4'],
            www_ip_address:  ['1.2.3.4'],
          },
          expected: {
            root_ip_status:   'not_our_ip',
            www_ip_status:    'not_our_ip',
          }
        },
        {
          input: {
            root_ip_address: ['1.2.3.4', our_ip],
            www_ip_address:  ['1.2.3.4', our_ip],
          },
          expected: {
            root_ip_status:   'not_our_ip',
            www_ip_status:    'not_our_ip',
          }
        },
      ];

      _.each(tests, function (test) {
        assert.deepEqual( domains.report(test.input), test.expected );
      });
    });
  });
});
