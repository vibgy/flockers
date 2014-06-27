"use strict";
var profileViewModel;

function UserModel(data)
{
  this.account_id=ko.observable(data.id);
  this.uname=ko.observable(data.uname);  
}
function ProfileModel(data)
{
	this.profile_id = ko.observable(data.id);
	this.Name = ko.observable(data.Name);
	this.gender = ko.observable(data.gender);
	this.email = ko.observable(data.email);
	this.phone = ko.observable(data.phone);
	this.college = ko.observable(data.college);
	this.semester = ko.observable(data.semester);
	this.description = ko.observable(data.description);
}

function GameProfileModel(data)
{
	var self = this;
	self.GameProfile_id = ko.observable(data.id);
	self.points = ko.observable(data.points);
	self.badges = ko.observableArray();
	this.getBadges = function()
	{
  	$.get("/gameprofile/badges",
  	  {id:self.GameProfile_id()},
  		function(response)
  		{
       	self.badges(response["badges"]);
  		}
   	);
	}
}
var emptyUser = new function()
{
  this.account_id="";
  this.uname="";  
};

var emptyProfile = new function()
{
	this.id = "";
	this.Name = "";
	this.gender = "";
	this.email =  "";
	this.phone = "";
	this.college =  "";
	this.semester = "";
	this.description = "";
};

var emptyGameProfile = new function()
{
	this.id = "";
	this.points = "";
}
function ViewModal()
{
	var self = this;
	self.user = ko.observable(new UserModel(emptyUser));
	self.profile = ko.observable(new ProfileModel(emptyProfile));
	self.gameProfile = ko.observable(new GameProfileModel(emptyGameProfile));
	
	self.flocks = ko.observableArray();
	self.topgameProfiles = ko.observableArray();
	self.topprofiles = ko.observableArray();
	self.showParticipatedFlocks = function(profile) {
		$.get('/profile/events',
			{id : profile.profile_id},
			function(response)
			{
				self.flocks(response["flocks"]);
				$('#FlocksParticipatedModal').modal('show')	;
			}
		);	
	}
	self.toppoints = function(){
    $.get('/topgameprofiles/points',
      function(response)
      {
         var gameprofiles = $.map(response["gameprofiles"],function(item)
          {
          	var gameprofile =  new GameProfileModel(item);
          	gameprofile.getBadges();
          	return gameprofile;
          });
          self.topgameProfiles(gameprofiles);
      	  var profiles = $.map(response["profiles"],function(item) 
          {
            return new ProfileModel(item);
          });
          self.topprofiles(profiles);
 
 			}
		);
	}
		self.init = function() {
		$.get('/profile',
			function(data)
			{
				self.profile(new ProfileModel(data));
				   	if(data.Name == "" || data.Name == null ||data.gender == "" || data.gender == null || data.college == "" || data.college == null ||data.semester == "" || data.semester == null )
   					{
   						$('#EditProfileModal').modal('show')	;
   					}

			}	
		);
		$.get('/gameprofile',
		  function(data)
		  {
		  	self.gameProfile(new GameProfileModel(data));
		  	self.gameProfile().getBadges();
		  }
		);	
		
	}
	
	self.editdetails = function()
	{
		$.ajax({
			url: '/profile',
      data: {profile : self.profile()},
      type: "PUT",
      success: function(data) {
				if(!data.error)
					alert("Profile updated successfully ");
				else
					alert("it have some error");
      }
   	});  
	}
}
$(document).ready( function() {
    var profileViewModel = new ViewModal();
    profileViewModel.init();
    profileViewModel.toppoints();
  
   if($("#FlocksParticipatedModal").get(0))
    {
      ko.applyBindings(profileViewModel,$("#FlocksParticipatedModal").get(0));
    }  
   	if($("#profile1").get(0))
    {
      ko.applyBindings(profileViewModel,$("#profile1").get(0));
    }  
    if($("#BadgeslistModal").get(0))
    {
      ko.applyBindings(profileViewModel,$("#BadgeslistModal").get(0));
    }

    if($("#EditProfileModal").get(0))
    {
      ko.applyBindings(profileViewModel,$("#EditProfileModal").get(0));
    }
           
  }
);
