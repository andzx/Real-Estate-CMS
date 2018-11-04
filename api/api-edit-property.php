<?php
require_once "class-authorize.php";
require_once "class-properties.php";

//Start session and check if user is authorized
$authorize = new authorize;
$authorize->is_user_authorized();

//Check if user has permission to edit properties
if($_SESSION["user_level"] == "user")
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
$properties = new properties;
$properties->read_file();
$properties->edit_property($request_data);
$properties->save_file();
$properties->print_response("status_only");
?>