class CreateArcs < ActiveRecord::Migration
  def change
    create_table :arcs do |t|
      t.integer :weight, default: 0;
      t.float :time

      t.timestamps
    end
  end
end
