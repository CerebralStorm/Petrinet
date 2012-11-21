class TransitionsController < ApplicationController
  def create
    @transition = Transition.create!(params[:transition])
  end

  def update
    @transition = Transition.update_attributes!(params[:transition])
  end

  def destroy
  end
end
