class LocationsController < ApplicationController
  before_action :find_location, only: %i(update destroy)

  def create
    @location = map_locations.new(location_params)

    if @location.save
      render json: @location
    else
      render json: @location.errors, status: :unprocessable_entity
    end
  end

  def update
    if @location.update(location_params)
      render json: @location
    else
      render json: @location.errors, status: :unprocessable_entity
    end
  end
  
  def destroy
    @location.destroy
    head :no_content
  end

  private

  def map_locations
    Map.find(params[:map_id]).locations
  end

  def find_location
    @location = map_locations.find(params[:id])
  end

  def location_params
    params.require(:location).permit(:name, :address)
  end
end
