require 'test_helper'
class UsersLoginTest < ActionDispatch::IntegrationTest

  test "login with valid information followed by logout" do
    get log_in_path
    post log_in_path, params: { session: { email:    @tenant.email,
                                          password_digest: 'password' } }
    assert is_logged_in?
    assert_redirected_to @tenant
    follow_redirect!
    assert_template 'tenants/show'
    assert_select "a[href=?]", log_in_path, count: 0
    assert_select "a[href=?]", log_out_path
    assert_select "a[href=?]", tenant_path(@tenant)
    delete log_out_path
    assert_not is_logged_in?
    assert_redirected_to root_url
    follow_redirect!
    assert_select "a[href=?]", log_in_path
    assert_select "a[href=?]", log_out_path,      count: 0
    assert_select "a[href=?]", tenant_path(@tenant), count: 0
  end
end
