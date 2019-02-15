class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  add_flash_types :success, :info, :warning, :danger

  def current_repair_shop
    @current_repair_shop ||= RepairShop.find_by(id: session[:repair_shop_id])
  end

  def repair_shop_logged_in?
    !current_repair_shop.nil?
  end

  
end
