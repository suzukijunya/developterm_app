class AddRemmenberDigest < ActiveRecord::Migration[5.1]
  def change
    add_column :tenants, :remember_digest, :string

    add_column :repair_shops, :remember_digest, :string
  end
end
