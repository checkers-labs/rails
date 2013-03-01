class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
        t.boolean :accepted 
        t.integer :lastMove
        t.boolean :whoDidLastMove
      t.timestamps
    end
  end
end
