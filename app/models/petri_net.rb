class PetriNet < ActiveRecord::Base
  #attr_accessible :title, :body
  has_many :tokens
  has_many :transitions
  has_many :arcs

end
