class Transition < ActiveRecord::Base
  attr_accessible :time
  belongs_to :petri_net
end
