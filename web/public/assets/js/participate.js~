var participateViewModel;
var wantsToParticipate=false;
var oldeventID;

function EventModel(data)
{
    var self=this;
    this.id = ko.observable(data.id);
    this.ename = ko.observable(data.ename);
    this.date = ko.observable(data.date);
    this.time = ko.observable(data.time);
    this.place = ko.observable(data.place);
    this.account_id = ko.observable(data.account_id);
    this.fees = ko.observable(data.fees);
    this.prize = ko.observable(data.prize);
    this.description = ko.observable(data.description);
    
    this.participateVar=function()
    {
	wantsToParticipate=true;
	oldeventID = self.id(); 
    }
 
}


function ParticipateViewModel() {
  
    this.publicEvents = ko.observableArray();
    this.uname=ko.observable('');
    this.pass = ko.observable();
    this.confirmpass = ko.observable();
    this.error = ko.observable('');
    this.pas=ko.observable('');

    var self = this;

    this.signup = function()
    {
    if(this.pass() == this.confirmpass())
    {
    	$.post("/signup",
    	      {user_name :this.uname(),pass : this.pass()},
    	      function(data)
    	      {
                  if(data.error)
                  {
                      document.getElementById("InvalidUser").style.visibility="visible";
                      self.error("Unable to create Account");
                  }
                  else
                  {
    	              document.getElementById("SuccessfulSignup").style.visibility="visible";
                  }
    	      }
    	      );
    }
    else
    {
         document.getElementById("InvalidUser").style.visibility="visible";
         this.error("Passwords do not match!!");   
    }
    return false;
    }
    this.showPublicEvents = function(){
        var event = {};
        $.get(
            '/publicEvents.json',
            function(data){
              data = JSON.parse(data);
              var events = $.map(data,function(item) 
              {
                event.id = item.id;
                event.ename = item.ename;
                event.date = item.date;
                event.time = item.time;
                event.place = item.place;
                event.account_id = item.account_id;
                event.fees = item.fees;
                event.prize = item.prize;
                event.description = item.description;
                return new EventModel(event);
              });
              self.publicEvents(events);
            });
    };
    
    
   this.login=function()
	{
			var user=this.uname();
			$.post("/login",
				  {user_name : user, pass : this.pas()},
				  function(data)
				  {
					 document.getElementById("InvalidUser").style.visibility="hidden";
					 if(data.error)
					 {
						 document.getElementById("InvalidUser").style.visibility="visible";
                                                 self.error(data.error.message);
					 }
					 else
					 {
						 if(wantsToParticipate==true)
						 {
							 $.post("/participate",
								{event: oldeventID,user_id : data.id},
								function(data)
								{
								//alert(data);
						
								});
						 }
						//alert(user);
						window.location.href="/loggedIn";
					 }
				  }
			 );
		
	};
}

participateViewModel = new ParticipateViewModel();

$().ready(function() {
    
    ko.applyBindings(participateViewModel);
    participateViewModel.showPublicEvents();
   
});
