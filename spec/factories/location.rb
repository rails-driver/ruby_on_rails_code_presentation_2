FactoryGirl.define do
  factory :location do
    map
    name Faker::Name.name
    address Faker::Address.country
    latitude Faker::Address.latitude
    longitude Faker::Address.longitude
  end
end
