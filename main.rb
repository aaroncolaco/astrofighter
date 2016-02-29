require 'sinatra'

# Reload if in development mode
require 'sinatra/reloader' if development?

set :app_name, 'Astrofighter'

get '/' do
	erb :home
end

get '/about' do
	'About Page'
end

get '/game/?' do 	# for /game & /game/ 
	@title = "Asteroid Game"
	erb :game, :layout => nil	# So that default layout not used
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

helpers do
	def current?(path = '/')
		(request.path == path || request.path == path+'/') ? "active" : nil
	end
	def set_title
		# if not given, set to app name. That is why the OR
		@title ||= settings.app_name
		# Done so that we don't have to put this login in the erb file like before
	end
end