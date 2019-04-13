class TenantsSessionsController < ApplicationController
  def new
  end

  def create
    tparams = tenant_params
    tenant = Tenant.find_by(email: tparams[:email])
    if tenant && tenant.authenticate(tparams[:password_digest])
      log_in tenant

      # if params[:session][:remember_me] == '1'
      #   remember(tenant)
      # else
      #   forget(tenant)
      # end

      redirect_to tenants_path, success: 'ログインに成功しました'
    else
      flash.now[:danger] = 'ログインに失敗しました'
      render :new
    end
  end

  def destroy
    log_out if tenant_logged_in?
    redirect_to tenant_url, info: 'ログアウトしました'
  end

  def tenant_params
    params.require(:tenant).permit(:name, :email, :phone_number, :password , :password_digest ,:password_confirmation, :remember_me)
  end


end
