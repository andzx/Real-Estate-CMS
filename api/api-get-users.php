<?php
require_once "class-authorize.php";
require_once "class-users.php";

//Start session and check if user is authorized
$authorize = new authorize;
$authorize->is_user_authorized();

//Check if user has permission to retrieve users data
if($_SESSION["user_level"] != "super_admin")
{
	exit('{"status":"fail", "error":"Insufficient permissions"}');
}

//Create new user object and handle the request
$users = new users;
$users->read_file();
$users->get_users();
$users->print_response();
?>