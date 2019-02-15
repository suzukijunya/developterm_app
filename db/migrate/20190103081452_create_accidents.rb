class CreateAccidents < ActiveRecord::Migration[5.1]
  def change
    create_table :accidents do |t|
      t.string :case
      t.datetime :time
      t.string :address
      t.text :content
      t.datetime :repair_request_schedule
      t.string :image

      t.timestamps
    end
  end
end
