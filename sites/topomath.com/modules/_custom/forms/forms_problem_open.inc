<?php
function problem_form($form, &$form_state){
	global $user;
	$name = 'anonymous';
	$rp = 'on';
	if($user->uid){
		$name = $user->name;
		$rp = 'off';
	}

	$form['pname'] = array(
		'#type' => 'textfield',
		'#title' => t('Problem'),
		'#disabled' => TRUE,
	);
	/*
	$form['sys-desc-inp'] = array(
		'#type' => 'button',
		'#value' => 'System descriptions',
		'#id' => 'open_sysdescmodal',
		'#display' => 'none'
	);
	*/
	$form['m'] = array(
		'#type' => 'radios',
		'#options' => array(
			'AUTHOR&a=construction' => t('Edit the model'),
		),
		'#title' => t('Select a method to start Dragoon problem'),
		'#required' => TRUE,
		'#default_value' => 'AUTHOR&a=construction',
	);

	$form['p'] = array(
		'#type' => 'hidden',
	);

	$form['sm'] = array(
		'#type' => 'hidden',
		'#value' => 'feedback',
	);

	$form['u'] = array(
		'#type' => 'hidden',
		'#value' => $name,
	);

	$form['is'] = array(
		'#type' => 'hidden',
		'#value' => 'algebraic',
	);

	$form['s'] = array(
		'#type' => 'hidden',
		'#value' => 'public-login',
	);

	$form['rp'] = array(
		'#type' => 'hidden',
		'#value' => $rp,
	);
	
	$form['submit_button'] = array(
		'#type' => 'submit',
		'#value' => t('Open Problem'),
		'#id' => 'submit_button',
	);

	return $form;
}
