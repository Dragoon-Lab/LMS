<?php

function get_code($size = 4){
	//$size = 4;
	$code = '';
	$characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	srand(time());
	for($index = 0; $index < $size; $index++){
		$code .= substr($characters, rand()%62, 1); 
	}

	return $code;
}
