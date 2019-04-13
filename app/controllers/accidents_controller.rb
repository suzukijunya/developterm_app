class AccidentsController < ApplicationController
  before_action :set_accident, only: [:show, :edit, :update, :destroy]

  # GET /accidents
  # GET /accidents.json
  def index
    @accidents = Accident.all
    @repair_shops = RepairShop.all
    @tenants = Tenant.all
  end

  # GET /accidents/1
  # GET /accidents/1.json
  def show
  end

  # GET /accidents/new
  def new
    @accident = Accident.new
    @repair_shops = RepairShop.all
    @tenants = Tenant.all
  end

  # GET /accidents/1/edit
  def edit
  end

  # POST /accidents
  # POST /accidents.json
  def create

    @repair_shops = RepairShop.all
    @tenants = Tenant.all
    @accident = Accident.new(accident_params)

    respond_to do |format|
      if @accident.save
        format.html { redirect_to @accident, notice: '事故を登録しました' }
        format.json { render :show, status: :created, location: @accident }
      else
        format.html { render :new }
        format.json { render json: @accident.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /accidents/1
  # PATCH/PUT /accidents/1.json
  def update
    respond_to do |format|
      if @accident.update(accident_params)
        format.html { redirect_to @accident, notice: '事故内容を更新しました' }
        format.json { render :show, status: :ok, location: @accident }
      else
        format.html { render :edit }
        format.json { render json: @accident.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /accidents/1
  # DELETE /accidents/1.json
  def destroy
    @accident.destroy
    respond_to do |format|
      format.html { redirect_to accidents_url, notice: 'Accident was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_accident
      @accident = Accident.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def accident_params
      params.require(:accident).permit(:tenant_id, :repair_shop_id, :case, :time, :address, :content, :repair_request_schedule, :image)
    end

    def topic_params
      params.require(:tenant).permit()
    end
end
