require 'sinatra'

# Reload if in development mode
require 'sinatra/reloader' if development?

get '/' do
	'Home Page'
end

get '/game/?' do 	# for /game & /game/ 
	erb :game
end

get '/scores' do
	'High Scores'
end
