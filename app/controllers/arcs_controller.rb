class ArcsController < ApplicationController
  def create
    @arc = Arc.create!(params[:arc])
    render nothing: true
  end

  def update
    @arc = Arc.find(params[:id])
    @arc.update_attributes!(params[:arc])
    render nothing: true
  end

  def destroy
  end
end
