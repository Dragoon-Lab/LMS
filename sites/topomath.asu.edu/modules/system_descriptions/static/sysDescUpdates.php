<?php
$drp_root_handle=fopen("drupal_root","r");
$drupal_root = fgets($drp_root_handle);
fclose($drp_root_handle);
define('DRUPAL_ROOT', trim($drupal_root));
require_once "".DRUPAL_ROOT . "/includes/bootstrap.inc";
drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);
$request_type = $_REQUEST["req_type"];
take_action($request_type);

//All take actions require a working db connection
function take_action($case=" "){
	$section = isset($_REQUEST['s'])?$_REQUEST['s']:null;
	$folder_id = isset($_REQUEST['f'])?$_REQUEST['f']:null;
	$folder = "";
	if($folder_id){
		//retrieve folder id
		$fol_num_q = db_select('folders','f');
		$fol_num_q->fields('f', array('folder_num'));
		$fol_num_q->condition('folder_id',$folder_id);
		$fol_num_res = $fol_num_q->execute();
		$fol_num_ar = $fol_num_res->fetchAssoc();
		$folder = $fol_num_ar['folder_num'];
		
	}
	$prob = isset($_REQUEST['p'])?$_REQUEST['p']:null;
			
	switch ($case) {
		case "new_desc":
			//add the new description to data base from the input parameters
			$name = isset($_REQUEST['n'])?$_REQUEST['n']:null;
			$user = isset($_REQUEST['u'])?$_REQUEST['u']:null;;
			$path = isset($_REQUEST['path'])?$_REQUEST['path']:null;
			$type = isset($_REQUEST['desc_type'])?$_REQUEST['desc_type']:null;
			$q_res = $query=db_insert('system_descriptions')
				->fields(array(
					'sd_name' => ''.$name,
					'folder_num' => ''.$folder,
					'uid' => ''.$user,
					'sd_model' => ''.$prob,
					'sd_section' => ''.$section,
					'sd_path' => ''.$path,
					'sd_type' => ''.$type
				))->execute();				
			echo $q_res;
			break;
			
		case "refresh_list":
			//refreshes the list of descriptions to list to the user
			$return_list = array();
			$cond = db_and()->condition('folder_num',$folder)->condition('sd_model',$prob)->condition('sd_section',$section);
			$query = db_select('system_descriptions','sh')
					->fields('sh',array('sd_name','sd_path','sd_type'))
					->condition($cond)->execute();
			$desc_list = array();
			while($sds = $query->fetchAssoc()){
					//echo $sds["sd_name"]." : ".$sds["sd_path"].",";
					$desc_list[$sds["sd_name"]]["path"] = $sds["sd_path"];
					$desc_list[$sds["sd_name"]]["type"] = $sds["sd_type"];
				}
			print_r(json_encode($desc_list));	
			break;

		case "sds_assignments":
			$return_list = array();
			$cond = db_and()->condition('folder_num',$folder)->condition('sd_model',$prob)->condition('sd_section',$section);
			$query = db_select('system_descriptions','sh')
					->fields('sh',array('sd_name','sd_id'))
					->condition($cond)->execute();
			$desc_list = array();
			while($sds = $query->fetchAssoc()){
					//echo $sds["sd_name"]." : ".$sds["sd_path"].",";
					$desc_list[$sds["sd_id"]] = $sds["sd_name"];
				}
			print_r(json_encode($desc_list));	
			break;


		case "name_duplication":
			//checks if system description name is duplicate
			$sys_name = isset($_REQUEST['n'])?$_REQUEST['n']:null;
			$cond = db_and()->condition('folder_num',$folder)->condition('sd_name',$sys_name)->condition('sd_section',$section)->condition('sd_model', $prob);
			$check_q = db_select('system_descriptions','sh')->fields('sh',array('sd_name'))->condition($cond)->execute();
			//$check_q = "select * from folders where folder_id='$folder_id'";
			$row_count = $check_q->rowCount();
			//$row_count = $check_q_res->num_rows;
			if($row_count>0)
				echo 0;
			else
				echo 1;
			break;

		case "delete_sys_desc":
			//deletes the system description
			$path = isset($_REQUEST['path'])?$_REQUEST['path']:null;
			$query = db_delete('system_descriptions')->condition('sd_path', $path)->execute();
			if($query){
				echo "success";
				//delete the file in uploads directory
				unlink("/dragoon/lms/topomath-sysdesc-uploads/".$path);
			}else
				echo "fail";
			break;	
	}
}		
	