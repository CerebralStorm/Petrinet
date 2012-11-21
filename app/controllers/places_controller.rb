class PlacesController < ApplicationController
  def create
    @place = Place.create!(params[:place])
  end

  def update
    @place = Place.update_attributes!(params[:place])
  end

  def destroy
  end
end
