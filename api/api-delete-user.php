<?php
require_once "class-authorize.php";
require_once "class-users.php";

//Start session and check if user is authorized
$authorize = new authorize;
$authorize->is_user_authorized();

//Check if user has permission to delete user data
if($_SESSION["user_level"] != "super_admin")
{
	exit('{"status":"fail", "error":"Insufficient permissions"}');
}

//Check if request data was sent
if(!isset($_POST["id"]))
{
	exit('{"status":"fail", "error":"Invalid id"}');
}

//Get request data
$id = $_POST["id"];

//Create a new users object and handle the request
$users = new users;
$users->read_file();
$users->delete_user($id);
$users->save_file();
$users->print_response("override_response_function");
?>