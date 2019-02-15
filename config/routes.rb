Rails.application.routes.draw do
  get 'repair_shops_sessions/new'
  get    '/login',   to: 'repair_shops_sessions#new'
  post   '/login',   to: 'repair_shops_sessions#create'
  delete '/logout',  to: 'repair_shops_sessions#destroy'

  get 'tenants_sessions/new'
  get    '/log_in',   to: 'tenants_sessions#new'
  post   '/log_in',   to: 'tenants_sessions#create'
  delete '/log_out',  to: 'tenants_sessions#destroy'

  get 'accidents/new'

  resources :repair_shops
  resources :accidents
  resources :tenants
  resources :estimates
  post '/' => 'estimates#new'

  get '/home', to: 'top_page#home'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
