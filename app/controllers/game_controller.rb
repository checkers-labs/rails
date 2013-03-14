class GameController < ApplicationController
  
  before_filter :login_required
  
  def index
    render 'index'
  end 
    
  def getMove
    moves = JSON.parse($redis.get(session[:game]))
    
    # si le meme joueur rejoue on envoie juste le coup joueur
    # sinon on dit de change de joueur
    if( cookies[:player] != moves[2] && moves.length > 2 ) 
      $redis.set(session[:game],moves.slice(0,2).to_json)
      moves = moves[3..moves.length]
      render :text => moves, :content_type => "text/plain"
    else
      render :text => false, :content_type => "text/plain"
    end    
  end
  
  def setMove
    user = JSON.parse($redis.get(session[:game]))
    user[2]=cookies[:player]
    user[3]=params[:again]
    user[4]=[Integer(params[:pawnBefore][0]),Integer(params[:pawnBefore][1])]
    user[5]=[Integer(params[:pawnAfter][0]),Integer(params[:pawnAfter][1])]
    $redis.set(session[:game],user.to_json)
    render :text => true, :content_type => "text/plain"
  end

end
