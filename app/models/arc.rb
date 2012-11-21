class Arc < ActiveRecord::Base
  attr_accessible :weight, :time, :beginX, :beginY, :endX, :endY, 
                  :place_id, :transition_id, :petri_net_id

  validates :petri_net_id, presence: true

  belongs_to :place
  belongs_to :transition
end
