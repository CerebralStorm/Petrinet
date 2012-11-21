class CreatePlaces < ActiveRecord::Migration
  def change
    create_table :places do |t|
      t.integer :x
      t.integer :y
      t.integer :petri_net_id
      t.timestamps
    end
  end
end
