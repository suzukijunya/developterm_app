module RepairShopsSessionsHelper

  # リペアショップのセッションを永続的にする
  def repair_shop_remember(repair_shop)
    repair_shop.remember
    cookies.permanent.signed[:repair_shop_id] = repair_shop.id
    cookies.permanent[:remember_token] = repair_shop.remember_token
  end

end
