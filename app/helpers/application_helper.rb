module ApplicationHelper

  def current_repair_shop
    if session[:repair_shop_id]
    @current_repair_shop ||= RepairShop.find_by(id: session[:repair_shop_id])
    end
  end

  def repair_shop_logged_in?
    !current_repair_shop.nil?
  end


  def current_tenant
    if session[:tenant_id]
    @current_tenant ||= Tenant.find_by(id: session[:tenant_id])
    end
  end

  def tenant_logged_in?
    !current_tenant.nil?
  end

  def full_title(page_title = '')
    base_title = "リペくる"
    if page_title.empty?
      base_title
    else
      page_title + " | " + base_title
    end
  end
end
