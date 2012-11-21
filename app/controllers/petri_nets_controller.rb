class PetriNetsController < ApplicationController
  def index
    @petri_nets = PetriNet.all
  end

  def show
    @petri_net = PetriNet.find(params[:id])
    gon.places = @petri_net.places
    gon.tokens = 
    gon.arcs = @petri_net.arcs
    gon.transitions = @petri_net.transitions
  end

  def edit
    @petri_net = PetriNet.find(params[:id])
  end

  def create
    @petri_net = PetriNet.create(params[:petri_net])
    if @petri_net.save
      flash[:success] = "Petri Net Created"
      redirect_to @petri_net
    else
      flash[:failure] = "Error"
      redirect_to :back
    end
  end

  def destroy
    if @petri_net = PetriNet.find(params[:id]).destroy
      flash[:success] = "Petri Net Deleted"
    else
      flash[:failure] = "Error"
    end
  end
end
