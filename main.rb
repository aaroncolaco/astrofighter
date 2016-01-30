require 'sinatra'

# Reload if in development mode
require 'sinatra/reloader' if development?

get '/' do
	erb :game
end