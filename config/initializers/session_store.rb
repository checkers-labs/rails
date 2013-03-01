# Be sure to restart your server when you modify this file.

<<<<<<< HEAD
First::Application.config.session_store :redis_store , key: '_first_session'
=======
First::Application.config.session_store :redis_store, :redis_server => { :namespace => 'session' }, key: '_first_session'
>>>>>>> fd29aaa99e98f35862f76ae3b865a8577d62acb2

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rails generate session_migration")
# First::Application.config.session_store :active_record_store
