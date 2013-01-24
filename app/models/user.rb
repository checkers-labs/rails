class User < ActiveRecord::Base
      attr_accessible :username, :email, :password, :password_confirmation
      attr_accessor :password

      validates :username, :presence => true, 
                           :uniqueness => true, 
                           :length => { :within => 3..20 }
      validates :email, :presence => true, 
                        :uniqueness => true, 
                        :format => { :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, :on => :create }
      validates :password, :confirmation => true, 
                           :length       => { :within => 6..20 }
end