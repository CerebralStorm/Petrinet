class Token < ActiveRecord::Base
  attr_accessible :time

  belongs_to :place
end
