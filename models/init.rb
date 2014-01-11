require 'data_mapper'

class Account 
	include DataMapper::Resource
	property :id, 	Serial 	# Required in all DM classes coming from d
	property :uname, String, :required => true
	property :password, String, :required => true
        has n, :events
        has n, :participations        
end

class Event
       include DataMapper::Resource
       property :id, 	Serial 	# Required in all DM classes coming from d
       property :ename, String, :required => true
       property :date, Date
       property :time, Time
       property :place, String
       property :organizer, String
       property :fees,Integer
       property :prize, Integer
       property :description,String
       property :category,String
       has n, :participations
       belongs_to :account
end

class Participation
	include DataMapper::Resource
	property :id,   Serial
	belongs_to :event
	belongs_to :account
end
