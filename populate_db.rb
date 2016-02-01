require './player.rb'

no_of_players = 10

# Populate db
no_of_players.times do |var|
	player=Player.new
	player.email = "user#{var}@gmail.com"
	player.name = "user#{var}"
	player.score = rand(20)
	player.save
end

# Clear db
# Player.all.destroy