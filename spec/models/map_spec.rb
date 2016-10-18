require 'rails_helper'

describe Map do
  let!(:map) { create :map }

  it '#lat returns latitude' do
    expect(map.lat).to eq map.latitude
  end
  it '#lng returns latitude' do
    expect(map.lng).to eq map.longitude
  end

  it { should have_many :locations }

  it { should validate_presence_of :name }
  it { should validate_presence_of :location }
  it { should validate_presence_of :latitude }
  it { should validate_presence_of :longitude }

  it { should validate_uniqueness_of :name }

  it 'after creating must have #latitude and #longitude' do
    map = create :map, name: 'Test', latitude: nil, longitude: nil

    expect(map.latitude).not_to be_nil
    expect(map.longitude).not_to be_nil
  end

  it '#coordinates returns hash with #latitude and #longitude' do
    expect(map.coordinates).to eq({ lat: map.latitude, lng: map.longitude })
  end
end
