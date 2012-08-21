require 'watir_test_case'
require 'pry'

class Redirection < WatirTestCase

  def test_free_redirection
    non_www_url = make_url
    www_url     = make_url 'www'

    # check that bare urls work
    goto non_www_url
    assert_equal @b.url,     non_www_url
    assert_equal @b.h1.text, www_url
    assert @b.text['Redirecting in']

    # check that clicking on url goes to right page
    @b.h1.click
    assert_equal @b.url,www_url

    # Check that the countdown is happening and that the browser does redirect
    goto non_www_url
    @b.wait_until { @b.span(:id, 'countdown').text['2'] }
    @b.wait_until { @b.span(:id, 'countdown').text['1'] }
    @b.wait_until { @b.url == www_url }

    # check that queries and paths get stripped
    goto "#{non_www_url}foo/bar?baz=bundy"
    assert_equal @b.url,     "#{non_www_url}foo/bar?baz=bundy"
    assert_equal @b.h1.text, www_url
    assert @b.text['Redirecting in']

    # check that the link to the domain detail page is correct
    assert @b.link(:id, 'domain_status').href, "#{@test_sales_site}domain/127.0.0.1.xip.io"
    
  end

end
