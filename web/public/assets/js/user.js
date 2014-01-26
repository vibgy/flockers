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
  this.sessionMessage=ko.observable('');

  this.setMessage = function(msg) {
    // NOTE: this is important to make it work with the fading for some reason
    this.sessionMessage(''); 
    this.sessionMessage(msg);
    setTimeout( function() {$("#sessionMsg").fadeOut(3000);}, 1000);
  }

  this.login = function()
  {
    var self = this;
      $.post("/login",
        {user_name : self.uname(), pass : self.pas()},
        function(data)                                                  //data.status???
        {
          //document.getElementById("InvalidUser").style.visibility="hidden";
          if(data.status == 'not success')
          {
            self.setMessage("Login failed. Please try again");
          }
          else
          {
            self.setMessage("Welcome to Flockers!");
            self.account_id(data.id);
            window.location.reload();
          }
        }
      );
    return false;
  };

    this.signout=function()
    {
      var self = this;
        $.post('/signout',
        function(data)
          {
            if(data.status == "success")
              {
                window.location.href='/';
              }
              else
              {
                self.setMessage("Sign Out Unsuccessful");
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
                          self.setMessage("Unable to create account :(");
                      }
                      else
                      {
                          self.setMessage("You are now ready to flock!!");
                      }
                }
                );
      }
      else
      {
          this.setMessage("Passwords do not match!!");   
      }
      return false;
    };
}

$().ready ( function() {
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
    if($("#sessionMsg").get(0))
    {
      ko.applyBindings(userViewModel,$("#sessionMsg").get(0));
    }        
  }
);

