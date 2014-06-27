require 'data_mapper'

class Event
end

class Participation
end

class Verb
end

class Activity
end

class Profile
end

class GameProfile
end 

class Badge
end

class Badgeassignment 
end

class Account 
  include DataMapper::Resource

  property :id, Serial
  property :created_at,   DateTime, :default => Time.now
  property :uname, String, :required => true
  property :password, String, :required => true

  has n, :participations
  has n, :participatedEvents, :model => Event, :child_key => [:id], :parent_key => [:event_id], :through => :participations

  has n, :events
	has 1, :profile , :model => Profile
	has 1, :gameProfile, :model => GameProfile 

  # NOTE: this should not be used right now.. use createEvent to create event 
  def addEvent(a)
    self.save
    self.events.reload
    self.events << a unless a.nil?
    return self.events.save!
  end

	def self.create_account args
    raise "You must create an account with an email address" if args[:uname].nil?
    new_account = Account.create()
    new_account.uname = args[:uname] 
    new_account.password = args[:password] if args.has_key? :password
    new_account.profile = Profile.create()
    new_account.profile.email = args[:uname]
    new_account.gameProfile = GameProfile.create()
    new_account.profile.save
    new_account.gameProfile.save
  	new_account.save   
  
    if new_account.saved? then new_account else raise 'cannot create account' end
  end

end

class Event
  include DataMapper::Resource

  property :id,     Serial
  property :created_at,   DateTime, :default => Time.now
  property :ename, String, :required => true
  property :date, Date
  property :time, Time
  property :place, String
  property :organizer, String
  property :fees,Integer
  property :prize, Integer
  property :description,String
  property :verb,String
  property :activity,String

  has n, :participations
  has n, :attendees, :model => Account, :child_key => [:id], :parent_key => [:account_id], :through => :participations

  belongs_to :account

  def self.createEvent args
    raise 401, "Must provide owner" if args[:account_id].nil?

		account = Account.first(:id => args[:account_id])
    newEvent = Event.create :account => account
    newEvent.account.save
    newEvent.account.reload
    counts = account.events.count
    newEvent.account.gameProfile.addpoints(200);
    newEvent.account.gameProfile.save; 
    if counts % 5 == 4
    	counts = count
    	name = "Creation of "+ (newEvent.account.events.count + 1).to_s + " Event"
    	badge = Badge.first_or_create(:name => name);
    	newEvent.account.gameProfile.badgesowned.reload
    	newEvent.account.gameProfile.badgesowned << badge if newEvent.account.gameProfile.badgesowned.first(:name => name).nil?
    	newEvent.account.gameProfile.save
    	newEvent.account.gameProfile.badgesowned.save
    end 	
    
    newEvent.ename = args[:ename]
    newEvent.date = args[:date] if args.has_key? :date 
    newEvent.time = args[:time] if args.has_key? :time
    newEvent.place = args[:place] if args.has_key? :place
    newEvent.organizer = args[:organizer] if args.has_key? :organizer
    newEvent.fees = args[:fees].to_i if args.has_key? :fees 
    newEvent.prize = args[:prize].to_i if args.has_key? :prize
    newEvent.description = args[:description] if args.has_key? :description 
    newEvent.verb = args[:verb] if args.has_key? :verb
    newEvent.activity = args[:activity] if args.has_key? :activity

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
    self.account.participatedEvents.reload;
 		counts = a.participatedEvents.count;
 		a.gameProfile.addpoints(100);
 		self.account.gameProfile.addpoints(100);
    if counts % 10 == 9
    	name = "participated in " + (counts + 1 ).to_s + " Events";
    	badge = Badge.first_or_create(:name => name);
    	a.gameProfile.badgesowned.reload;
    	a.gameProfile.badgesowned << badge if a.gameProfile.badgesowned.first(:name => name).nil?
    	a.gameProfile.save;
    	a.gameProfile.badgesowned.save;
    end
    counts = self.attendees.count;
    if counts % 10 == 9 
    	name = (counts+1).to_s + " participants in " + self.ename ;
    	puts name;
    	badge = Badge.create(:name => name);
    	a = self.account;
    	a.gameProfile.badgesowned.reload;
    	a.gameProfile.badgesowned << badge if self.account.gameProfile.badgesowned.first(:name => name).nil?
    	a.gameProfile.save;
    	a.gameProfile.badgesowned.save;
    end
    return self.attendees.save!
  end
end

class Participation
  include DataMapper::Resource
  property :created_at,   DateTime, :default => Time.now

  belongs_to :participatedEvent, :model => Event, :key => true, :child_key => [:event_id]
  belongs_to :attendee, :model => Account, :key => true, :child_key => [:account_id]
end
	
class Verb
  include DataMapper::Resource
  property :id,           Serial
  property :created_at,   DateTime, :default => Time.now
  property :verb,         String, :unique => true

  has n,   :activities, :model => Activity
end

class Activity
  include DataMapper::Resource
  property :id,           Serial
  property :created_at,   DateTime, :default => Time.now
  property :activity,     String, :unique => true

  belongs_to :verb, :model => Verb
end
class Profile 
	include DataMapper::Resource
	property :id,						Serial
	property :Name,					String
	property :gender,				String
	property :email,        String
  property :phone,        String
	property :college,      String
  property :semester,			String
  property :description,  Text
  belongs_to :account
  
  def create_profile args
  	raise 401, "Must provide Account to make" if args[:account_id].nil?
  end
end
class GameProfile
	include DataMapper::Resource 
	property :id,				Serial
	property :points,		Integer , :default => 0
	
	has n, :badgeassignments
	has n, :badgesowned, :model => Badge, :child_key => [:id], :parent_key => [:badge_id], :through => :badgeassignments
	
	belongs_to :account
	
	def addBadge(badge)
		self.save
		self.badgesowned.reload
		self.badgesowned << badge
		return self.badgesowned.save!
	end
	
	def addpoints(point)
		self.points = self.points+point
		self.save
		return self
	end
	
	def reducepoints(point)
		self.points = self.points-point
		self.save
		return self
	end
#	def awardbadge(a)
 #   self.save
 #   self.badge.reload
 #   self.badges << a unless a.nil?
  #  return self.badges.save!
 # end
end

class Badge
	include DataMapper::Resource
	property :id,			Serial
	property :name,   String 
	#property :state,  String
	
	has n, :badgeassignments
	has n, :badgesowner, :model => GameProfile, :child_key => [:id], :parent_key => [:game_profile_id], :through => :badgeassignments
	def awardBadge(gameprofile)
		self.save
		self.badgesowner.reload
		self.badgesowner << gameprofile
		return self.badgesowner.save!
	end
	
	
end
class Badgeassignment 
	include DataMapper::Resource
	property :id , Serial 
	belongs_to :badgesowned, :model => Badge, :key => true, :child_key =>[:badge_id] 
	belongs_to :badgesowner, :model => GameProfile, :key => true, :child_key => [:game_profile_id]
end


# this is very cricial otherwise you get the 
#  undefined method `include?' for nil:NilClass:
DataMapper.finalize
