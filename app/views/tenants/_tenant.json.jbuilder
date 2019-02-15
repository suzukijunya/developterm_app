json.extract! tenant, :id, :name, :email, :phone_number, :password, :password_confirmation, :created_at, :updated_at
json.url tenant_url(tenant, format: :json)
