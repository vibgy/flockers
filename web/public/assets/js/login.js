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

