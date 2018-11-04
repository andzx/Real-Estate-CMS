<?php
	require_once "class-authorize.php";
	require_once "class-properties.php";

	//Start session
	$authorize = new authorize;
	$authorize->is_user_authorized();

	//Get the last property id
	$properties = new properties;
	$properties->read_file();
	//Check if notification data was requested also
	if(isset($_GET["data"]))
	{
		//Get the data too
		$data = $_GET["data"];
		$properties->get_last_property_id($data);
	}else{
		//Reply with just an id
		$properties->get_last_property_id();
	}
	$properties->print_response("custom_response");
?>