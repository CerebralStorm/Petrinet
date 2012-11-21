class CreateArcs < ActiveRecord::Migration
  def change
    create_table :arcs do |t|
      t.integer :weight, default: 0;
      t.integer :petri_net_id
      t.float :time
      t.integer :x
      t.integer :y

      t.timestamps
    end
  end
end
