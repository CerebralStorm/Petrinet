class CreateArcs < ActiveRecord::Migration
  def change
    create_table :arcs do |t|
      t.integer :weight, default: 0;
      t.integer :place_id
      t.integer :transition_id
      t.integer :petri_net_id
      t.float :time
      t.integer :beginX
      t.integer :beginY
      t.integer :endX
      t.integer :endY

      t.timestamps
    end
  end
end
