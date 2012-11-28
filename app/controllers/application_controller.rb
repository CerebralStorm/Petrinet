class ApplicationController < ActionController::Base
  protect_from_forgery

  def set_gon(petri_net)
    gon.places = petri_net.places
    gon.arcs = petri_net.arcs
    gon.transitions = petri_net.transitions
  end
end
