class Transition < ActiveRecord::Base
  attr_accessible :time, :petri_net_id, :x, :y

  validates :petri_net_id, presence: true
  
  belongs_to :petri_net
  has_many :arcs
  has_many :places, through: :arcs

  def inputs 
    inputs = self.arcs.where("output = false")
  end

  def outputs
    outputs = self.arcs.where("output = true")  
  end

  def enabled
    result = true
    inputs.each do |input|
      if input.place.num_of_tokens == 0
        result = false
      end
    end
    return result
  end
end
