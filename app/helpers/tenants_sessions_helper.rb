module TenantsSessionsHelper

  # テナントのセッションを永続的にする
  def tenant_remember(tenant)
    tenant.remember
    cookies.permanent.signed[:tenant_id] = tenant.id
    cookies.permanent[:remember_token] = tenant.remember_token
  end
end
