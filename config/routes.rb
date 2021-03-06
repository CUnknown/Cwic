Cwic::Application.routes.draw do
  # Load routing concerns. This needs to happen before any concern is used.
  instance_eval(File.read(Rails.root.join('config/routing_concerns.rb')))

  get 'introduction/index'
  get 'home/index'
  root to: 'introduction#index'

  devise_for :users, controllers: { sessions: 'users/sessions', registrations: 'users/registrations', invitations: 'users/invitations' }

  get 'switch_organisation/:id/', controller: :application, action: :switch_organisation, as: :switch_organisation

  resources :my_users, except: [:new, :create] do
    get :edit_password, on: :member
    put :update_password, on: :member
    get :edit_email, on: :member
    put :update_email, on: :member
  end

  resources :my_organisations, except: [:new, :create]

  resources :organisations do
    post :tag_search, on: :member

    resources :organisation_users, except: :show do
      post :invite, on: :new
      post :reinvite, on: :member
    end

    resources :entity_types do
      get :audits, on: :member
      resources :entity_type_properties do
        patch :sort, on: :collection
      end
      resources :entity_images, except: :show
      resources :reservation_statuses do
        patch :sort, on: :collection
      end
      resources :reservation_periods
    end

    resources :entity_type_icons

    resources :entities do
      get :available, on: :collection
      get :audits, on: :member
      resources :entity_properties, except: [:show, :new, :create, :destroy]
      resources :documents, except: [:edit, :update]
      resources :entity_images, except: :show
      concerns :stickable
    end

    resources :reservations do
      post :multiple, on: :collection
      patch :update_status, on: :member
      get :audits, on: :member
      resources :documents, except: [:edit, :update]
      concerns :stickable
    end

    resources :organisation_clients do
      get :autocomplete, on: :collection
      get :vcard, on: :member
      get :audits, on: :member
      get :upcoming_reservations, on: :member
      get :past_reservations, on: :member
      resources :organisation_client_contacts, only: [:show, :index] do
        get :vcard, on: :member
      end
      resources :communication_records
      resources :reservations
      resources :documents, except: [:edit, :update]
      concerns :stickable
    end

    resources :info_screens do
      get :reservations, on: :member
    end

    resources :documents, only: [:index, :show, :destroy], controller: :organisation_documents

    controller :schedule_view do
      # Horizontal day calendar
      get 'schedule_view/horizontal_day'
      get 'schedule_view/horizontal_day/entity/:entity/:year/:month/:day', action: :horizontal_day, as: :schedule_view_horizontal_day_entity_date
      get 'schedule_view/horizontal_day/:year/:month/:day', action: :horizontal_day, as: :schedule_view_horizontal_day_date

      # Horizontal week calendar
      get 'schedule_view/horizontal_week'
      get 'schedule_view/horizontal_week/entity/:entity/:year/:week', action: :horizontal_week, as: :schedule_view_horizontal_week_entity_date
      get 'schedule_view/horizontal_week/:year/:week', action: :horizontal_week, as: :schedule_view_horizontal_week_date

      # Vertical day calendar
      get 'schedule_view/vertical_day'
      get 'schedule_view/vertical_day/entity/:entity/:year/:month/:day', action: :vertical_day, as: :schedule_view_vertical_day_entity_date
      get 'schedule_view/vertical_day/:year/:month/:day', action: :vertical_day, as: :schedule_view_vertical_day_date

      # AJAX routes
      get 'schedule_view/entities'
      get 'schedule_view/reservations'
    end

    controller :today_and_tomorrow do
      get 'today_and_tomorrow/index'
      get 'today_and_tomorrow/reservations'
    end

    controller :occupation_view do
      get 'occupation_view/day'
      get 'occupation_view/week'
    end

    controller :search do
      get 'search/global'
      get 'search/tag/:id', action: :tag, as: :search_tag
    end
  end

  # Admin page routes

  resources :users, except: :new
  resources :entity_type_icons
  resources :feedbacks, except: [:new, :edit]
  resources :newsletter_signups, except: [:show] do
    post :public_signup, on: :new
  end
end
