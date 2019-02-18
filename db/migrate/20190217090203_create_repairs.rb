class CreateRepairs < ActiveRecord::Migration[5.1]
  def change
    create_table :repairs do |t|
      t.references :estimate, foreign_key: true
      t.string :case
      t.datetime :time
      t.string :content
      t.boolean :complete
      t.string :status

      t.timestamps
    end
  end
end
