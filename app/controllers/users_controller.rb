class UsersController < ApplicationController  

  def new
    @user = User.new    
   end
  
  def create  
    @user = User.new(params[:user])    
    
    if @user.save
      flash[:notice] = "You Signed up successfully"
      flash[:color]= "valid"
      render "login"
    else
      flash[:notice] = "Form is invalid"
      flash[:color]= "invalid"
      render "new"
    end

  end    
  
  
  def login 

  end
end