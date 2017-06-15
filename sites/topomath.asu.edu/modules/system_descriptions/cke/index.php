<html>
	<head>
		<script src="jquery-3.1.1.min.js"></script>
		<script src="ckeditor/ckeditor.js"></script>
		<script src="ckeditor/adapters/jquery.js"></script>
		<script type="text/javascript" src="manage_ck.js"></script>
	</head>

	<body>
	<?php 
		//read input parameters and decide if the editor request is for new problem
		//if not retrieve the old problem to edit
		if(!isset($_REQUEST['edit'])){
			//call to open a new problem
			$pname = $_REQUEST['p'];
			$fname = $_REQUEST['f'];
			$sname = $_REQUEST['s'];
			$uname = $_REQUEST['u'];
			echo '<form action="#" method="post" id="new_desc_form">
					<div id="form_desc_name" style="margin-bottom: 20px;">
						System Description Name: <input type="text" name="file_name_html" id="sys_desc_name">
						<span id="desc_name_error" style="display: none; color: red">Please enter a valid system description name</span>
					</div>
					<div id="form_sys_desc" style="margin-bottom: 20px;">
						System Description:<textarea id="editor_test" name="editor_info"></textarea>		
						<script type="text/javascript">
							$( "textarea" ).ckeditor();
						</script>
						<span style="display: none; color: red" id="desc_content_error" >System description cannot be empty
						</span>
						
					</div>
					<input type="hidden" id="problem_name" value = "'.$pname.'" />
					<input type="hidden" id="folder_name" value = "'.$fname.'" />
					<input type="hidden" id="section_name" value = "'.$sname.'" />
					<input type="hidden" id="user_name" value = "'.$uname.'" />
					<button name="sub_but" id="add_desc_button" value="Update system description"> Add System Description 
					</button>
				</form>';
		}
		else{
			$upload_path = "../uploads/";
			$sd_path = $_REQUEST['sdp'];
			if(file_exists($upload_path.$sd_path)){
				$fc = json_encode(file_get_contents($upload_path.$sd_path),JSON_UNESCAPED_SLASHES);
				//echo $fc;
				echo '<form action="#" method="post" id="new_desc_form">
					<div id="form_desc_name" style="margin-bottom: 20px;">
						Update your system description here
					</div>
					<div id="form_sys_desc" style="margin-bottom: 20px;">
						System Description:<textarea id="editor_test" name="editor_info"></textarea>		
						<script type="text/javascript">
							$( "textarea" ).ckeditor();
							CKEDITOR.instances["editor_test"].setData('.$fc.' );
						</script>
						<span style="display: none; color: red" id="desc_content_error" >System description cannot be empty
						</span>
						
					</div>
					<input type="hidden" id="problem_path" value = "'.$sd_path.'"" />
					<button name="sub_but" id="update_desc_button" value="Update system description"> Update System Description 
					</button>
				</form>'; 	
			}
			else{
				echo "oops! the system description no longer exists";
			}
	
		}
	?>
	</body>
</html>