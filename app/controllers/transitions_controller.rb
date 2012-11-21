class TransitionsController < ApplicationController
  def create
    @transition = Transition.create!(params[:transition])
    render nothing: true
  end

  def update
    @transition = Transition.find(params[:id])
    @transition.update_attributes!(params[:transition])
    render nothing: true
  end

  def destroy
  end
end
