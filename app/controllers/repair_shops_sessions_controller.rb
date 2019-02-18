class RepairShopsSessionsController < ApplicationController
  def new
  end

  def create
    rsparams = repair_shop_params
    repair_shop = RepairShop.find_by(mail: rsparams[:mail])
    if repair_shop && repair_shop.authenticate(rsparams[:password_digest])
      login repair_shop
      redirect_to repair_shops_path, success: 'ログインに成功しました'
    else
      flash.now[:danger] = 'ログインに失敗しました'
      render :new
    end
  end

  def destroy
    logout
    redirect_to repair_shop_url, info: 'ログアウトしました'
  end

  private
  def login(repair_shop)
    session[:repair_shop_id] = repair_shop.id
  end

  def repair_shop_params
    params.require(:repair_shop).permit(:mail, :password_digest)
  end

  def logout
    session(:repair_shop_id)
    @current_repair_shop = nil
  end
end
