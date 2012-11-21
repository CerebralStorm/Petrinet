class TokensController < ApplicationController
  def create
    @place = Place.find(params[:id])
    @place.tokens.create!
    render nothing: true
  end

  def destroy
  end
end
