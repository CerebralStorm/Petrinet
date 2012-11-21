class PlacesController < ApplicationController
  def create
    @place = Place.create!(params[:place])
    render json: @place.to_json
  end

  def update
    @place = Place.find(params[:id])
    @place.update_attributes!(params[:place])
    render nothing: true
  end

  def destroy
    @place = Place.find(params[:id])
    @place.destroy
  end
end
