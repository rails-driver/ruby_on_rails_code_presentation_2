require 'rails_helper'

describe Location do
  let(:location) { create :location }

  it '#lat returns latitude' do
    expect(location.lat).to eq location.latitude
  end
  it '#lng returns latitude' do
    expect(location.lng).to eq location.longitude
  end

  it { should belong_to :map }

  it { should validate_presence_of :name }
  it { should validate_presence_of :address }
  it { should validate_presence_of :latitude }
  it { should validate_presence_of :longitude }

  it 'after creating must have #latitude and #longitude' do
    location = create :location, latitude: nil, longitude: nil

    expect(location.latitude).not_to be_nil
    expect(location.longitude).not_to be_nil
  end

  it '#coordinates returns hash with #latitude and #longitude' do
    expect(location.coordinates).to eq({ lat: location.latitude, lng: location.longitude })
  end
end
