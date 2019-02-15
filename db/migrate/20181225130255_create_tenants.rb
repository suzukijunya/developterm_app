class CreateTenants < ActiveRecord::Migration[5.1]
  def change
    create_table :tenants do |t|
      t.string :name
      t.string :email
      t.string :phone_number
      t.string :password_digest
      



      t.timestamps
    end
  end
end
