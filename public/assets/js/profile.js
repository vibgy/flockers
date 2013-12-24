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
    this.description = ko.observable(data.desription);
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
}

eventViewModel = new EventViewModel();

$().ready(function() {

    ko.applyBindings(eventViewModel);
});


