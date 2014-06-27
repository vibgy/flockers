require_relative '../helpers/init.rb'

module Flockers
  class WebApp < Sinatra::Application
		
		get '/profile' do
			authenticate!
			user = Account.first(:id => session['userid'].to_i)
			profile = user.profile
			
			content_type :json
			profile.to_json
		end
		
		get '/profile/events' do
			authenticate!
			response = {}
			flocks = []			
			user = Account.first(:id => params[:id].to_i)
			events = user.events
			events.each do |i|
				flocks.push(i.ename)
			end
			response["flocks"] = flocks
			content_type :json
			response.to_json

		end
		put '/profile' do
			authenticate!
			
			profile1 = params[:profile];
			user = Account.first(:id => session['userid'].to_i)
			user.profile.update(:Name => profile1[:Name],:semester => profile1[:semester],:gender => profile1[:gender],:email => profile1[:email],:phone => profile1[:phone],:college => profile1[:college],:description => profile1[:description]);
			user.profile.reload
			content_type :json
			user.profile.to_json
		end
		
		get '/gameprofile' do
			authenticate!
			user = Account.first(:id => session['userid'].to_i)
			gameprofile = user.gameProfile
			
			content_type :json
			gameprofile.to_json		
		end	
		
		get '/gameprofile/badges' do
			authenticate!
			response = {}
			gameprofile = GameProfile.first(:id => params[:id].to_i)			
			badges = []
			gameprofile.badgesowned.each do |i|
				badges.push(Badge.first(:id => i.id).name)
			end
			response["badges"]=badges
			
     	content_type :json
	   	response.to_json
		end
		
		get '/topgameprofiles/points' do
			authenticate!
			response = {}
			gameprofiles = []
			profiles = []
			gameprofiles12 = GameProfile.all(:limit => 10,:order => [:points.desc]);
			
			 
			gameprofiles12.each do |i|
				profiles.push(Profile.first(:id => i.id))
				gameprofiles.push(GameProfile.first(:id => i.id))
			end
			
			response["gameprofiles"] = gameprofiles;
			response["profiles"] = profiles;
      content_type :json
      response.to_json

		end
	
		#get '/topprofiles/points' do
			#authenticate!
			#gameprofiles = Profile.all(	:limit => 10,:order => [ :point.desc ])

      #content_type :json
      #gameprofiles.to_json

		#end

	end
end
