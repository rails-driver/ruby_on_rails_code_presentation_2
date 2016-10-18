class MapsController < ApplicationController
  before_action :maps, except: %i(show)
  before_action :new_map, only: %i(index create)
  before_action :find_map, only: %i(show edit update destroy)

  def index
  end

  def create
    @map.assign_attributes(map_params)

    if @map.save
      params[:show] ? redirect_to(action: :show, id: @map) && return : success_message_and_new_map
    else
      error_message
    end

    render :index
  end

  def show
    @locations = @map.locations
  end

  def edit
    respond_to do |format|
      format.html { render :index }
      format.js { render :edit }
    end
  end

  def update
    @map.update(map_params) ? success_message_and_new_map : error_message
    redirect_to action: :index
  end

  def destroy
    @map.destroy
    success_message_and_new_map
  end

  private

  def maps
    @maps = Map.all
  end

  def new_map
    @map = Map.new
  end

  def find_map
    @map = Map.find(params[:id] || params[:map_id])
  end

  def map_params
    params.require(:map).permit(:name, :location)
  end

  def success_message_and_new_map
    new_map
    flash[:success] = t '.success'
  end

  def error_message
    flash[:error] = t '.error'
  end
end
