class CreateTransitions < ActiveRecord::Migration
  def change
    create_table :transitions do |t|
      t.float :time
      t.integer :petri_net_id
      t.integer :x
      t.integer :y

      t.timestamps
    end
  end
end
