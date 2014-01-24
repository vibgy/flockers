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
function UserModel(data)
{
	this.uname = ko.observable(data.uname);
	this.account_id = ko.observable(data.account_id);
}
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
        $.post('/events',
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
    this.DeleteEvent=function(){
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
                   var oldevent = ko.utils.arrayFirst(eventViewModel.myEvents(),
                                                     function(item){
                                                         return item.id() == self.id(); 
                                                     });
                   eventViewModel.myEvents.remove(oldevent);
                   self.message("Event Deleted Successfully");
              }
          });
       
       };
};
    
function ViewModel()
{
	this.message=ko.observable('');
	this.publicEvents=ko.observableArray();
	this.myEvents=ko.observableArray();
	this.participationEvents=ko.observableArray();
	this.verb=ko.observableArray();
	this.event = ko.observable({});
	this.participant = ko.observable({});
	this.createEventState = ko.observable(false);
	this.selectedVerb = ko.observable();
    this.selectedActivity = ko.observable();
    this.displaySelectedVerb = ko.observable();
    this.displaySelectedActivity = ko.observable();
    this.activities = ko.observableArray([]);
    this.searchedEvents = ko.observableArray();//this is for wheel
    this.topEvents = ko.observableArray();
    this.topEventsID = ko.observableArray();
    this.topParticipants = ko.observableArray();
    this.topParticipantsID = ko.observableArray();
	
	
	this.showPublicEvents = function()
	{
        var event = {};
        var self = this;
        this.reset();
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
											return new ParticipatedEventModel(event);
							  			});
							  			self.participationEvents(events);
								}
							);
					}
    			}
    		);
    		 document.getElementById("display").setAttribute("data-bind","foreach : participationEvents");
    		  document.getElementById("option").setAttribute("data-bind","click : deleteParticipateEvent");
    };
    this.createEvent = function()
    {
        //TODO : make a dropdown for category in create event form
        var newEvent = new UserOwnedEventModel(emptyEvent);
        newEvent.verb = this.selectedVerb;
        newEvent.activity = this.selectedActivity;
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
        this.displaySelectedActivity(this.displaySelectedVerb()+ " " +activity);
        this.selectedActivity(activity);
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
		    this.displaySelectedVerb("I would love to "+data);
		    this.selectedVerb(data);
		    self.activities.removeAll();
		    self.searchedEvents.removeAll();
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
      
      this.getTopEvents = function()
      {
		var event={};
        var uniqueEvents = new Array(); 
        var self = this;   
        this.reset();
        $.get('/eventID',
              function(data)
              {
                   for(var i = 0 ; i < data.length; i++)
                   {
                       var index = uniqueEvents.indexOf(data[i].event_id);
                       if(index == -1)
                       {
                            uniqueEvents.push({event_id : data[i].event_id, count :1});
                       }
                       else
                       {
                           uniqueEvents[index].count = (uniqueEvents[index].count)+1;                         

                       }
                   }
                   uniqueEvents.sort(compare);
                   for( var i = 0 ; i < 5 && i < uniqueEvents.length  ; i++)
                   {
                       self.topEventsID.push(uniqueEvents[i].event_id);
                   }
                   $.get('/topevents',
								{eventArray : self.topEventsID()},
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
												  });
									self.topEvents(events);
								}
							);
				}
			);	
    };
    this.getTopParticipants = function()
      {
		var participant={};
        var uniqueParticipants = new Array();
        this.reset();
        var self = this; 
        self.topParticipants.removeAll();
          
        $.get('/participantID',
              function(data)
              {
                   for(var i = 0 ; i < data.length; i++)
                   {
                       var index = uniqueParticipants.indexOf(data[i].account_id);
                       if(index == -1)
                       {
                            uniqueParticipants.push({account_id : data[i].account_id, count :1});
                       }
                       else
                       {
                           uniqueParticipants[index].count = (uniqueEvents[index].count)+1;                         

                       }
                   }
                   uniqueParticipants.sort(compare);
                   for( var i = 0 ; i < 5 && i < uniqueParticipants.length  ; i++)
                   {
                       self.topParticipantsID.push(uniqueParticipants[i].account_id);
                   }
                   $.get('/topParticipants',
								{participantArray : self.topParticipantsID()},
								function(data)
								{
									var participants = $.map(data,function(item) 
													{
													participant.uname = item.uname;
													participant.account_id = item.id;
													return new UserModel(participant);
												  });
									self.topParticipants(participants);
								}
							);
				}
			);	
    };

      this.init = function() 
	  {
		    this.showPublicEvents();
		    this.drawWheel();
		    this.getTopEvents();
		    this.getTopParticipants();
      }

    this.reset = function()
    {
  		this.myEvents.removeAll();
        this.participationEvents.removeAll();
        this.message('');
        this.searchedEvents.removeAll();
        this.createEventState(false);
        this.topEvents.removeAll();
        this.topEventsID.removeAll();
        
    }
}
function isUnique(event ,array)
{
    for( var i = 0 ; i < array.length; i++)
    {
        if(event == array[i].event)
        {
            return i;
        }
    }
    return -1;
}

function compare( a , b )
{
    if(a.count < b.count)
    {
        return 1;
    }
    if(a.count > b.count)
    {
        return -1;
    }
    return 0;
}

$().ready(function()
			{
				viewModel = new ViewModel();
				if($("#event").get(0))
				{
					ko.applyBindings(viewModel,$("#event").get(0));
				}
				if($("#events").get(0))
				{
					ko.applyBindings(viewModel,$("#events").get(0));
				}
				viewModel.init();
			}
		);
	
