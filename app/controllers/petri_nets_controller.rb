class PetriNetsController < ApplicationController
  def index
    @petri_nets = PetriNet.all
  end

  def show
    @petri_net = PetriNet.find(params[:id])
    set_gon(@petri_net)
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

  def update
    @petri_net = PetriNet.find(params[:id])
    @transition = Transition.find(params[:transition_id])
    if(@transition.enabled)
      @transition.inputs.each do |input|
        input.place.remove_token
      end
      @transition.outputs.each do |output|
        output.place.add_token
      end
    end
    render nothing: true
  end

  def destroy
    if @petri_net = PetriNet.find(params[:id]).destroy
      flash[:success] = "Petri Net Deleted"
    else
      flash[:failure] = "Error"
    end
  end
end
