class RepairShopsSessionsController < ApplicationController
  def new
  end

  def create
    rsparams = repair_shop_params
    repair_shop = RepairShop.find_by(mail: rsparams[:mail])
    if repair_shop && repair_shop.authenticate(rsparams[:password_digest])
      login repair_shop

      

      # if params[:session][:remember_me] == '1'
      #   remember(repair_shop)
      # else
      #   forget(repair_shop)
      # end

      # remenber_of_repair_shop repair_shop
      redirect_to repair_shops_path, success: 'ログインに成功しました'
    else
      flash.now[:danger] = 'ログインに失敗しました'
      render :new
    end
  end

  def destroy
    logout if repair_shop_logged_in?
    redirect_to repair_shops_path, info: 'ログアウトしました'
  end

end
