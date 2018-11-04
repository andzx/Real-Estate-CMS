<?php
require_once "class-authorize.php";
require_once "class-users.php";

//Start session
$authorize = new authorize;
$authorize->is_user_authorized();

//Check if user has permission to perform the requested operation
if($_SESSION["user_level"] != "super_admin")
{
	exit('{"status":"fail", "error":"Insufficient permissions"}');
}

//Check if request data was sent
if(!isset($_POST["request_data"]))
{
	exit('{"status":"fail", "error":"Invalid request data"}');
}

//Get request data
$request_data = $_POST["request_data"];

//Create a new users object and handle the request
$users = new users;
$users->read_file();
$users->create_user($request_data);
$users->save_file();
$users->print_response("status_only");
?>