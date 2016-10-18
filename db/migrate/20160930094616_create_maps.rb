class CreateMaps < ActiveRecord::Migration[5.0]
  def change
    create_table :maps do |t|
      t.string :name, null: false
      t.string :location, null: false
      t.decimal :latitude, null: false
      t.decimal :longitude, null: false

      t.timestamps
    end
  end
end
