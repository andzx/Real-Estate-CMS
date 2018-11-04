<?php
require_once "class-users.php";

//Check if request data was sent
if(!isset($_POST["request_data"]))
{
	exit('{"status":"fail","error":"Request failure"}');
}

//Get user data from request
$request_data = $_POST["request_data"];

//Set a hard user level for the newly registered user
$user_level = "user";

//Create a new user
$users = new users;
$users->read_file();
$users->create_user($request_data, $user_level);
$users->save_file();
$users->print_response("status_only");
?>