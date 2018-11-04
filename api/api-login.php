<?php
require_once "class-authorize.php";
require_once "class-users.php";

//Determine if super admin was setup, if not
//don't allow any logins into the system
$users = new users;
$users->read_file();
if(!$users->is_super_admin_setup())
{
	exit('{"status":"fail", "error":"Authorization failure"}');
}

//Check if credentials were sent
if(!isset($_POST["credentials"]))
{
	exit('{"status":"fail", "error":"Authorization failure"}');
}

//Get users credentials
$credentials = $_POST["credentials"];

//Create new authorization object
$auth = new authorize;
$auth->login($credentials);
$auth->print_response();
?>