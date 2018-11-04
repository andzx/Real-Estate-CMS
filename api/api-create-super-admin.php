<?php
require_once "class-users.php";

//Check if request data was sent
if(!isset($_POST["request_data"]))
{
	exit('{"status":"fail","error":"Required data missing"}');
}

//Get request data
$request_data = $_POST["request_data"];

//Create new user object
$users = new users;
$users->read_file();

//If super admin is already setup fail
if($users->is_super_admin_setup()){
	print('{"status":"fail", "error":"Super admin is already setup"}');
}else{
	//Set a hard user level
	$user_level = "super_admin";
    //If super admin is not setup, set him up
	$users->create_user($request_data, $user_level);
	$users->save_file();
    print('{"status":"ok"}');
}
?>