class PlacesController < ApplicationController
 
  def create
    @petri_net = PetriNet.find(params[:place][:petri_net_id])
    @place = Place.create!(params[:place])  
    render json: @place
  end

  def update
    @place = Place.find(params[:id])
    @place.update_attributes!(params[:place])
    @place.arcs.each do |arc|  
      arc.placeX = params[:place][:x] unless params[:place][:x].nil?
      arc.placeY = params[:place][:y] unless params[:place][:y].nil?
      arc.save
    end
    render json: @place
  end

  def destroy
    @place = Place.find(params[:id])
    @place.destroy
    render nothing: true 
  end
end
