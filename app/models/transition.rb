class Transition < ActiveRecord::Base
  attr_accessible :time, :petri_net_id, :x, :y

  validates :petri_net_id, presence: true
  
  belongs_to :petri_net
  has_many :arcs
  has_many :places, through: :arcs
end
