class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  add_flash_types :success, :info, :warning, :danger

  def current_repair_shop
    if (repair_shop_id = session[:repair_shop_id])
      @current_repair_shop ||= RepairShop.find_by(id: session[:repair_shop_id])
    end
  end

  # 記憶トークンcookieに対応するユーザーを返す
  def current_user
    if (user_id = session[:user_id])
      @current_user ||= User.find_by(id: user_id)
    elsif (user_id = cookies.signed[:user_id])
      user = User.find_by(id: user_id)
      if user && user.authenticated?(cookies[:remember_token])
        log_in user
        @current_user = user
      end
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


end
