class ArcsController < ApplicationController
  def create
    @arc = Arc.create!(params[:arc])
    render json: @arc
  end

  def destroy
    @arc = Arc.find(params[:id])
    @arc.destroy
    render nothing: true
  end
end
