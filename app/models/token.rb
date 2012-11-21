class Token < ActiveRecord::Base
  attr_accessible :time

  validates :place_id, presence: true

  belongs_to :place
end
