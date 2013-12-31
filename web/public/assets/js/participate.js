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
    this.organizer = ko.observable(data.organizer);
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
    this.pas=ko.observable('');
	
	this.showPublicEvents = function(){
        var event = {};
        var self = this;
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
                event.organizer = item.organizer;
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
					 document.getElementById("Welcome").style.visibility="hidden";
					 data = JSON.parse(data);
					 if(data.status == 'not success')
					 {
						 document.getElementById("InvalidUser").style.visibility="visible";
					 }
					 else
					 {
						 if(wantsToParticipate==true)
						 {
							 $.post("/participate",
								{event: oldeventID,user_name : user},
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
   
});
