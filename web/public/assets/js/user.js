function UserModel(data)
{
	this.account_id=ko.observable(data.id);
	this.uname=ko.observable(data.uname);
	this.number=ko.observable(data.number);
	this.address=ko.observable(data.address);
	this.email_id=ko.observable(data.email_id);
}
function UserViewModel()
{
	this.account_id=ko.observable();
	this.uname=ko.observable('');
	this.pas=ko.observable('');
	this.confirmpas=ko.observable('');
	this.message=ko.observable('');
	this.login=function()
	{
		var self = this;
    	$.get("/login",
				{user_name : self.uname(), pass : self.pas()},
				function(data)                                                  //data.status???
				{
					//document.getElementById("InvalidUser").style.visibility="hidden";
					if(data.status == 'not success')
					{
						document.getElementById("InvalidUser").style.visibility="visible";
					}
					else
					{
		                self.account_id(data.id);
						window.location.href="/loggedIn";                //req?? redirect
					}
				}
			  );
    };
    this.signout=function()
    {
    	var self = this;
        $.get('/signout',
				function(data)
               	{
                	if(data.status == "success")
                   	{
                   		window.location.href='/';
                   	}
                   	else
                   	{
                    	self.message("Sign Out Unsuccessful");
                   	} 
               	}
              );
     };
     this.signup = function()
     {
     	var self=this;
     	if(this.pas() == this.confirmpas())
    	{
    		$.post("/signup",
    	    		{user_name :self.uname(),pass : self.pas()},
    	      		function(data)
    	      		{
                  		if(data.error)
                  		{
                      		document.getElementById("InvalidUser").style.visibility="visible";
                      		self.message("Unable to create Account");
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
         	this.message("Passwords do not match!!");   
    	}
    	return false;
    };
}

$().ready(function()
			{
        		userViewModel = new UserViewModel();
				if($("#user").get(0))
				{
					ko.applyBindings(userViewModel,$("#user").get(0));
					}
				if($("#signInModal").get(0))
				{
					ko.applyBindings(userViewModel,$("#signInModal").get(0));
					}
				if($("#signUpModal").get(0))
				{
					ko.applyBindings(userViewModel,$("#signUpModal").get(0));
					}
			}
		);
	
