class EstimatesController < ApplicationController
  before_action :set_estimate, only: [:show, :edit, :update, :destroy]

  def new
    @shop_accident = ShopAccident.new
    @repair_shops = RepairShop.all
    @accidents = Accident.all
  end

  def create
    @shop_accident = ShopAccident.new(a_params)
    @shop_accident.save
    redirect_to estimate_new_path
  end

  private
  def a_params
    params.require(:shop_accident).permit(:name,:repair_shop_id,:accident_id)
  end
end
