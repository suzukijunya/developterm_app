class Tenant < ApplicationRecord
  validates :name, presence: true, length: {maximum: 30}
  validates :email, presence: true, uniqueness: true, format: { with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i }
  validates :password, presence: true, format: {with: /\A(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,32}+\z/i}

  has_secure_password
  has_many :accidents
  mount_uploader :image, ImageUploader
end
