# Run with bundle exec ruby populate_db.rb

require "./player.rb"

no_of_players = 10

# Clear db
Player.all.destroy

# Populate db
no_of_players.times do |var|
	player=Player.new
	player.email = "user#{var}@gmail.com"
	player.name = "user#{var}"
	player.score = rand(20)
	player.save
end

puts "Done"