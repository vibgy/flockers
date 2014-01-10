require 'data_mapper'

class Account 
	include DataMapper::Resource
	property :id, 	Serial 	# Required in all DM classes coming from d
	property :uname, String, :required => true
	property :password, String, :required => true
        
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
end

class Participation
	include DataMapper::Resource
	property :id,   Serial
	property :event_id, Integer
	property :user_id, String
end
