require 'sinatra'
require './player'

# Reload if in development mode
# require 'sinatra/reloader' if development?

set :app_name, 'Astrofighter'
set :lives, 3	# Number of lives in the game
set :score , 0

# for development
configure :development do
	DataMapper.setup(:default, "sqlite3://#{Dir.pwd}/development.db")
	
	disable :show_exceptions   #To show the 'error' pages I made when error occurs. Remove 
								# to carry out debugging, & restart server
end

# DB for production
configure :production do
	DataMapper.setup(:default, ENV['DATABASE_URL'])
end

# Gets executed before every request. So this is done to set @title to
# the default -- appname -- using the set_title helper
before do
	set_title
end

get '/' do
	erb :home
end

get '/about' do
	erb :about
end

get '/game/?' do 	# for /game & /game/ 
	@title = "Asteroid Game"
	@lives = params[:lives] || settings.lives	# 3 lives at start of game
	@score = params[:score] || settings.score
	
	erb :game, :layout => nil	# So that default layout not used
end

get '/gameover/?' do
	@title = "Game Over"
	@score = params[:score] || 0

	erb :game_over
end

get '/scores' do
	@player = Player.all(:order => [ :score.desc ])	# Scores in descending order
	erb :scores
end

post '/players?' do
	player = params[:player] # From form submission

	player_id = get_player_id(player[:email]) # Get/Check player data using helper method

	if player_id.nil?
		Player.create(player)
	else
		Player.get(player_id).update(player)
	end

	redirect to ('/scores')
end

# All errors
error do
	@title = "Error"
	erb :error
end

# Not Found error
not_found do
	@title = "Not Found"
	erb :not_found
end

helpers do
	def current?(path = '/')
		(request.path == path || request.path == path+'/') ? "active" : nil
	end
	def set_title
		# if not given, set to app name. That is why the OR
		@title ||= settings.app_name
		# Done so that we don't have to put this login in the erb file like before
	end
	def get_player_id(email)
		player = Player.first(:email => email)
		if player.nil?
			return nil
		end
		return player.id
	end
end