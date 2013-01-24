class UsersController < ApplicationController
  
  def index
    @userLogin = User.new(params[:user])
    @userSignin = User.new(params[:user])
    render "index"
  end
  
  def signin
    @userLogin = User.new(params[:user])
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
  end

end