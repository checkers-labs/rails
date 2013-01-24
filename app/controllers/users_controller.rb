class UsersController < ApplicationController
  
  def index
    @user = User.new(params[:user])
    render "index"
  end
  
  def signin
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
  
  def login
  end

end