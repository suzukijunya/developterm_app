class CreateShopAccidents < ActiveRecord::Migration[5.1]
  def change
    create_table :shop_accidents do |t|
      t.references :repair_shop, foreign_key: true
      t.references :accident, foreign_key: true
      t.string :name
      t.string :content
      t.datetime :time
      t.integer :cost
      t.datetime :repair_fix_schedule

      t.timestamps
    end
  end
end
