"use strict";

var wantsToParticipate;
var viewModel;
var emptyEvent = new function()
{
  this.id = "";
  this.ename = "New Flock";
  this.date = new Date();
  this.time = "11:00 AM";
  this.place = "";
  this.organizer = "";
  this.fees = "";
  this.prize = "";
  this.description = "Just for fun";
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
  this.participants = ko.observableArray();
  var self=this;
  this.showParticipants = function()
  {
  	$.get("/event/participants",
  		{event_id : self.id()},
  		function(response)
  		{
  		  if(response.error)
            viewModel.setMessage(response.error.message);
          else
          	self.participants(response["uname"]);
  		}
  		);
  }
  this.details = function() {
    viewModel.details(this);
  }
};

function UserModel(data)
{
  this.uname = ko.observable(data.uname);
  this.account_id = ko.observable(data.account_id);
}

function PublicEventModel(data)
{
  var self=this;
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
    else 
    {      
      $.post("/users/events/participant",
        {event: this.id(), user_id: account_id()},
        function(response)
        {
          if(response.error)
            viewModel.setMessage(response.error.message);
          else
            viewModel.setMessage("You have joined this flock!!");
        }
        );
    }
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
    $.ajax({
       url: "/users/events/participant",
       data: {event_id : this.id()},
       type: 'DELETE',
       success: function(data)
                {                   
                        var oldevent = ko.utils.arrayFirst(viewModel.myParticipatedEvents(),
                                                            function(item)
                                                            {
                                                                return item.id() == self.id(); 
                                                           });
                       viewModel.myParticipatedEvents.remove(oldevent);
                       viewModel.setMessage("Event Deleted Successfully");
               }
          });
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
    $.post('/users/events',
     {event : event},
     function(data){
      if(!data.error)
      {
        viewModel.setMessage("Event Created Successfully");
      }
      else
      {
       viewModel.setMessage(data.error.message);
     }
   }
   );
  }
  this.DeleteEvent=function(){
    var self=this;
    $.ajax({
        url: '/users/events',
        data: {event_id : this.id()},
        type: 'DELETE',
        success: function(data) {
       
                     var oldevent = ko.utils.arrayFirst(viewModel.myOwnedEvents(),
                                                     function(item){
                                                         return item.id() == self.id(); 
                                                     });
                                                     viewModel.myOwnedEvents.remove(oldevent);
                                                     viewModel.message("Event Deleted Successfully");
              
                               }
         });
   
   };
};

  function ViewModel()
  {
    this.message = ko.observable('');

    this.publicEvents=ko.observableArray();
    this.myOwnedEvents=ko.observableArray();
    this.myParticipatedEvents = ko.observableArray();
    this.participationEvents=ko.observableArray();

    this.verb=ko.observableArray();
    this.selectedVerb = ko.observable();
    this.displayText = ko.observable("I would love to ");

    this.activities = ko.observableArray([]);
    this.newActivity = ko.observable();
    this.selectedActivity = ko.observable();

  this.event = ko.observable(new EventModel(emptyEvent)); // this is for new Event
  this.createEventState = ko.observable(false);
  this.showCreateEventForm = ko.observable(false);

  this.participant = ko.observable({});

  this.detailedState = ko.observable(false);
  this.detailedEvent = ko.observable(new EventModel(emptyEvent));

  this.searchedEvents = ko.observableArray();//this is for wheel

  this.topEvents = ko.observableArray();
  this.topEventsID = ko.observableArray();
  this.topParticipants = ko.observableArray();
  this.topParticipantsID = ko.observableArray();
  
  this.setMessage = function(msg) {
    // NOTE: this is important to make it work with the fading for some reason
    this.message(''); 
    this.message(msg);
    setTimeout( function() {$("#errorMsg").fadeOut(3000);}, 1000);
  }

  this.details = function(data)
  {
    this.detailedState(true);
    this.detailedEvent(data);
  };

  this.showPublicEvents = function()
  {
    var event = {};
    var self = this;
    this.reset();
    $.get('/events',
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
    var uname = $("#current_user").val();
    var account_id = $("#current_user_id").val();

    if (uname && account_id) {

      //TODO: if a user has no events,show him create event
      var event = {};
      this.reset();
      var self = this;
      $.get('/users/events',
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
          self.myOwnedEvents(events);

        }
        );

      $.get('/users/events/participant',
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
          self.myParticipatedEvents(events);

        }
        );
    }
  };

  this.showParticipationEvents = function()
  {
    var event = {};
    this.reset();
    var self = this;
    $.get('/users/events',
      function(data)
      {
        if(data.status=='Failure')
        {
          self.setMessage("No such events");    
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

this.createEvent = function() {
        //TODO : make a dropdown for category in create event form
        this.showCreateEventForm(true);
        var newEvent = new UserOwnedEventModel(emptyEvent);
        newEvent.verb = this.selectedVerb();
        newEvent.activity = this.selectedActivity();
        this.event(newEvent);
      };

      this.createEventHelper = function()
      {
        var time  = this.event().time();
        var date  = new Date();
        time = date.toDateString()+" "+time;
        this.event().time(time);
        this.event().createEvent(JSON.parse(ko.toJSON(this.event())));
        this.showCreateEventForm(false);
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
             self.setMessage("Event Cannot be Deleted");
           }
           else
           {
             var oldevent = ko.utils.arrayFirst(eventViewModel.myEvents(),function(item)
             {
              return item.id() == self.id(); 
            });
             eventViewModel.myEvents.remove(oldevent);
             self.setMessage("Event Deleted Successfully");
           }
         }
         );

      };

      this.searchEventByActivity = function(activity) 
      {
        var self = this;
        var SEvent={};
        this.reset();
        this.displayText(this.displayText()+ " " +activity);
        this.selectedActivity(activity);
        this.searchedEvents.removeAll();
        this.createEventState(true);
        $.get('/events/searchByActivity',
         {record : activity},
         function(data)
         {
          if(data.status == 'Failure')
          {
            self.setMessage("No Matches Found");
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
  this.displayText("I would love to ");
  this.displayText(this.displayText() + data);
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

this.addActivity = function() {
 var self = this;
 $.post('/activities',
  {verb: this.selectedVerb(), activity: this.newActivity()},
  function() {
                // this means success
                self.getActivities(self.selectedVerb());
              }
              );
 return false;
};

this.getTopEvents = function()
{
  var event={};
  var uniqueEvents = new Array(); 
  var self = this;   
  this.reset();
  $.get('/events/top',
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
   $.get('/events/top',
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

  $.get('/users/top',
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
   $.get('/users/top',
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
  this.showMyEvents();
  this.drawWheel();
  this.getTopEvents();
  this.getTopParticipants();
}

this.reset = function()
{
  this.myOwnedEvents.removeAll();
  this.myParticipatedEvents.removeAll();
  this.participationEvents.removeAll();
  this.message('');
  this.searchedEvents.removeAll();
  this.createEventState(false);
  this.detailedState(false);
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
viewModel = new ViewModel();
viewModel.init();
$().ready(function()
{

  if($("#event").get(0))
  {
    ko.applyBindings(viewModel,$("#event").get(0));
  }
  if($("#events").get(0))
  {
    ko.applyBindings(viewModel,$("#events").get(0));
  }

}
);
$(function() {

  inittimepicker();
  initdatepicker();

});

function inittimepicker() {
  $(".timepicker-from").each( function() {
    $(this).val("05:00 AM");
    $(this).timepicker({defaultTime: 'value'});
  });

  $(".timepicker-to").each( function() {
    $(this).val("11:00 PM");
    $(this).timepicker({defaultTime: 'value'});
  });
}

function initdatepicker() {
  $(".dpicker").each(function () {

    var d = new Date();

    // set date
    if ($(this).hasClass('datepicker-tomorrow')) {
      d.setDate(d.getDate()+1);
      $(this).datepicker({format: 'yyyy-mm-dd'});
      $(this).datepicker('setValue', d);
    } else {
      $(this).datepicker({format: 'yyyy-mm-dd'});
      $(this).val(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());        
    }

    // attach hanlder to check the values that user picks
    if (!($(this).hasClass('datepicker-any'))) {
      $(this).datepicker()
      .on('changeDate', function(ev){
        if (ev.date.valueOf() < d.valueOf()) {
          if (ev.date.getFullYear() == d.getFullYear() &&
            ev.date.getDate() == d.getDate() &&
            ev.date.getMonth() == d.getMonth()) {
              // never mind, user picked today
          } else {
              // show error, that you cant choose in past
              $(this).datepicker('setValue', d);
              alert("Please choose an appropriate date.");
            }
          }
        });
    }
  });
}

