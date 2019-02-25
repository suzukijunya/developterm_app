class RepairShopsSessionsController < ApplicationController
  def new
  end

  def create
    rsparams = repair_shop_params
    repair_shop = RepairShop.find_by(mail: rsparams[:mail])
    if repair_shop && repair_shop.authenticate(rsparams[:password_digest])
      login repair_shop
      # remenber_of_repair_shop repair_shop
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

end
