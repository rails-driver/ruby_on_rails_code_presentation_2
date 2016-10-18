require 'rails_helper'

describe MapsController do
  describe 'GET index' do
    let!(:map) { create :map }

    it 'assigns @maps and a new @map, then renders the index template' do
      get :index

      expect(assigns(:maps)).to eq [map]
      expect(assigns(:map)).to be_a_new Map
      expect(response).to render_template :index
    end
  end

  describe 'POST create' do
    context 'with valid attributes' do
      it 'creates a new @map' do
        expect do
          post :create, params: { map: attributes_for(:map) }
        end.to change(Map, :count).by 1
      end

      it 'if there is a parameter "show" then redirects to the new map' do
        post :create, params: { map: attributes_for(:map), show: 'show' }
        expect(response).to redirect_to action: :show, id: assigns(:map)
      end

      it 'if no parameter "show" then assigns a new @map and flash success message, ' \
         'then renders the index template' do
        post :create, params: { map: attributes_for(:map) }

        expect(assigns(:map)).to be_a_new Map
        expect(flash[:success]).to eq 'Map was created successfully'
        expect(response).to render_template :index
      end
    end

    context 'with invalid attributes' do
      it 'does not save the new map, assigns flash error message and then renders the index template' do
        expect do
          post :create, params: { map: attributes_for(:map).merge(name: nil) }

          expect(flash[:error]).to eq 'Map was not created'
          expect(response).to render_template :index
        end.to change(Map, :count).by 0
      end
    end
  end

  describe 'GET show' do
    let!(:map) { create :map }

    it 'assigns @map and @locations, then renders the show template' do
      location = create :location, map: map

      get :show, params: { id: map.id }

      expect(assigns(:map)).to eq map
      expect(assigns(:locations)).to eq [location]
      expect(response).to render_template :show
    end
  end

  describe 'GET edit' do
    let!(:map) { create :map }

    it 'assigns @maps and @map' do
      get :edit, params: { id: map.id }
      expect(assigns(:maps)).to eq [map]
      expect(assigns(:map)).to eq map
    end

    it 'if format "html" then renders the index template' do
      get :edit, params: { id: map.id }
      expect(response).to render_template :index
    end

    it 'if format "js" then renders the edit template' do
      get :edit, xhr: true, format: :js, params: { id: map.id }
      expect(response).to render_template :edit
    end
  end

  describe 'PUT update' do
    let!(:map) { create :map }

    context 'with valid attributes' do
      it 'updates @map, assigns @maps, assigns new @map and flash success message, ' \
         'then redirects to the index' do
        new_name = 'Test'

        get :update, params: { id: map.id, map: attributes_for(:map).merge(name: new_name) }

        expect(map.reload.name).to eq new_name
        expect(assigns(:maps)).to eq [map]
        expect(assigns(:map)).to be_a_new Map
        expect(flash[:success]).to eq 'Map was updated successfully'
        expect(response).to redirect_to action: :index
      end
    end

    context 'with invalid attributes' do
      it 'does not update @map, assigns @maps and flash error message, then redirects to the index' do
        get :update, params: { id: map.id, map: attributes_for(:map).merge(name: '') }

        expect(map.reload.name).not_to eq ''
        expect(assigns(:maps)).to eq [map]
        expect(assigns(:map)).to eq map
        expect(flash[:error]).to eq 'Map was not updated'
        expect(response).to redirect_to action: :index
      end
    end
  end

  describe 'DELETE destroy' do
    let!(:map) { create :map }

    it 'destroys @map, assigns @maps, assigns new @map and flash success message, ' \
       'then renders the destroy template' do
      expect do
        delete :destroy, xhr: true, format: :js, params: { id: map.id }

        expect(assigns(:map)).to be_a_new Map
        expect(flash[:success]).to eq 'Map was removed successfully'
        expect(response).to render_template :destroy
      end.to change(Map, :count).by(-1)
    end
  end
end
