module RepairShopsHelper
  def gravatar_for(repair_shop)
    gravatar_id = Digest::MD5::hexdigest(repair_shop.email.downcase)
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}"
    image_tag(gravatar_url, alt: repair_shop.name, class: "gravatar")
  end
end
