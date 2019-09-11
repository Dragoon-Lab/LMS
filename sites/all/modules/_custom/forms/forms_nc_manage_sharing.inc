<?php
function forms_nc_sharing($form, &$form_state){
	global $user;
	$name = 'anonymous';
	$user_mail = 'anonymous';
	$rp = 'on';
	if($user->uid){
		$name = $user->name;
		$user_mail = $user->mail;
		$rp = 'off';
	}

	//call a function which returns all potential folders user model can be created in
	$user_det = array('uid' => $user->uid, 'uname' => $user->name);
	$user_folders = loadUserFolders($user_det);
	unset($user_folders[$name . "-private"]);
	$form['Major_header'] = array(
		'#markup' => '<ul class="nav nav-tabs">
  						<li class="active"><a data-toggle="tab" href="#shMyFolder">Share My Folder</a></li>
  						<li><a data-toggle="tab" href="#lvShFolder">Leave Shared Folder</a></li>
					</ul>
					<div class="tab-content">
						<div id="shMyFolder" class="tab-pane fade in active">',
	);
	$form['select_folder'] = array(
		//pump folder options including the user personal folder
		'#type' => 'select',
		'#options' => $user_folders,
		"#id" => 'folder_list'
	);

	$share_holders = loadShareHolders(current($user_folders),$name);
	$form['relevant_users'] = array(
		'#markup' => '<div class="sharedUsersList">
						<header><b>Who has access</b></header>
						<table id="shareHoldersList">
						'.$share_holders.'
						</table>
					</div>',
	);
	$form['sh_user_name'] = array(
		'#prefix' => '<div class="row new_user_sharing_block"><div class="col-md-6"><header><b>Share Folder With New User</b></header>',
		'#type' => 'textfield',
		'#id' => 'share_user_name',
		'#title' => 'Enter email here',
		'#REQUIRED' => TRUE,
		'#suffix' => '</div><div class="col-md-6"><button id="shareAuser" class="btn btn-success">Share Folder</button></div></div>',
	);
	$form['sh_support_div'] = array(
		'#markup' => '<div id="user_list_display"></div>',
	);
	$form['req_type'] = array(
		"#type" => "hidden",
		"#value" => "Share folder"
	);
	$form['owner'] = array(
		"#type" => "hidden",
		"#value" => $name
	);
	$form['selfEmail'] = array(
		'#type' => "hidden",
		"#value" => $user_mail
	);
	$form['selfId'] = array(
		'#type' => "hidden",
		'#value' => $user->uid
	);
	//Get All Folders shared with user
	$sharedWithUserList = loadOthersSharedFolders($user_det);
	$form['second_tab'] = array(
		'#markup' => '</div><div id="lvShFolder" class="tab-pane fade">
  						',
	);
	if(sizeof($sharedWithUserList) > 0){
		$form['select_others_folder'] = array(
			//pump folder options including the user personal folder
			'#type' => 'select',
			'#options' => $sharedWithUserList,
			"#id" => 'others_folder_list'
		);

		$form['leave_button'] = array(
			'#type' => 'button',
			'#value' => 'Leave Folder',
			'#id' => 'leaveFolder'
		);
	}
	else{
		$form['empty_shared_list_message'] = array(
			//Write a message to indicate no folders are shared
			'#markup' => 'Nobody has shared a folder with you yet'
		);
	}
	
	$form['end_second_tab'] = array(
		'#markup' => '</div>',
	);


	$form['submit_button'] = array(
		'#type' => 'submit',
		'#value' => t('Done'),
		'#id' => 'shareDone'
	);


	return $form;
}
