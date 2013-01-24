class UsersController < ApplicationController  

  def new
    @user = User.new
  end
  
  def login
  end
  
  def index
    @login = User.login(params[:user])
    @user = User.new(params[:user])
    
    if @user.save
      #flash[:notice] = "You Signed in successfully"
      #flash[:color]= "valid"

    else
      #flash[:notice] = "Form is invalid"
      #flash[:color]= "invalid"
      render "index"
    end
  end    

end