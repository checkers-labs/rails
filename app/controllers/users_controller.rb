require 'bcrypt'

class UsersController < ApplicationController
    
  before_filter :login_required, :only=>['logout']
    
  def index        
    @userLogin = User.new()
    @userSignin = User.new()

    render "index"
  end

  def signin
    @userSignin = User.new(params[:user])

    if @userSignin.save
      # Ajout des infos en session
      session[:user_id] = @userSignin.id
      session[:user_name] = @userSignin.username
      session[:user_email] = @userSignin.email
      redirect_to :controller => "index", :action => "index"
    else
      @userLogin = User.new()
      render "index"
    end
  end

  def login
    @userLogin = User.new(params[:user])

    userByName = User.find(:first, :conditions=>["username = ?", @userLogin.username])
    if userByName != nil
      pwd = BCrypt::Engine.hash_secret(@userLogin.password, userByName.salt)
      if userByName.encrypted_password == pwd
        # Ajout des infos en session
        session[:user_id] = userByName.id
        session[:user_name] = userByName.username
        session[:user_email] = userByName.email
        redirect_to :controller => "index", :action => "index"
      end
    else
      flash[:notice] = "Invalid login or password"
      @userSignin = User.new()
      render "index"
    end
  end
  
  def logout
    session[:user_id] = nil
    session[:user_name] = nil
    session[:user_email] = nil
    redirect_to :controller => "users", :action => "index"
  end

end