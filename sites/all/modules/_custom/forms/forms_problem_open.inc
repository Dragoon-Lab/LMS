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
		/*'#options' => array(
			'STUDENT&a=executionDemo' => t('Step through running the model'),
			'STUDENT&a=execution' => t('Run the model manually'),
			'COACHED&a=construction' => t('Reconstruct the model - Feedback on everything'),
			'STUDENT&a=construction' => t('Reconstruct the model - Feedback on entries and graphs'),
			'TEST&a=construction' => t('Reconstruct the model - Feedback on graphs only'),
			'EDITOR&a=construction' => t('Reconstruct the model - No feedback'),
			'AUTHOR&a=construction' => t('Edit the model'),
		),
		'#title' => t('Select a method to start Dragoon problem'),
		'#default_value' => 'COACHED&a=construction',*/
	);

	$mode_options = get_problem_open_options();
	foreach($mode_options as $option => $value){
		$form['m'][$option] = $value;
	}

	/*$form['m'] = array(
		'#type' => 'radios',
		'#options' => array(
			'AUTHOR' => t('Author'),
			'COACHED' => t('Coached (Maximum Feedback)'),
			'STUDENT' => t('Immediate Feedback'),
			'TEST' => t('Delayed Feedback'),
			'EDITOR' => t('No Feedback'),

		),
		'#title' => t('Select a mode: '),
		'#required' => TRUE,
		'#default_value' => 'COACHED',
        '#id' => 'openProbMode'
	);

	$form['a'] = array(
		'#type' => 'radios',
		'#options' => array(
			'construction' => t('Construction'),
			'execution' => t('Execution'),
			'executionDemo' => t('Demo of Execution'),
//			'incremental' => t('Incremental Analysis'),
//			'incrementalDemo' => t('Demo of Incremental Analysis'),
//			'waveform' => t('Waveform Selection'),
		),
		'#title' => t('Select an activity: '),
		'#required' => TRUE,
		'#default_value' => 'construction',
	);*/

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

	$form['uid'] = array(
		'#type' => 'hidden',
		'#value' => $user->uid,
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

	$form['fp'] = array(
		'#type' => 'hidden',
		'#value' => 'off',
	);

	$form['ln_checkbox'] = array(
		'#type' => 'checkbox',
		'#title' => t('Lock Nodes'),
		'#id' => 'ln_checkbox',
		'#prefix' => '<div id="ln_checkbox_container" class="element-hide">',
		'#suffix' => '</div>'
	);
	$form['gp'] = array(
		'#type' => 'hidden',
		'#value' => 'off',
	);
	$form['gp_checkbox'] = array(
		'#type' => 'checkbox',
		'#title' => t('Give parameters'),
		'#id' => 'gp_checkbox',
		'#prefix' => '<div id="gp_checkbox_container" class="element-hide">',
		'#suffix' => '</div>'
	);
	$form['gs'] = array(
		'#type' => 'hidden',
		'#value' => 'off',
	);
	$form['gs_checkbox'] = array(
		'#type' => 'checkbox',
		'#title' => t('Give Schema(DRT)'),
		'#id' => 'gs_checkbox',
		'#prefix' => '<div id="gs_checkbox_container" class="element-hide">',
		'#suffix' => '</div>'
	);
	$form['su'] = array(
		'#type' => 'hidden',
		'#value' => 'off',
	);
	$form['su_checkbox'] = array(
		'#type' => 'checkbox',
		'#title' => t('Skip Units'),
		'#id' => 'su_checkbox',
		'#prefix' => '<div id="su_checkbox_container" class="element-hide">',
		'#suffix' => '</div>'
	);

	$form['submit_button'] = array(
		'#type' => 'submit',
		'#value' => t('Open Problem'),
		'#id' => 'submit_button',
		'#prefix' => '<div class="mt-10" id="submit_but_container">',
		'#suffix' => "</div><div id='popup_blocker_alert_msg'>If the problem does not open, check to see if your browser's pop-up blocker has blocked it</div>", 
	);

	$tutor_name = get_tutor_name();
	$form['tutor_name'] = array(
		'#type' => 'hidden',
		'#value' =>	$tutor_name,
	);

	return $form;
}
