require 'bcrypt'

class User < ActiveRecord::Base
    
      before_save :hash_password  
  
      attr_accessible :username, :email, :password, :password_confirmation
      attr_accessor :password, :password_confirmation

      validates :username, :presence => true, 
                           :uniqueness => true, 
                           :length => { :within => 3..20 }
      validates :email, :presence => true, 
                        :uniqueness => true, 
                        :format => { :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, :on => :create }
      validates :password, :confirmation => true, 
                           :length       => { :within => 6..20 }

      private
      def hash_password
         self.salt = BCrypt::Engine.generate_salt
         self.encrypted_password = BCrypt::Engine.hash_secret(password, salt)
      end
end