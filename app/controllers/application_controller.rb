class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  add_flash_types :success, :info, :warning, :danger

  # =====================<ここからテナント>=============================

  # 渡されたユーザーでログインする
  def log_in(tenant)
    session[:tenant_id] = tenant.id
  end

  # テナントのセッションを永続的にする
  def remember(tenant)
    tenant.remember
    cookies.permanent.signed[:tenant_id] = tenant.id
    cookies.permanent[:remember_token] = tenant.remember_token
  end

  # 記憶トークンcookieに対応するリペアショップを返す
  def current_tenant
    if (tenant_id = session[:tenant_id])
      @current_tenant ||= Tenant.find_by(id: session[:tenant_id])
    elsif (tenant_id = cookies.signed[:tenant_id])
      tenant = Tenant.find_by(id: tenant_id)
      if tenant && tenant.authenticated?(cookies[:remember_token])
        log_in tenant
        @current_tenant
      end
    end
  end



  # ユーザーがログインしていればtrue、その他ならfalseを返す
  def tenant_logged_in?
    !current_tenant.nil?
  end

  def tenant_params
    params.require(:tenant).permit(:email, :password_digest)
  end

  # 現在のユーザーをログアウトする
  def log_out
    session(:tenant_id)
    @current_tenant = nil
  end

  # =====================<ここからリペアショップ>=============================

  def login(repair_shop)
    session[:repair_shop_id] = repair_shop.id
  end

  # 記憶トークンcookieに対応するリペアショップを返す
  def current_repair_shop
    if (repair_shop_id = session[:repair_shop_id])
      @current_repair_shop ||= RepairShop.find_by(id: session[:repair_shop_id])
    elsif (repair_shop_id = cookies.signed[:repair_shop_id])
      repair_shop = RepairShop.find_by(id: repair_shop_id)
      if repair_shop && repair_shop.authenticated?(cookies[:remember_token])
        login repair_shop
        @current_repair_shop
      end
    end
  end

  # リペアショップのセッションを永続的にする
  def remember(repair_shop)
    repair_shop.remember
    cookies.permanent.signed[:repair_shop_id] = repair_shop.id
    cookies.permanent[:remember_token] = repair_shop.remember_token
  end



  # テナントのセッションを永続的にする
  def remember(tenant)
    tenant.remember
    cookies.permanent.signed[:tenant_id] = tenant.id
    cookies.permanent[:remember_token] = tenant.remember_token
  end

  def repair_shop_logged_in?
    !current_repair_shop.nil?
  end

  # 現在ログインしているユーザーを返す (いる場合)
  def current_repair_shop
    if session[:repair_shop_id]
      @current_user ||= User.find_by(id: session[:user_id])
    end
  end

  def repair_shop_params
    params.require(:repair_shop).permit(:mail, :password_digest)
  end

  def logout
    session(:repair_shop_id)
    @current_repair_shop = nil
  end

end
