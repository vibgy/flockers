function flock()
    {
  	
    document.getElementById("flocker").innerHTML = '<div>'+
  	 '<form name="myForm" class="form-horizontal" role="form" onsubmit="return valid_form()">'+
  	 '<div class="form-group">'+'<label for="inputEmail3" class="col-sm-2 control-label">Email</label>'+
  	 '<div class="col-sm-4">'+
  	 '<input name="Email" type="email" class="form-control" id="inputEmail3" placeholder="Email">'+
  	 '</div>'+
  	 '</div>'+
  	 '<div class="form-group">'+
  	 '<label for="inputPassword3" class="col-sm-2 control-label">Password</label>'+
  	 '<div class="col-sm-4">'+
  	 '<input name="Password" type="password" class="form-control" id="inputPassword3" placeholder="Password">'+
  	 '</div>'+
  	 '</div>'+
  	 '<div class="form-group">'+
  	 '<label for="confirmPassword3" class="col-sm-2 control-label">Comfirm Password</label>'+
  	 '<div class="col-sm-4">'+
    '<input name="ConfirmPassword" type="password" class="form-control" id="confirmPassword3" placeholder="Confirm Password">'+
  	 '</div>'+
  	 '</div>'+
  	 '<div class="form-group">'+
  	 '<div class="col-sm-offset-2 col-sm-10">'+
  	 '<div class="checkbox">'+
  	 '<label>'+
  	 '<input type="checkbox"> Remember me'+
  	 '</label>'+
  	 '</div>'+
  	 '</div>'+
  	 '</div>'+
    '<div class="form-group">'+
    '<div class="col-sm-offset-2 col-sm-10">'+
    '<button type="submit" class="btn btn-default" onclick="return insert(Email.value,Password.value,ConfirmPassword.value)">Sign Up</button>'+
    '</div>'+
    '</div>'+
    '</form>'+
    '</div>';
  }
 function insert(nme,pwd,pwd1)
 {
    if(pwd==pwd1){
    $.post("/insert",{ffname:nme,ppwd:pwd,ppwd1:pwd1},function(data){ 
    //here data is variable that is coming from back 
    alert("You have signed up successfully");
    });
    }
    else{
    alert("Password does not match");
    }
    return false;
}
function insert1(ename,dat,tim,fees,prze,plac,descrption)
 {
    $.post("/insrt",{eename:ename,ddat:dat,ttim:tim,ffees:fees,pprze:prze,pplac:plac,ddescrption:descrption},function(data){ 
    //here data is variable that is coming from back 
    alert("Event has Created Successfully");
    });
    return false;
}
