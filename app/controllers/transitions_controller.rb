class TransitionsController < ApplicationController
  def create
    @transition = Transition.create!(params[:transition])
    render nothing: true
  end

  def update
    @transition = Transition.find(params[:id])
    @transition.update_attributes!(params[:transition])
    @transition.arcs.each do |arc|  
      arc.transitionX = params[:transition][:x]
      arc.transitionY = params[:transition][:y]
      arc.save
    end
    render nothing: true
  end

  def destroy
  end
end
