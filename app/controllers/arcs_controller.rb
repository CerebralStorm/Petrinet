class ArcsController < ApplicationController
  def create
    @arc = Arc.create!(params[:arc])
    render nothing: true
  end

  def update
    @arc = Arc.find(params[:id])
    @arc.update_attributes!(params[:arc])
    if params[:arc][:transition_id]
      @arc.id = params[:arc][:transition_id]
      @arc.save
    end
    render nothing: true
  end

  def destroy
  end
end
