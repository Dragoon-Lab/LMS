<?php

if(isset($_REQUEST['sysupdate'])){
	$res = $_REQUEST['sysupdate'];
	if($res == "created"){
		echo "System description created succesfully";
	}
	else if($res == "updated"){
		echo "System description updated succesfully";
	}
}
else{
	echo "error! page not found";
}