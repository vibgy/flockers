function login(user,pas)
{
    $.post("/login",
          {user_name : user, pass : pas},
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
                 $.get('/loggedIn');
             }
	  }
          );  
    return false;
}
function signup(user,pas,confirmpas)
{
    if(pas==confirmpas)
    {
    	$.post("/signup",
    	      {user_name :user,pass :pas},
    	      function(data)
    	      {
    	      document.getElementById("SuccessfulSignup").style.visibility="visible";
    	      }
    	      );
    }
    else
    {
    alert("Password does not match");
    }
    return false;
}

