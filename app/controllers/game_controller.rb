class GameController < ApplicationController
  
  def index
    render 'index'
  end 
  
  def acceptInvite     
    key = $redis.keys("invitation:from#{params[:id]}to*")
    $redis.del(key)   
    game = "game:from#{params[:id]}to#{session[:user_id]}"   
    userGame = [session[:user_id], Integer(params[:id])].to_json
    session[:game]=game
    cookies[:player] = {
      :value => 0,
      :expires => 2.hour.from_now
    }
    $redis.set(game,userGame)
    render :text => true, :content_type => "text/plain"
  end
    
  def getMove
    moves = JSON.parse($redis.get(session[:game]))
    
    # si le meme joueur rejoue on envoie juste le coup joueur
    # sinon on dit de change de joueur
    logger.debug()
    if( cookies[:player] != moves[2] && moves.length > 2) 
      $redis.set(session[:game],moves.slice(0,2).to_json)
      moves = moves[3..moves.length]
      logger.debug(moves)
      render :text => moves, :content_type => "text/plain"
    else
      render :text => false, :content_type => "text/plain"
    end    
  end
  
  def setMove
    user = JSON.parse($redis.get(session[:game]))
    user[2]=cookies[:player]
    user[3]= params[:again]
    user[4]=[Integer(params[:pawnBefore][0]),Integer(params[:pawnBefore][1])]
    user[5]=[Integer(params[:pawnAfter][0]),Integer(params[:pawnAfter][1])]
    $redis.set(session[:game],user.to_json)
    render :text => true, :content_type => "text/plain"
  end

end
