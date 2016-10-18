require 'rails_helper'

describe LocationsController do
  let!(:map) { create :map }

  describe 'POST create' do
    context 'with valid attributes' do
      it 'creates a new @location and then responds with JSON' do
        expect do
          post :create, params: { map_id: map.id, location: attributes_for(:location) }

          expect(response.body).to eq map.locations.last.to_json
        end.to change(Location, :count).by 1
      end
    end

    context 'with invalid attributes' do
      it 'does not save a new @location and then responds @location errors with JSON ' \
         'and with http status "422" (Unprocessable entity)' do
        expect do
          post :create, params: { map_id: map.id, location: attributes_for(:location).merge(name: '') }

          expect(response.body).to eq "{\"name\":[\"can't be blank\"]}"
          expect(response).to have_http_status 422
        end.to change(Location, :count).by 0
      end
    end
  end

  describe 'PUT update' do
    let!(:location) { create :location, map: map }

    context 'with valid attributes' do
      it 'updates @location and then responds with JSON' do
        new_name = 'New Name'

        put :update, params: {
          map_id: map.id,
          id: location.id,
          location: attributes_for(:location).merge(name: new_name)
        }

        expect(location.reload.name).to eq new_name
        expect(response.body).to match "\"map_id\":#{map.id},\"id\":#{location.id},\"name\":\"#{new_name}\""
      end
    end

    context 'with invalid attributes' do
      it 'does not update @location and then responds @location errors with JSON ' \
         'and with http status "422" (Unprocessable entity)' do
        put :update, params: {
          map_id: map.id,
          id: location.id,
          location: attributes_for(:location).merge(name: '')
        }

        expect(response.body).to eq "{\"name\":[\"can't be blank\"]}"
        expect(response).to have_http_status 422
      end
    end
  end

  describe 'DELETE destroy' do
    let!(:location) { create :location, map: map }

    it 'destroys @map and then responds with http status "204" (No content)' do
      expect do
        delete :destroy, params: {
          map_id: map.id,
          id: location.id
        }

        expect(response).to have_http_status 204
      end.to change(Location, :count).by(-1)
    end
  end
end
