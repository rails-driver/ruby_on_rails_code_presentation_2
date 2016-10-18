class CreateLocations < ActiveRecord::Migration[5.0]
  def change
    create_table :locations do |t|
      t.references :map, index: true, null: false
      t.string :name, null: false
      t.string :address, null: false
      t.decimal :latitude, null: false
      t.decimal :longitude, null: false

      t.timestamps
    end
  end
end
