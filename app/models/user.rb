class User < ActiveRecord::Base
      attr_accessible :password, :username, :email, :password_confirmation
      attr_accessor :password

      validates :username, :presence => true, :uniqueness => true, :length => { :in => 3..20 }
      validates :email, :presence => true, :uniqueness => true, :format => { :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, :on => :create }
      validates :password, :confirmation => true
      validates_length_of :password, :in => 6..20, :on => :create
end