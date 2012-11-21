class CreateTokens < ActiveRecord::Migration
  def change
    create_table :tokens do |t|
      t.integer :place_id
      t.float :time
      t.integer :x
      t.integer :y

      t.timestamps
    end
  end
end
