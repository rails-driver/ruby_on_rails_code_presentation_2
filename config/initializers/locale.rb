Rails.application.configure do
  config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}').to_s]
  config.i18n.available_locales = %i(en)
  config.i18n.default_locale = :en
end
