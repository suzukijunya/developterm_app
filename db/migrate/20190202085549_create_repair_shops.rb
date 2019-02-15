class CreateRepairShops < ActiveRecord::Migration[5.1]
  def change
    create_table :repair_shops do |t|
      t.string :name
      t.string :mail
      t.string :address
      t.string :phone_number
      t.string :password_digest



      t.timestamps
    end
  end
end
