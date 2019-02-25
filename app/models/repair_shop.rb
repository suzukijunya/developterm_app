class RepairShop < ApplicationRecord
  attr_accessor :remenber_token
  validates :name, presence: true, length: {maximum: 15}
  validates :mail, presence: true, uniqueness: true, format: { with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i }
  validates :password, presence: true, format: {with: /\A(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,32}+\z/i}

  has_secure_password
  has_many :accidents

  # 渡された文字列のハッシュ値を返す
  def  RepairShop.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                  BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end

  # ランダムなトークンを返す
  def Repair.new_token
    SecureRandom.urlsafe_base64
  end

  # 永続セッションのためにユーザーをデータベースに記憶する
 def repair_shop_remember
   self.remember_token = RepairShop.new_token
   update_attribute(:remember_digest, RepairShop.digest(remember_token))
 end

 # 渡されたトークンがダイジェストと一致したらtrueを返す
 def authenticated?(remember_token)
   BCrypt::Password.new(remember_digest).is_password?(remember_token)
 end

end
