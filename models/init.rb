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

  # NOTE: this should not be used right now.. use createEvent to create event 
  def addEvent(a)
    self.save
    self.events.reload
    self.events << a unless a.nil?
    return self.events.save!
  end

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

  def self.createEvent args

    raise 401, "Must provide owner" if args[:account_id].nil?

    newEvent = Event.create :account => Account.first(:id => args[:account_id])
    newEvent.account.save
    newEvent.account.reload

    newEvent.ename = args[:ename]
    newEvent.date = args[:date] if args.has_key? :date
    newEvent.time = args[:time] if args.has_key? :time
    newEvent.place = args[:place] if args.has_key? :place
    newEvent.organizer = args[:organizer] if args.has_key? :organizer
    newEvent.fees = args[:fees] if args.has_key? :fees
    newEvent.prize = args[:prize] if args.has_key? :prize
    newEvent.description = args[:description] if args.has_key? :description
    newEvent.category args[:category] if args.has_key? :category

    newEvent.save

    if newEvent.saved?
      newEvent
    else
      newEvent.errors.each do |e|
        puts "error: #{e}\n"
      end

      raise 'could not save new event in Event.createEvent'
    end
  end

  def addAttendee(a)
    self.save
    self.attendees.reload
    self.attendees << a unless a.nil?
    return self.attendees.save!
  end

end

class Participation
	include DataMapper::Resource
  property :created_at,   DateTime, :default => Time.now

	belongs_to :participatedEvent, :model => Event, :key => true, :child_key => [:event_id]
	belongs_to :attendee, :model => Account, :key => true, :child_key => [:account_id]
end

# this is very cricial otherwise you get the 
#  undefined method `include?' for nil:NilClass:
DataMapper.finalize
