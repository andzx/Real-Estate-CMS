<?php
require_once "class-users.php";

//Create a new users object
$users = new users;
$users->read_file();

//Check if super admin has been setup
if($users->is_super_admin_setup()){
	print('{"status":"ok"}');
}else{
	print('{"status":"fail", "error":"system setup required"}');
}
?>