require 'test_helper'

class RepairShopsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @repair_shop = repair_shops(:one)
  end

  test "should get index" do
    get repair_shops_url
    assert_response :success
  end

  test "should get new" do
    get new_repair_shop_url
    assert_response :success
  end

  test "should create repair_shop" do
    assert_difference('RepairShop.count') do
      post repair_shops_url, params: { repair_shop: { address: @repair_shop.address, mail: @repair_shop.mail, name: @repair_shop.name, password: @repair_shop.password, phone_number: @repair_shop.phone_number } }
    end

    assert_redirected_to repair_shop_url(RepairShop.last)
  end

  test "should show repair_shop" do
    get repair_shop_url(@repair_shop)
    assert_response :success
  end

  test "should get edit" do
    get edit_repair_shop_url(@repair_shop)
    assert_response :success
  end

  test "should update repair_shop" do
    patch repair_shop_url(@repair_shop), params: { repair_shop: { address: @repair_shop.address, mail: @repair_shop.mail, name: @repair_shop.name, password: @repair_shop.password, phone_number: @repair_shop.phone_number } }
    assert_redirected_to repair_shop_url(@repair_shop)
  end

  test "should destroy repair_shop" do
    assert_difference('RepairShop.count', -1) do
      delete repair_shop_url(@repair_shop)
    end

    assert_redirected_to repair_shops_url
  end
end
