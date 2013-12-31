var eventViewModel;

var emptyEvent = new function() {
    this.id = "";
    this.ename = "";
    this.date = "";
    this.time = "";
    this.place = "";
    this.organizer = "";
    this.fees = "";
    this.prize = "";
    this.description = "";
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

    this.message = ko.observable('');
    this.DeleteEvent=function(){
          var self=this;
          $.post("/delete",
          {event_id : this.id()},
          function(data)
          {
              data = JSON.parse(data);
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
    
    this.deleteParticipateEvent = function() {
   
    var self=this;
          $.post("/deleteParticipationEvent",
          {event_id : this.id()},
          function(data)
          {
              data = JSON.parse(data);
              if(data.status == 'not_success')
              {
                   self.message("Event Cannot be Deleted");
              }
              else
              {
                   var oldevent = ko.utils.arrayFirst(eventViewModel.participationEvents(),
                                                     function(item){
                                                         return item.id() == self.id(); 
                                                     });
                   eventViewModel.participationEvents.remove(oldevent);
                   self.message("Event Deleted Successfully");
              }
          });
       
       };

    this.createEvent = function(event){
    var self = this;
        $.post('/createEvent',
               {event : event},
                function(data){
                    eventViewModel.message("Event Created Successfully");
                    eventViewModel.myEvents.push(self);
                }
                );
    }

}
function EventViewModel() {

    this.event = ko.observable({});
    this.createEventState = false;
    this.message = ko.observable('');
    this.myEvents = ko.observableArray();
    this.searchEvents = ko.observableArray();
    this.topEvents = ko.observableArray();
    this.createEventFlag = ko.observable(false);
    this.participationEvents = ko.observableArray();

    this.createEvent = function()
    {
        var newEvent = new EventModel(emptyEvent);
        this.createEventState = true;
        this.event(newEvent);
    };

    this.createEventHelper = function()
    {
        this.event().createEvent(JSON.parse(ko.toJSON(this.event())));
    };
    

    this.showMyEvents = function(){
        var event = {};
        this.reset();
        var self = this;
        $.get(
            '/myEvents.json',
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
              self.myEvents(events);
            });
    };

    this.signOut = function(){
        
        var self = this;
        $.post('/signout',
               function(data)
               {
                   data = JSON.parse(data);
                   if(data.status == 'success')
                   {
                       window.location.href = '/home';
                   }
                   else
                   {
                       self.message("Sign Out Unsuccessful");
                   } 
               });
    }

    this.showParticipationEvents = function(){
        var event = {};
        this.reset();
        var self = this;
        $.get(
            '/participationID.json',
            function(data){
              data = JSON.parse(data);
              if(data.status=='Failure'){
              self.message("No such events");    
            }
            else
            {
                var e=$.map(data,function(item){return item.event_id});
                $.post(
              		'/participationEvents.json',
              		{'event' : e},
              		function(data){
              		//alert(data);
              		data=JSON.parse(data);
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
		      self.participationEvents(events);
		    });
            }
    });
    };

    this.searchEventHelper = function(data)
    {
        this.event().ename = data;
        this.createEventFlag(true);
        this.searchEvent();
    };

    this.searchEvent = function() {
        var self = this;
        var SEvent={};
        this.reset();
        $.post('/search',
             {record : this.event().ename},
             function(data)
             {
                 data = JSON.parse(data);
                 if(data.status == 'Failure')
                 {
                     self.message("No Matches Found,You Can Create One");
                     //document.getElementById("CreateEvent").style.visibility="visible";
                     self.createEventFlag(true);
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
                         return new EventModel(SEvent);
                     });
                     self.searchEvents(SEvents);
                 }
            }); 
        };

    this.getTopEvents = function(){

        var uniqueEvents = new Array(); 
        var self = this;   
        $.get('/events',
              function(data)
              {
                   data = JSON.parse(data);
                   for(var i = 0 ; i < data.length; i++)
                   {
                       var index = isUnique(data[i].ename,uniqueEvents);
                       if(index == -1)
                       {
                            uniqueEvents.push({event : data[i].ename, count :1});
                       }
                       else
                       {
                           uniqueEvents[index].count = (uniqueEvents[index].count)+1;                         

                       }
                   }
                   uniqueEvents.sort(compare);
                   for( var i = 0 ; i < 5 && i < uniqueEvents.length  ; i++)
                   {
                       self.topEvents.push({event : uniqueEvents[i].event});
                   }
                   
              });

    };

    this.init = function() {

        this.getTopEvents();
    }

    this.reset = function(){
  
        this.myEvents.removeAll();
        this.searchEvents.removeAll();
        this.participationEvents.removeAll();
        this.message('');
        this.createEventFlag(false);
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

eventViewModel = new EventViewModel();

$().ready(function() {
    
    ko.applyBindings(eventViewModel);
    eventViewModel.init();
});


