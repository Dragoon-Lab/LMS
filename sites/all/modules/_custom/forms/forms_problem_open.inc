<?php
function problem_form($form, &$form_state){
	global $user;
	$name = 'anonymous';
	if($user->uid){
		$name = $user->name;
	}

	$form['pname'] = array(
		'#type' => 'textfield',
		'#title' => t('Problem'),
		'#disabled' => TRUE,
		'#weight' => '-6' //provided weight to adjust relative elements
	);

	$form['m'] = array(
		'#type' => 'radios',
		'#id' => 'form_open_radios',
		'#required' => TRUE,
	);

	$mode_options = get_problem_open_options();
	foreach($mode_options as $option => $value){
		$form['m'][$option] = $value;
	}
	
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
		'#value' => 'off',
	);

	$form['rp_checkbox'] = array(
		'#type' => 'checkbox',
		'#title' => t('Restart problem'),
		'#id' => 'rp_checkbox',
		'#prefix' => '<div id="rp_checkbox_container" class="element-hide">',
		'#suffix' => '</div>'
	);

	$form['submit_button'] = array(
		'#type' => 'submit',
		'#value' => t('Open Problem'),
		'#id' => 'submit_button',
		'#prefix' => '<div class="mt-10" id="submit_but_container">',
		'#suffix' => "</div><div id='popup_blocker_alert_msg'>If the problem does not open, check to see if your browser's pop-up blocker has blocked it</div>", 
	);

	return $form;
}
