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
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20190211081303) do

  create_table "accidents", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "case"
    t.datetime "time"
    t.string "address"
    t.text "content"
    t.datetime "repair_request_schedule"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "image"
    t.integer "tenant_id"
    t.integer "repair_shop_id"
  end

  create_table "repair_shops", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.string "mail"
    t.string "address"
    t.string "phone_number"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "shop_accidents", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.bigint "repair_shop_id"
    t.bigint "accident_id"
    t.string "name"
    t.string "content"
    t.datetime "time"
    t.integer "cost"
    t.datetime "repair_fix_schedule"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["accident_id"], name: "index_shop_accidents_on_accident_id"
    t.index ["repair_shop_id"], name: "index_shop_accidents_on_repair_shop_id"
  end

  create_table "tenants", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.string "email"
    t.string "phone_number"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "shop_accidents", "accidents"
  add_foreign_key "shop_accidents", "repair_shops"
end
