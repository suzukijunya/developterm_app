module ApplicationHelper
  def current_repair_shop
    @current_repair_shop ||= RepairShop.find_by(id: session[:repair_shop_id])
  end

  def repair_shop_logged_in?
    !current_repair_shop.nil?
  end
end
