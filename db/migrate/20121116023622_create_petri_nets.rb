class CreatePetriNets < ActiveRecord::Migration
  def change
    create_table :petri_nets do |t|

      t.timestamps
    end
  end
end
