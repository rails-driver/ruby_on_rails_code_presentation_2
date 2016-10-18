class Map < ApplicationRecord
  has_many :locations

  alias_attribute :lat, :latitude
  alias_attribute :lng, :longitude

  before_validation :set_coordinates, if: :location?

  validates_presence_of :name, :location, :latitude, :longitude
  validates_uniqueness_of :name

  def coordinates
    { lat: lat, lng: lng }
  end

  private

  def set_coordinates
    coordinates = Geocoder.coordinates(location)
    self.lat, self.lng = coordinates if coordinates.present?
  end
end
