module TenantsHelper
  def gravatar_for(tenant, size: 80)
    gravatar_id = Digest::MD5::hexdigest(tenant.email.downcase)
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?s=#{size}"
    image_tag(gravatar_url, alt: tenant.name, class: "gravatar")
  end
end
