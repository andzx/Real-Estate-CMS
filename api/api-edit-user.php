<?php
require_once "class-authorize.php";
require_once "class-users.php";

//Start session and check if user is authorized
$authorize = new authorize;
$authorize->is_user_authorized();

//Check if user has permission to edit users
if($_SESSION["user_level"] != "super_admin")
{
	exit('{"status":"fail", "error":"Insufficient permissions"}');
}

//Check if request data was sent
if(!isset($_POST["request_data"]))
{
	exit('{"status":"fail", "error":"Invalid request data"}');
}

//Get the request data
$request_data = $_POST["request_data"];

//Initialize the object
$users = new users;
$users->read_file();
$users->edit_user($request_data);
$users->save_file();
$users->print_response("status_only");
?>