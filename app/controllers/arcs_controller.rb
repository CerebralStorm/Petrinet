class ArcsController < ApplicationController
  def create
    @arc = Arc.create!(params[:arc])
    render nothing: true
  end

  def destroy
  end
end
