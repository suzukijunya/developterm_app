class Repair < ApplicationRecord

  belongs_to :accident

  CATEGORY = {
    rainfall:    "雨漏り",
    waterleak:  "水漏れ",
    electrical: "電気",
    cleaning: "クリーニング",
    commonareas:  "共用部",
    rent:    "支払関係",
    another:    "その他",
  }.with_indifferent_access.freeze

  STATUS = {
    complete:    "修繕完了",
    repairing:  "修繕中",
    not_started: "未着手",

  }.with_indifferent_access.freeze

end
