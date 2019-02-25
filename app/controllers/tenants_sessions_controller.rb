class TenantsSessionsController < ApplicationController
  def new
  end

  def create
    tparams = tenant_params
    tenant = Tenant.find_by(email: tparams[:email])
    if tenant && tenant.authenticate(tparams[:password_digest])
      log_in tenant
      redirect_to tenants_path, success: 'ログインに成功しました'
    else
      flash.now[:danger] = 'ログインに失敗しました'
      render :new
    end
  end

  def destroy
    log_out
    redirect_to tenant_url, info: 'ログアウトしました'
  end

end
