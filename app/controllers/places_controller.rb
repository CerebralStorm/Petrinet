class PlacesController < ApplicationController
  def create
    @place = Place.create!(params[:place])
    render nothing: true
  end

  def update
    @place = Place.find(params[:id])
    @place.update_attributes!(params[:place])
    @place.arcs.each do |arc|  
      arc.beginX = params[:place][:x]
      arc.beginY = params[:place][:y]
      arc.save
    end
    render nothing: true
  end

  def destroy
    @place = Place.find(params[:id])
    @place.destroy
  end
end
