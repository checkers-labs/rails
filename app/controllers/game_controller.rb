class GameController < ApplicationController
  def acceptInvite    
    render :text => true, :content_type => "text/plain"
  end
  
  def index
    render 'index'
  end 
  
end
