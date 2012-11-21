class ArcsController < ApplicationController
  def create
    @arc = Arc.create!(params[:arc])
  end

  def update
    @arc = Arc.update_attributes!(params[:arc])
  end

  def destroy
  end
end
