class Token < ActiveRecord::Base
  attr_accessible :time, :place_id

  validates :place_id, presence: true

  belongs_to :place
end
