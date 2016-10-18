require 'rails_helper'

feature 'MapPage', js: true do
  let!(:map) { create :map }

  before do
    visit "maps/#{map.id}"
  end

  def create_location
    fill_in 'location_name', with: 'Home'
    fill_in 'location_address', with: 'New-York'
    click_button 'Create location'
  end

  it 'google map present' do
    within '.js-map' do
      expect(page).to have_css '.gm-style'
    end
  end

  it 'prevent sending blank form' do
    fill_in 'location_name', with: ''
    fill_in 'location_address', with: ''

    expect(page).to have_button('Create location', disabled: true)
  end

  it 'no locations table if no locations' do
    expect(page).not_to have_css '#locations-table'

    create_location

    within '#locations-table' do
      expect(page).to have_css 'table.locations-table'
    end
  end

  it 'adding new location to table' do
    create_location

    expect(page).to have_selector 'tr', count: 2
    expect(page).to have_selector 'a', text: 'Edit'
    expect(page).to have_selector 'a', text: 'Delete'
  end

  it 'editing location' do
    create_location

    find('a', text: 'Edit').click
    location_id = map.locations.last.id
    fill_in "#{location_id}-location_name", with: 'Fathers'
    fill_in "#{location_id}-location_address", with: 'Los Angeles'
    find('a', text: 'Update').click

    expect(page).to have_selector 'td', text: 'Fathers'
    expect(page).to have_selector 'td', text: 'Los Angeles'
  end

  it 'removing location from table' do
    create_location

    find('a', text: 'Delete').click

    expect(page).not_to have_css '#locations-table'
  end
end
