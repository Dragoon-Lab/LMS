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
		case "newDesc":
			//add the new description to data base from the input parameters
			$name = $_REQUEST['n'];
			$user = $_REQUEST['u'];
			$section = $_REQUEST['s'];
			$folder = $_REQUEST['f'];
			$prob = $_REQUEST['p'];
			$path = $_REQUEST['path'];
			$type = $_REQUEST['desc_type'];
			$q_res = $query=db_insert('system_descriptions')
				->fields(array(
					'sd_name' => ''.$name,
					'sd_folder' => ''.$folder,
					'sd_uname' => ''.$user,
					'sd_pname' => ''.$prob,
					'sd_section' => ''.$section,
					'sd_path' => ''.$path,
					'sd_type' => ''.$type
				))->execute();
			if(isset($_REQUEST['save_file']) && $_REQUEST['save_file'] == true){
				$text_info = $_REQUEST['c'];
				$file = "../uploads/".$path;
				file_put_contents($file, $text_info, FILE_APPEND | LOCK_EX);
				echo "file save success!";
			}
				
			return $q_res;
			break;

		case "updateDesc":
			//update the description, this case only has the source in ckeditor
			// technically path does not changes, so no database update, rather just update content in file
			$text_info = $_REQUEST['c'];
			$path = $_REQUEST['p'];
			$file = "../uploads/".$path;
			echo $file;
			file_put_contents($file, $text_info);
			echo "file update success!";
			break;

		case "refreshList":
			//refreshes the list of descriptions to list to the user
			$prob = $_REQUEST['p'];
			$section = $_REQUEST['s'];
			$folder = $_REQUEST['f'];
			$returnList = array();
			$cond = db_and()->condition('sd_folder',$folder)->condition('sd_pname',$prob)->condition('sd_section',$section);
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

		case "nameDuplication":
			//checks if system description name is duplicate
			$prob = $_REQUEST['p'];
			$section = $_REQUEST['s'];
			$folder = $_REQUEST['f'];
			$sysName = $_REQUEST['n'];
			$cond = db_and()->condition('sd_folder',$folder)->condition('sd_name',$sysName)->condition('sd_section',$section)->condition('sd_pname', $prob);
			$check_q = db_select('system_descriptions','sh')->fields('sh',array('sd_name'))->condition($cond)->execute();
			//$check_q = "select * from folders where folder_id='$folder_id'";
			$row_count = $check_q->rowCount();
			//$row_count = $check_q_res->num_rows;
			if($row_count>0)
				echo 0;
			else
				echo 1;
			break;

		case "deleteSysDesc":
			//deletes the system description
			$path = $_REQUEST['path'];
			echo $path;
			$query = db_delete('system_descriptions')->condition('sd_path', $path)->execute();
			if($query){
				echo "success";
				//delete the file in uploads directory
				unlink("../uploads/".$path);
			}
				else
					echo "fail";
			break;	
	}
}		
	