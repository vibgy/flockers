function login(user,pas)
{
    $.post("/login",
          {user_name : user, pass : pas},
          function(data)
          {
             data = JSON.parse(data);
             if(data.status == 'not success')
             document.getElementById("InvalidUser").style.visibility="visible";
             else
             document.getElementById("Welcome").style.visibility="visible";
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

