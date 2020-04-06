<?php
function user_assignment_reset_form($form, &$form_state){

	$form['#prefix'] = '<div><h1>Reset User Assignment</h1></div>';
	$form['#method'] = 'get';
  	$form['#action'] = 'http://localhost/topomath/www/index.php';
	$form['u'] = array(
		'#type' => 'textfield',
		'#title' => t('user name'),
		'#id' => 'reset_user_name',
		'#maxlength' => 33,
	);
	$form['s'] = array(
		'#type' => 'textfield',
		'#title' => t('Section'),
		'#id' => 'reset_user_name',
		'#maxlength' => 100,
	);
	$form['f'] = array(
		'#type' => 'textfield',
		'#title' => t('Folder'),
		'#id' => 'reset_user_name',
		'#maxlength' => 33,
	);

	$form['rp'] = array(
		'#type' => 'hidden',
		'#value' => true
	);

	$form['m'] = array(
		'#type' => 'hidden',
		'#value' => 'STUDENT'
	);

	$form['sub_but'] = array(
		'#type' => 'submit',
		'#value' => t('Reset User Problem'),
	);
	
	return $form;
}
function user_assignment_reset_form_submit($form, &$form_state){

}
/*
function user_preferences_handler_form_submit($form, &$form_state){
	// update the user preferences table
	global $user;
	$user_id = $user->uid;
	if($user_id != ""){
		$mul_cond = db_and()->condition('up_name','list_model_order')->condition('uid',$user_id);
		$get_sett_q = db_select('lms_user_preferences','lp')
					->fields('lp', array('up_value'))
					->condition($mul_cond)->execute();
		$rad_val = $form_state['values']['list_models_tree_order'];
		if($get_sett_q->rowCount() == 0){
			//setting does not exist already
			$insert_sett = db_insert('lms_user_preferences')
							->fields(array(
								"up_name" => 'list_model_order',
								"up_type" => 'display',
								"up_value" => $rad_val,
								"uid" => $user_id
								)
							)->execute();
			if($insert_sett == 1){
				drupal_set_message('Setting updated', 'status');
			}
			else{
				drupal_set_message('Failed', 'error');	
			}
						
		}
		else{
			$update_sett = db_update('lms_user_preferences')
							->fields(array(
									"up_value" => $rad_val
								)
							)->condition($mul_cond)->execute();
			if($update_sett == 1){
				drupal_set_message('Setting updated', 'status');
			}
			else{
				drupal_set_message('Failed', 'error');	
			}
		}
	}
	else
		drupal_set_message('Unknown', 'error');		
}

function get_current_model_list_order(){
	global $user;
	$user_id = $user->uid;
	if($user_id != ""){
		//get the default value
		$mul_cond = db_and()->condition('up_name','list_model_order')->condition('uid',$user_id);
		$get_sett_q = db_select('lms_user_preferences','lp')
					->fields('lp', array('up_value'))
					->condition($mul_cond)->execute();
		if($get_sett_q->rowCount() != 0){
			$get_sett_res = $get_sett_q->fetchAssoc();
			if($get_sett_res['up_value'] == 'alphabetic')
				return 'alphabetic';
		}

	}
	return 'default';
}
*/






