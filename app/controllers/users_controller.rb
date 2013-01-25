require 'bcrypt'

class UsersController < ApplicationController
  def index
    @userLogin = User.new()
    @userSignin = User.new()

    render "index"
  end

  def signin
    @userLogin = User.new()
    @userSignin = User.new(params[:user])

    if @userSignin.save
      # Ajout des infos en session
      session[:user_id] = @userSignin.id
      session[:user_name] = @userSignin.username
      session[:user_email] = @userSignin.email
      redirect_to :controller => "index", :action => "index"

    else
      render "index"
    end
  end

  def login
    @userLogin = User.new(params[:user])
    @userSignin = User.new()

    userByName = User.where(:username => @userLogin.username).first()
    if userByName != nil
      pwd = BCrypt::Engine.hash_secret(@userLogin.password, userByName.salt)
      if userByName.encrypted_password == pwd
        # Ajout des infos en session
        session[:user_id] = @userLogin.id
        session[:user_name] = @userLogin.username
        session[:user_email] = @userLogin.email
        redirect_to :controller => "index", :action => "index"
      else
        flash[:notice] = "Invalid login or password"
        render "index"
      end
    else
      flash[:notice] = "Invalid login or password"
      render "index"
    end

  end

end