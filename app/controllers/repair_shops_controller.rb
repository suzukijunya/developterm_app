class RepairShopsController < ApplicationController
  before_action :set_repair_shop, only: [:show, :edit, :update, :destroy]

  # GET /repair_shops
  # GET /repair_shops.json
  def index
    @repair_shops = RepairShop.all
  end

  # GET /repair_shops/1
  # GET /repair_shops/1.json
  def show
  end

  # GET /repair_shops/new
  def new
    @repair_shop = RepairShop.new
  end

  # GET /repair_shops/1/edit
  def edit
  end

  # POST /repair_shops
  # POST /repair_shops.json
  def create
    @repair_shop = RepairShop.new(repair_shop_params)

    respond_to do |format|
      if @repair_shop.save
        login @repair_shop
        format.html { redirect_to @repair_shop, success: '登録が完了しました'}
        format.json { render :show, status: :created, location: @repair_shop }
      else
        flash.now[:danger] = "登録に失敗しました"
        format.html { render :new }
        format.json { render json: @repair_shop.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /repair_shops/1
  # PATCH/PUT /repair_shops/1.json
  def update
    respond_to do |format|
      if @repair_shop.update(repair_shop_params)
        format.html { redirect_to @repair_shop, notice: 'Repair shop was successfully updated.' }
        format.json { render :show, status: :ok, location: @repair_shop }
      else
        format.html { render :edit }
        format.json { render json: @repair_shop.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /repair_shops/1
  # DELETE /repair_shops/1.json
  def destroy
    @repair_shop.destroy
    respond_to do |format|
      format.html { redirect_to repair_shops_url, notice: 'Repair shop was successfully destroyed.' }
      format.json { head :no_content }
    end
  end



  private
    # Use callbacks to share common setup or constraints between actions.
    def set_repair_shop
      @repair_shop = RepairShop.find(params[:id])
    end


    # Never trust parameters from the scary internet, only allow the white list through.
    def repair_shop_params
      params.require(:repair_shop).permit(:name, :mail, :address, :phone_number, :password, :password_confirmation)
    end

end
