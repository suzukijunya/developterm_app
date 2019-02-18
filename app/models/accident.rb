class Accident < ApplicationRecord


  belongs_to :tenant
  belongs_to :repair_shop
  belongs_to :repair

end
