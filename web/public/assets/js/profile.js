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
          var oldevent = ko.utils.arrayFirst(eventViewModel.myEvents(),function(item){
          return item.id() == self.id(); 
          }
          );
          eventViewModel.myEvents.remove(oldevent);
          self.message("Event Deleted Successfully");
          }
          }
          );
       
       };
}
function EventViewModel() {

    this.event = ko.observable({});
    this.createEventState = false;
    this.message = ko.observable('');

    this.createEvent = function()
    {
        var newEvent = new EventModel(emptyEvent);
        this.createEventState = true;
        this.event(newEvent);
    };

    this.createEventHelper = function()
    {
        var self = this;
        $.post('/createEvent',
               { event : this.event()},
                function(data){
                    self.message("Event Created Successfully");
                }
                );
    };

    this.myEvents = ko.observableArray();
    this.showMyEvents = function(){
        var event = {};
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
}

eventViewModel = new EventViewModel();

$().ready(function() {
    
    ko.applyBindings(eventViewModel);
});


