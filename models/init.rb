require 'data_mapper'

class Event
end

class Participation
end

class Account 
	include DataMapper::Resource

	property :id, 	Serial 	# Required in all DM classes coming from d
  property :created_at,   DateTime, :default => Time.now
	property :uname, String, :required => true
	property :password, String, :required => true
  
  has n, :participations
  has n, :participatedEvents, :model => Event, :child_key => [:id], :parent_key => [:event_id], :through => :participations

  has n, :events
end

class Event
       include DataMapper::Resource

       property :id, 	Serial 	# Required in all DM classes coming from d
       property :created_at,   DateTime, :default => Time.now
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
       has n, :attendees, :model => Account, :child_key => [:id], :parent_key => [:account_id], :through => :participations

       belongs_to :account
end

class Participation
	include DataMapper::Resource
  property :created_at,   DateTime, :default => Time.now
  #     property :id,  Serial  # Required in all DM classes coming from d

	belongs_to :participatedEvent, :model => Event, :key => true, :child_key => [:event_id]
	belongs_to :attendee, :model => Account, :key => true, :child_key => [:account_id]
end

# this is very cricial otherwise you get the 
#  undefined method `include?' for nil:NilClass:
DataMapper.finalize
