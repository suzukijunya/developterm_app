module RepairShopsHelper
  def gravatar_for(repair_shop, size: 80)
    gravatar_id = Digest::MD5::hexdigest(repair_shop.mail.downcase)
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?s=#{size}"
    image_tag(gravatar_url, alt: repair_shop.name, class: "gravatar")
  end
end
