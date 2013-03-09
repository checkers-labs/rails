class GameController < ApplicationController
  
  def acceptInvite     
   key = $redis.keys("invitation:from#{params[:id]}to*")
   $redis.del(key)   
    
    game = "game:from#{params[:id]}to#{session[:user_id]}"   
    userJson = [session[:user_id], params[:id]].to_json 
    $redis.set(game,userJson)
    render :text => true, :content_type => "text/plain"
  end
  
  def index
    render 'index'
  end 
  
end
