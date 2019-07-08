<?php
//define('DRUPAL_ROOT', '/Applications/XAMPP/htdocs/dragoon-lms');
$drp_root_handle=fopen("drupal_root","r");
$drupal_root = fgets($drp_root_handle);
fclose($drp_root_handle);
define('DRUPAL_ROOT', trim($drupal_root));
require_once "".DRUPAL_ROOT . "/includes/bootstrap.inc";
drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);

	$request_type = $_REQUEST["req_type"];
	takeAction($request_type);
	//All take actions require a working db connection
	function takeAction($case=" "){

		switch ($case) {
			case "create Folder":
				$owner = $_REQUEST["owner"];
				$folder = $_REQUEST["folder_name"];
				//indicates whether the folder is a non class folder or a class related folder
				//type 0 indicates a non class folder
				$type=0;
				$folder_id = $folder."-".$owner;
				$folder_class_id = $_REQUEST["class-id"];
				//current status indicates if the folder is shared or not, for private
				$current_status = $_REQUEST["sharing_status"];
				$q_res = $query=db_insert('folders')
				->fields(array(
					'folder_id' => ''.$folder_id,
					'folder_name' => ''.$folder,
					'owner' => ''.$owner,
					'folder_type' => ''.$type,
					'folder_class_id' => ''.$folder_class_id,
					'current_status' => ''.$current_status,
				))->execute();
				return $q_res;
				break;
				
			case "delete Folder":
				$owner = $_REQUEST["owner"];
				$del_folders = array();
				if(isset($_REQUEST["folders"])){
					$del_folders = $_REQUEST["folders"];
				}
				$del_models = array();
				if(isset($_REQUEST["models"])){
					$del_models = $_REQUEST["models"];
				}
				//folder deletion
				foreach($del_folders as $folder_id){
					//delete from folders table
					$query1 = db_delete('folders')
						->condition('folder_id',$folder_id)
						->execute();
					//$query1 = "delete from folders where folder_id='$folder_id'";
					//delete from shared_members
					$query2 = db_delete('shared_members')
						->condition('folder_id',$folder_id)
						->execute();
					//$query2 = "delete from shared_members where folder_id='$folder_id'";
					//$q_res2 = $mysqli->query($query2);

					//run both queries

					//connect to dragoon
					//run query which marks all sessions consisting of group = folder_id as deleted
					//run query which marks all sessions where problem name is model id and group = folder_id as deleted

				}

				//models and folder deletion from dragoon
				deleteModels($del_models,$del_folders);

				break;
			case "Share Folder":
				$owner = $_REQUEST["owner"];
				$folder = $_REQUEST["select_folder"];
				$user_list = $_REQUEST["sh_user_name"];

				//all inserts go into shared members table
				//owner has to be given sharing member_relation 1

				$owner_q=db_insert('shared_members')
					->fields(array(
						"member_name" => $owner,
						"folder_id" => $folder,
						"member_relation" => 1
					))->execute();
				//$owner_q = "insert into shared_members(member_name,folder_id,member_relation) values('$owner','$folder',1)";
				//$owner_q_res = $mysqli->query($owner_q);

				//member queries
				$users = explode("+",$user_list);
				foreach($users as $member){
					$user_name = explode(",",$member);
					$user_name = $user_name[0];
					$mem_q = db_insert('shared_members')
						->fields(array(
							"member_name" => $user_name,
							"folder_id" => $folder,
							"member_relation" => 0
						))->execute();
					//$mem_q= "insert into shared_members(member_name,folder_id,member_relation) values('$user_name','$folder',0)";
				}
				break;

			case "check Folder":
				$folder_id = $_REQUEST['folder_id'];
				$check_q = db_select('folders','f')->fields('f',array('folder_id'))->condition('folder_id',$folder_id)->execute();
				//$check_q = "select * from folders where folder_id='$folder_id'";
				$row_count = $check_q->rowCount();
				//$row_count = $check_q_res->num_rows;
				if($row_count>0)
					echo "already exists";
				else
					echo 1;
				break;

			case "deleteShareHolder":
				$folder_id = $_REQUEST["folder_id"];
				$user_name = $_REQUEST["user_id"];
				//retreive userid based on user name
				$user_query = db_select('users','u')
						->fields('u',array('uid'))
						->condition('name',$user_name)
						->execute();
				$ucount = $user_query->rowCount();
				//retrieve fol num based on folder id
				$fol_num_q =  db_select('folders','fo')
						->fields('fo',array('folder_num'))
						->condition('folder_id', $folder_id)
						->execute();
				$fol_row_count = $fol_num_q->rowCount();

				if($ucount > 0 && $fol_row_count > 0){
					$fol_det = $fol_num_q->fetchAssoc();
					$folder_num = $fol_det['folder_num'];
					$user_det = $user_query->fetchAssoc();
					$user_id = $user_det['uid'];
					$mul_cond = db_and()->condition('folder_num',$folder_num)->condition('uid',$user_id);
					$query = db_delete('shared_members')
							->condition($mul_cond)->execute();
					if($query)
						echo "success";
					else
						echo "fail";
					//deleting all shared users  for a particular folder will make it private
					//check the count of users who are shared a particular folder
					$cond = db_and()->condition('folder_num',$folder_num)->condition('member_relation',0);
					$final_del = db_select('shared_members','sh')
								->fields('sh',array('shared_id'))
								->condition($cond)->execute();
					if($final_del->rowCount()==0){
						$sh_q = db_update('folders')
								->fields(array(
									'current_status' => 0,
								))
								->condition('folder_id',$folder_id)
								->execute();
					}
				}
				break;

			case "validateSharedHolder":
				$user_email = $_REQUEST["user_email"];
				$folder_id = $_REQUEST["folder_id"];
				$query = db_select('users','u')
						->fields('u',array('uid','name'))
						->condition('mail',$user_email)
						->execute();
				$count = $query->rowCount();
				if($count>0){
					$udet = $query->fetchAssoc();
					$userid= $udet['uid'];
					//get folder num based on id
					$fol_num_q =  db_select('folders','fo')
						->fields('fo',array('folder_num'))
						->condition('folder_id', $folder_id)
						->execute();
					$fol_row_count = $fol_num_q->rowCount();
					if($fol_row_count > 0){
						$fol_det = $fol_num_q->fetchAssoc();
						$folder_num = $fol_det['folder_num'];
						$cond = db_and()->condition('uid',$userid)->condition('folder_num',$folder_num);
						$query2 = db_select('shared_members','sh')
								->fields('sh',array('shared_id'))
								->condition($cond)->execute();
						$isExist = $query2->rowCount();
						if($isExist>0)
							echo "duplicate";
						else{
							//sharing status of the folder has to be updated
							$sh_q = db_update('folders')
									->fields(array(
										'current_status' => 1,
									))
									->condition('folder_id',$folder_id)
									->execute();
							//then the users have to be shared the current folder
							$mem_q = db_insert('shared_members')
									->fields(array(
										"uid" => $userid,
										"folder_num" => $folder_num,
										"member_relation" => 0
										))->execute();
							if($mem_q){
								$userName = $udet['name'];
								echo "success"."-".$userName;
							}
						}
					}
				}
				else
					echo "fail";
				break;

			case "getUserList":
				$folder_id = $_REQUEST["folder_id"];
				$fol_num_q =  db_select('folders','fo')
						->fields('fo',array('folder_num'))
						->condition('folder_id', $folder_id)
						->execute();
				$fol_row_count = $fol_num_q->rowCount();
				if($fol_row_count > 0){
					$fol_det = $fol_num_q->fetchAssoc();
					$folder_num = $fol_det['folder_num'];
					$cond = db_and()->condition('folder_num',$folder_num)->condition('member_relation',0);
					$query = db_select('shared_members','sh')
							->fields('sh',array('uid'))
							->condition($cond)
							->execute();
					while($users = $query->fetchAssoc()){
						$user_id = $users['uid'];
						$query2 = db_select('users','u')
								  ->fields('u',array('mail','name'))
						  		  ->condition('uid',$user_id)->execute();
						$userdet = $query2->fetchAssoc();
						$userName = $userdet['name']; 
						$userMail = $userdet['mail'];
						echo $userName."-".$userMail.",";
					}
				}
				break;

			case "checkSharing":
				$folder_id = $_REQUEST["folder_id"];
				$user_name = $_REQUEST["user"];
				//echo $folder_id.",".$user_name;
				$mul_cond = db_and()->condition('folder_id',$folder_id)->condition('member_name',$user_name)->condition('member_relation',0);
				$query = db_select('shared_members','sh')
						->fields('sh',array('member_name'))
						->condition($mul_cond)->execute();
				$count = $query->rowCount();
				echo $count;
				//echo "count is".$count;
				break;

			case "renameFolder":
				$old_folder_id = $_REQUEST["old_folder_id"];
				$new_folder_id = $_REQUEST["new_folder_id"];
				$new_folder_name = $_REQUEST["new_folder_name"];

				$query =  db_update('folders')
					->fields(array(
						'folder_id' => $new_folder_id,
						'folder_name' => $new_folder_name,
					))
					->condition('folder_id',$old_folder_id)
					->execute();

				$query2 =  db_update('shared_members')
					->fields(array(
						'folder_id' => $old_folder_id,
					))
					->condition('folder_id',$new_folder_id)
					->execute();
				if(function_exists('renameExtension')){
					//renameExtension function handles the additional functionality to be added in each of the sites
					$query3 = renameExtension($old_folder_id,$new_folder_id);
				}else{
					$query3 = true;
				}
				if($query && $query2 && $query3)
					echo "success";
				else
					echo "fail";
				break;
	
			case "modelAction":
				$src = $_REQUEST["src"];
				$dest = $_REQUEST["dest"];
				$action = $_REQUEST["action"];
				
				if(function_exists('copyMoveExtension')){
					//copyMoveExtension function handles the additional functionality to be added in each of the sites
					copyMoveExtension($src,$dest,$action);
				}
				break;    
		}
	}

	function deleteModels($del_models,$del_folders){
		$url = get_path()['url'].'/global.php';
		$data = array('t' => 'deleteNonClassProblems', 'dm' => $del_models, 'df' => $del_folders);
		$options = array(
			'http' => array(
				'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
				'method'  => 'POST',
				'content' => http_build_query($data)
			)
		);
		$context  = stream_context_create($options);
		$result = file_get_contents($url, false, $context);
		if ($result === FALSE) { /* Handle error */
			echo "something failed";
		}
		print_r($del_folders);
		print_r($del_models);
	}
