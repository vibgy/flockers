var wantsToParticipate;
var viewModel;
var emptyEvent = new function()
{
	this.id = "";
    this.ename = "";
    this.date = "";
    this.time = "";
    this.place = "";
    this.organizer = "";
    this.fees = "";
    this.prize = "";
    this.description = "";
    this.verb = "";
    this.activity = "";
    this.account_id = "";
    this.state = "";
};
function EventModel(data)
{
	this.id = ko.observable(data.id);
    this.ename = ko.observable(data.ename);
    this.date = ko.observable(data.date);
    this.time = ko.observable(data.time);
    this.place = ko.observable(data.place);
    this.organizer = ko.observable(data.organizer);
    this.fees = ko.observable(data.fees);
    this.prize = ko.observable(data.prize);
    this.description = ko.observable(data.description);
    this.verb = ko.observable(data.verb);
    this.activity = ko.observable(data.activity);
	this.account_id = ko.observable(data.account_id);
	this.state = ko.observable(data.state);
};
function PublicEventModel(data)
{
	ko.utils.extend(this , new EventModel(data));
	var uname = ko.observable($("#current_user").val());
    var account_id = ko.observable($("#current_user_id").val());
    this.participate = function()
    {
        var self=this;
        if(uname()==''||uname()==null)
        {
        		$('#signInModal').modal("show");
        }
        else{      
        	$.post("/participate",
		    	{event: this.id(),user_id: account_id()},
		    	function(data)
		    	{
		       		viewModel.message("You have participated successfully!!");
		  
		   		}
		   	  );}
    }
};
function ParticipatedEventModel(data)
{
	ko.utils.extend(this , new EventModel(data));
	this.uname = ko.observable($("#current_user").val());
    this.account_id = ko.observable($("#current_user_id").val());
	this.deleteParticipateEvent = function()
	{
   		var self=this;
        $.delete("/participationEvent",
        			{event_id : this.id()},
          			function(data)
          			{
              			if(data.status == 'not_success')
              			{
                   			viewModel.message("Event Cannot be Deleted");
              			}
              			else
              			{
                   			var oldevent = ko.utils.arrayFirst(viewModel.participationEvents(),function(item)
                   							{
                                            	return item.id() == self.id(); 
                                            });
                   			viewModel.participationEvents.remove(oldevent);
                   			viewModel.message("Event Deleted Successfully");
              			}
          			}
          		);
    };

};
function UserOwnedEventModel(data)
{
	ko.utils.extend(this , new EventModel(data));
	this.uname = ko.observable($("#current_user").val());
    this.account_id = ko.observable($("#current_user_id").val());
	this.createEvent = function(event)
	{
        var self = this;
        $.post('/createEvent',
               {event : event},
                function(data){
                    if(!data.error)
                    {
                        viewModel.message("Event Created Successfully");
                    }
                    else
                    {
                         viewModel.message(data.error.message);
                    }
                }
                );
    }
};
    
