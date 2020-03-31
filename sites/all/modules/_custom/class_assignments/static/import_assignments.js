/**
 *
 */
jQuery(document).ready(function($) {
	$('#import_assignments_btn').on("click", function(){
		$('#importAssignmentsModal').modal('show');
		//empty the class code input
		//also disable the import button
		$('#importAssign_source_class').val('');
		$('#class_code_error_dp').html('');
		$('#import_assignments_btn_2').prop('disabled', true);
	});

	$('#importAssign_source_class').on("keyup", function(){
		var code_inp_val = $('#importAssign_source_class').val();
		var isValid = isClassCodeValid(code_inp_val);
		if(!isValid.valid){
			$('#class_code_error_dp').html('<b>'+isValid.message+'</b>')
			$('#import_assignments_btn_2').prop('disabled', true);
		}
		else{
			$('#class_code_error_dp').html('');
			$('#import_assignments_btn_2').prop('disabled', false);
				
		}
	})

	function isClassCodeValid(/*string*/ code){
		
		//Number and code length check
		var classCodeLen = 4; //This can be changed
		if(!isNaN(code) || code.length != classCodeLen){
			return {
				valid: false,
				message: "Invalid Class Code, please note that the code is a 4 letter word"
			}
		}

		//same class checks
		var cur_url = window.location.href;
		cur_class = cur_url.split("class/");
		cur_class = cur_class[1].trim();
		var isDuplicate = code == cur_class ? true : false;
		if(isDuplicate){
			return {
				valid: false,
				message: "You cannot copy assignments from your own class"
			}
		}

		//class exist checks
		var classExists = false;
		
		var copySuccesful = false;
		//write  a back end
		if(classExists && copySuccesful){
			return {
				valid: true,	
			}
		}
		return {valid: true};
	}
});