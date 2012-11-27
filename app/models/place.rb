class Place < ActiveRecord::Base
  attr_accessible :x, :y, :petri_net_id, :num_of_tokens

  validates :petri_net_id, presence: true
  validates :x, presence: true
  validates :y, presence: true

  belongs_to :petri_net
  has_many :arcs
  has_many :transitions, through: :arcs

  def add_token
    self.num_of_tokens = 1
    self.save
  end

  def remove_token
    self.num_of_tokens = 0
    self.save
  end
end
