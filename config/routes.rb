Rails.application.routes.draw do
  root 'maps#index'

  resources :maps, except: %i(new) do
    resources :locations, only: %i(create update destroy)
  end
end
