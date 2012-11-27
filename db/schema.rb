# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20121116023622) do

  create_table "arcs", :force => true do |t|
    t.integer  "weight",        :default => 0
    t.integer  "place_id"
    t.integer  "transition_id"
    t.integer  "petri_net_id"
    t.float    "time"
    t.integer  "placeX"
    t.integer  "placeY"
    t.integer  "transitionX"
    t.integer  "transitionY"
    t.boolean  "output",        :default => false
    t.datetime "created_at",                       :null => false
    t.datetime "updated_at",                       :null => false
  end

  create_table "petri_nets", :force => true do |t|
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "places", :force => true do |t|
    t.integer  "x"
    t.integer  "y"
    t.integer  "petri_net_id"
    t.integer  "num_of_tokens", :default => 0
    t.datetime "created_at",                   :null => false
    t.datetime "updated_at",                   :null => false
  end

  create_table "tokens", :force => true do |t|
    t.integer  "place_id"
    t.float    "time"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "transitions", :force => true do |t|
    t.float    "time"
    t.integer  "petri_net_id"
    t.integer  "x"
    t.integer  "y"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

end
