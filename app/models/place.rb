class Place < ActiveRecord::Base
  attr_accessible :x, :y, :petri_net_id
  has_many :tokens, dependent: :destroy

  validates :petri_net_id, presence: true
  validates :x, presence: true
  validates :y, presence: true

  belongs_to :petri_net

end
