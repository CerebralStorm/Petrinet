class Place < ActiveRecord::Base
  #attr_accessible 
  has_many :tokens
end
