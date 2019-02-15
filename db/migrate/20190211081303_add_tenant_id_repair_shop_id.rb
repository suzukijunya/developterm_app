class AddTenantIdRepairShopId < ActiveRecord::Migration[5.1]
  def change
    add_column :accidents, :tenant_id, :integer

    add_column :accidents, :repair_shop_id, :integer
  end
end
