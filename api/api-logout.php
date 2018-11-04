<?php
require_once "class-authorize.php";

//Create new authorization object
$auth = new authorize;
$auth->logout();
print('{"status":"ok"}');
?>