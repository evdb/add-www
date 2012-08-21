require 'test/unit'
require 'watir-webdriver'
require 'watir-webdriver/wait'
require 'uri'

class WatirTestCase < Test::Unit::TestCase


  def setup

    # work out which url to use - by default use port 3000 which is what the
    # development server runs on. If the NODE_ENV is set to 'testing' use port
    # 3100. This should apply to the test suite when run from the Makefile
    # (which will also build the assets and start the testing server on that
    # port). 
    @test_port = ENV['NODE_ENV'] == 'testing' ? 3000 : 3000
    @test_base_host_port  = "127.0.0.1.xip.io:#{@test_port}"

    @test_sales_site = make_url 'www'

    # create the browser and go to the homepage
    @b = Watir::Browser.new :chrome
    @b.goto make_url
  end

  def teardown
    @b.quit
  end

  def make_url subdomain=false
    subdomain = subdomain ? subdomain + '.' : ''
    "http://#{subdomain}#{@test_base_host_port}/"
  end

  def goto relative_url
    current_url = @b.url
    next_url = URI.join current_url, relative_url
    @b.goto next_url.to_s
  end

end
