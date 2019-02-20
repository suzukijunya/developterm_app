class AddTenantIdRepairShopId < ActiveRecord::Migration[5.1]
  def change
    add_column :accidents, :tenant_id, :bigint, :null => false

    add_column :accidents, :repair_shop_id, :bigint, :null => false
  end
end
