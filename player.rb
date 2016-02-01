require 'dm-core'
require 'dm-migrations'

DataMapper.setup(:default, "sqlite3://#{Dir.pwd}/development.db")

class Player
	include DataMapper::Resource
	property :id, Serial
	property :email, String
	property :name, String
	property :score, Integer
end

DataMapper.finalize