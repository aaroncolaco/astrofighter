require 'sinatra'

# Reload if in development mode
require 'sinatra/reloader' if development?

get '/' do
	'Home Page'
end

get '/game/?' do 	# for /game & /game/ 
	@title = "Asteroid Game"
	erb :game
end

get '/scores' do
	'High Scores'
end

# All errors
error do
	# @title = "Error"
	# erb :error
	'Something boring happened'
end

# Not Found error
not_found do
	# @title = "Not Found"
	# erb :not_found
	'Not found'
end