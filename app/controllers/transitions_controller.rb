class TransitionsController < ApplicationController
  def create
    @transition = Transition.create!(params[:transition])
    render nothing: true
  end

  def update
    @transition = Transition.find(params[:id])
    @transition.update_attributes!(params[:transition])
    @transition.arcs.each do |arc|  
      arc.endX = params[:transition][:x]
      arc.endY = params[:transition][:y]
      arc.save
    end
    render nothing: true
  end

  def destroy
  end
end
