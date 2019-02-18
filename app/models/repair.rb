class Repair < ApplicationRecord

  belongs_to :accident
  
  CATEGORY = {
    food:    "食費",
    dining:  "外食費",
    another: "雑費",
    utility: "光熱費",
    travel:  "旅費",
    home:    "家賃",
  }.with_indifferent_access.freeze
end
