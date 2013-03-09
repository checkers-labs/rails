class GameController < ApplicationController
  
  def index
    render 'index'
  end 
  
  def acceptInvite     
   key = $redis.keys("invitation:from#{params[:id]}to*")
   $redis.del(key)   
    game = "game:from#{params[:id]}to#{session[:user_id]}"   
    userJson = [session[:user_id], Integer(params[:id])].to_json    
    session[:game]=game
    $redis.set(game,userJson)
    render :text => true, :content_type => "text/plain"
  end
    
  def getMove
    logger.debug('hello')  
  end
  
  def setMove
    logger.debug('hello')
  end

  
end
