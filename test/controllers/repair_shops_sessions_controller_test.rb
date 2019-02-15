require 'test_helper'

class RepairShopsSessionsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get repair_shops_sessions_new_url
    assert_response :success
  end

end
