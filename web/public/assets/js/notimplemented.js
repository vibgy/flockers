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
		    		event = item;
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
		      		participant = item;
		      		return new UserModel(participant);
		    		});
		    		self.topParticipants(participants);
		 	 		}
	  		);
 			}
	 	);  
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

