class PetriNet < ActiveRecord::Base
  #attr_accessible :title, :body
  #has_many :tokens, dependent: :destroy
  has_many :transitions, dependent: :destroy
  has_many :arcs, dependent: :destroy
  has_many :places, dependent: :destroy

end