function ViewModel()
{
	this.message=ko.observable('');
	this.publicEvents=ko.observableArray();
	this.myEvents=ko.observableArray();
	this.participationEvents=ko.observableArray();
	this.verb=ko.observableArray();
	this.event = ko.observable({});
	this.createEventState = ko.observable(false);
	this.selectedVerb = ko.observable();
    this.selectedActivity = ko.observable();
    this.activities = ko.observableArray([]);
    this.searchedEvents = ko.observableArray();//this is for wheel
	
	
	this.showPublicEvents = function()
	{
        var event = {};
        var self = this;
        $.get('/publicEvents.json',
				function(data)
				{
			    
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
				        	event.verb = item.verb;
							event.activity = item.activity;
							event.account_id = item.account_id;
							event.state = item.state;
				        	return new PublicEventModel(event);
				      	}
		          	);
              		self.publicEvents(events);
            	}
            );
    };
    this.showMyEvents = function()
    {
		//TODO: if a user has no events,show him create event
        var event = {};
        this.reset();
        var self = this;
        $.get('/myEvents.json',
            	function(data)
            	{
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
				        event.verb = item.verb;
						event.activity = item.activity;
						event.account_id = item.account_id;
						event.state = item.state;
				        return new UserOwnedEventModel(event);
				      });
              		self.myEvents(events);
            	}
            );
            document.getElementById("option").setAttribute("data-bind","click : DeleteEvent");
    };
    this.showParticipationEvents = function()
    {
        var event = {};
        this.reset();
        var self = this;
        $.get('/participationID.json',
            	function(data)
            	{
		          	if(data.status=='Failure')
		          	{
		          		self.message("No such events");    
		        	}
		        	else
		        	{
		            	var e=$.map(data,function(item){return item.event_id});
		            	$.get('/participationEvents.json',
		              			{'event' : e},
		              			function(data)
		              			{
		              		
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
											event.verb = item.verb;
											event.activity = item.activity;
											event.account_id = item.account_id;
											event.state = item.state;
											return new ParticipatedcEventModel(event);
							  			});
							  			self.participationEvents(events);
								}
							);
					}
    			}
    		);
    		document.getElementById("option").setAttribute("data-bind","click : deleteParticipationEvent");
    };
    this.createEvent = function()
    {
        //TODO : make a dropdown for category in create event form
        var newEvent = new UserOwnedEventModel(emptyEvent);
        this.event(newEvent);
    };

    this.createEventHelper = function()
    {
        this.event().createEvent(JSON.parse(ko.toJSON(this.event())));
    };
	this.DeleteEvent=function()
	{
          var self=this;
          $.delete("/events",
          			{event_id : this.id()},
          			function(data)
          			{
						  if(data.status == 'not_success')
						  {
						       self.message("Event Cannot be Deleted");
						  }
						  else
						  {
						       var oldevent = ko.utils.arrayFirst(eventViewModel.myEvents(),function(item)
						       					{
						                        	return item.id() == self.id(); 
						                        });
						       eventViewModel.myEvents.remove(oldevent);
						       self.message("Event Deleted Successfully");
						  }
          			}
          		);
       
    };

	this.searchEventByActivity = function(activity) 
	{
    	var self = this;
        var SEvent={};
        this.reset();
        this.selectedActivity(this.selectedVerb()+ " " + activity);
        this.searchedEvents.removeAll();
        this.createEventState(true);
        $.get('/searchEventByActivity',
                 {record : activity},
                 function(data)
                 {
                    if(data.status == 'Failure')
                    {
                        self.message("No Matches Found");
                        this.createEventState(true);
                    }
                    else
                    {
                        var SEvents = $.map(data,function(item) 
                        {
                             SEvent.id =item.id;
                             SEvent.ename = item.ename;
                             SEvent.date = item.date;
                             SEvent.time = item.time;
                             SEvent.place = item.place;
                             SEvent.organizer = item.organizer;
                             SEvent.fees = item.fees;
                             SEvent.prize = item.prize;
                             SEvent.description = item.description;
                             SEvent.verb = item.verb;
							 SEvent.activity = item.activity;
							 SEvent.account_id = item.account_id;
							 SEvent.state = item.state;
                             return new PublicEventModel(SEvent);
                        });
                        self.searchedEvents(SEvents);
                    }
                });
                 
     };
     this.drawWheel = function() 
     {
		 var self = this;
		 var verb = [];
		 $.get('/verbs',
		          function(data)
		          {
		               for(var i = 0 ; i < data.length; i++)
		               {
		                   if(verb.indexOf(data[i].verb)==-1)
		                   {
		                        verb.push(data[i].verb);
		                   }
		               } 
		              self.verb(verb); 
		          }
		          
		      );
      };
	  this.getActivities = function(data) 
	  {
		    var self = this;
		    this.selectedVerb("I would love to "+data);
			$.get('/activities',
		            {verb : data},
		            function(data)
		            {
		                 for(var i = 0 ; i < data.length; i++)
		                 {
		                     self.activities.push(data[i].activity);
		                 } 
		            }
		         );
      };

      this.init = function() 
	  {
		    this.showPublicEvents();
		    this.drawWheel();
      }

    this.reset = function()
    {
  		this.myEvents.removeAll();
        this.participationEvents.removeAll();
        this.message('');
        this.searchedEvents.removeAll();
        this.createEventState(false);
    }
}


$().ready(function()
			{
				viewModel = new ViewModel();
				if($("#event").get(0))
				{
					ko.applyBindings(viewModel,$("#event").get(0));
				}
				viewModel.init();
			}
		);
	
