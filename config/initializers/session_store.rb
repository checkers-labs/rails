# Be sure to restart your server when you modify this file.

First::Application.config.session_store :redis_store, :redis_server => { :namespace => 'session'}, :expires_in => 5.minutes , :active_record_store => { key: '_first_session' }


# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rails generate session_migration")
# First::Application.config.session_store :active_record_store