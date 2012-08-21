require 'watir_test_case'
require 'pry'

class SalesSite < WatirTestCase


  def test_404_page
    bad_url = make_url( 'www') + 'does/not/exist'
    goto bad_url
    assert_equal @b.url, bad_url
    assert_equal @b.title, '404 :: add-www.com'
  end


end
