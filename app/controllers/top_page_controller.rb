class TopPageController < ApplicationController
  def new
  end

  def create
  end

  def destroy
  end

  def login(repair_shop)
    session[:repair_shop_id] = repair_shop.id
  end
end
