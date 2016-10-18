class Location < ApplicationRecord
  belongs_to :map

  alias_attribute :lat, :latitude
  alias_attribute :lng, :longitude

  before_validation :set_coordinates, if: :address?

  validates_presence_of :name, :address, :latitude, :longitude

  def coordinates
    { lat: lat, lng: lng }
  end

  private

  def set_coordinates
    coordinates = Geocoder.coordinates(address)
    self.lat, self.lng = coordinates if coordinates.present?
  end
end
