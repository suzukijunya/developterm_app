class TenantsSessionsController < ApplicationController
  def new
  end

  def create
    tparams = tenant_params
    tenant = Tenant.find_by(email: tparams[:email])
    if tenant && tenant.authenticate(tparams[:password_digest])
      log_in tenant
      tenant_remember tenant
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

  private
  def log_in(tenant)
    session[:tenant_id] = tenant.id
  end

  def tenant_params
    params.require(:tenant).permit(:email, :password_digest)
  end

  def log_out
    session(:tenant_id)
    @current_tenant = nil
  end
end
