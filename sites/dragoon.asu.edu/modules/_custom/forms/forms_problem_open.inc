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

	$form['m'] = array(
		'#type' => 'radios',
		'#options' => array(
			'STUDENT&a=executionDemo' => t('Step through running the model'),
			'STUDENT&a=execution' => t('Run the model manually'),
			'COACHED&a=construction' => t('Reconstruct the model - Feedback on everything'),
			'STUDENT&a=construction' => t('Reconstruct the model - Feedback on entries and graphs'),
			'TEST&a=construction' => t('Reconstruct the model - Feedback on graphs only'),
			'EDITOR&a=construction' => t('Reconstruct the model - No feedback'),
			'AUTHOR&a=construction' => t('Edit the model'),
		),
		'#title' => t('Select a method to start Dragoon problem'),
		'#required' => TRUE,
		'#default_value' => 'COACHED&a=construction',
	);

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
