class Arc < ActiveRecord::Base
  attr_accessible :weight, :time

  belongs_to :place
  belongs_to :transition
end
