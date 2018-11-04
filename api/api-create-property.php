<?php
require_once "class-authorize.php";
require_once "class-properties.php";

//Start session
$authorize = new authorize;
$authorize->is_user_authorized();

//Get user level
if($_SESSION["user_level"] == "user")
{
	exit('{"status":"fail", "error":"Insufficient permissions"}');
}

//Check if request data was sent
if(!isset($_POST["request_data"]))
{
	exit('{"status":"fail", "error":""}');
}

//Check if the map location is a valid address
$data_array = json_decode($_POST["request_data"]);
$address = $data_array->address;

//Query the google maps api
$api_response = file_get_contents("https://maps.googleapis.com/maps/api/geocode/json?address=". urlencode($address) .",+DK&key=AIzaSyDC4vZI18p4OfviF3AIJFMmVy0PsrktS7E");
$map_results = json_decode($api_response);

//****************************************//
//Bug*************************************//
//Some strange addresses are also geocoded//
//****************************************//

//Check if location is valid
if($map_results->status != "OK")
{
    exit('{"status":"fail", "error":"Invalid location"}');
}

//Store the images
//Store image names variable
$image_names = [];

//Run through the files that have been sent
for($i=0;$i<sizeof($_FILES);$i++)
{
	$j = $i + 1;
	$image_name = "image_" . $j;

	//Get image size to see if its an image
	$image_size = getimagesize($_FILES[$image_name]["tmp_name"]);
    
    //Check if an image is being uploaded
    if(!$image_size[0]){
        exit('{"status":"fail", "error":"Invalid image"}');
    }

	move_uploaded_file($_FILES[$image_name]["tmp_name"], "../images/" . $_FILES[$image_name]["name"]);
	//Store image name
	$image_names[] = $_FILES[$image_name]["name"];
}

//Get request data
$request_data = $_POST["request_data"];

//Create properties object
$properties = new properties;
$properties->read_file();
$properties->create_property($request_data, $image_names);
$properties->save_file();
$properties->print_response("custom_response");
?>