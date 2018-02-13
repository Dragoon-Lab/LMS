<?php
function user_preferences_handler_form($form, &$form_state){

	$form['#prefix'] = '<div><h1>Display Settings</h1></div>';
	
	$form['list_models_tree_order'] = array(
			'#type' => 'radios',
			'#title' => t('Choose what order to list models in their folders'),
			'#options' => array(
				'default' => t('By most recently created'),
				'alphabetic' => t('By alphabetical order'),
			),
			'#default_value' => get_current_model_list_order(),
			'#prefix' => '<div id="list_models_tree_order_div" class="mt-10">',
			'#suffix' => '</div>'
		);

	$form['sub_but'] = array(
		'#type' => 'submit',
		'#value' => t('Update settings'),
		'#attributes' => array(
			'id' => 'update_user_pref_but',
		),
		'#submit' => array('user_preferences_handler_form_submit'),
		'#prefix' => '<div id="user_preferences_submit_div" class="mt-10">',
		'#suffix' => '</div>'

	);
	
	return $form;
}

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







