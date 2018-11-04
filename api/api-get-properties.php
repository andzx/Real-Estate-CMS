<?php
require_once "class-authorize.php";
require_once "class-properties.php";

//Start session and check if user is authorized
$authorize = new authorize;
$authorize->is_user_authorized();

//Create the properties object and handle the request
$properties = new properties;
$properties->read_file();
$properties->get_properties();
$properties->print_response();
?>