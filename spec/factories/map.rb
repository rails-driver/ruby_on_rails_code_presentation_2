FactoryGirl.define do
  factory :map do
    name Faker::Name.name
    location Faker::Address.country
    latitude Faker::Address.latitude
    longitude Faker::Address.longitude
  end
end
