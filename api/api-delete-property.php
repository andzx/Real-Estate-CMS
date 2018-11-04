<?php
require_once "class-authorize.php";
require_once "class-properties.php";

//Start session
$authorize = new authorize;
$authorize->is_user_authorized();

//Check if user has permission to delete data
if($_SESSION["user_level"] == "user")
{
	exit('{"status":"fail", "error":"Insufficient permissions"}');
}

//Check if id was sent
if(!isset($_POST["id"]))
{
	exit('{"status":"fail", "error":"Id required"}');
}

//Get id
$id = $_POST["id"];

//Create properties object
$properties = new properties;
$properties->read_file();
$properties->delete_property($id);
$properties->save_file();
$properties->print_response("override_response_function");
?>