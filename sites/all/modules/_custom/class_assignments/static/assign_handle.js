/**
 * Created by RiteshSamala on 9/12/16.
 */
jQuery(document).ready(function($) {
	var action = $('#cardReader').text();
	var sd_path = $('#assignment_sd_path').text();
	var upload_dir = 'sites/topomath.asu.edu/modules/system_descriptions/uploads/';
	var form = document.forms['nonAuthData'];
	if(form){
		var url = $("#dragoon_url").val()+"index.php";
		form.setAttribute("action", url);
		form.setAttribute("target", "_blank");
		form.setAttribute("method", "POST");
		if(action == "nonAuthor"){
			console.log(form);
			form.submit();
		}
		else if(action == "Author"){
			$('#messageReader').html('creating Assignment...');
			$('#userOpenAuthorProb').modal('show');
			//Open a modal to take user destination folder where he wants to author his assignment
			//which is reflected in the group the model has to be saved
		}
	}
	$('#openAuthorAssign').on("click",function(){
		console.log($('#authorDest').val());
		var original_group = form["g"].value;
		if(original_group != null){
			var new_group = $('select[name=authorAssignSave]').val();
			var prob = form["p"].value;
			var user = form["u"].value;
			var copy_sec = "non-class-models";
			//copy a model to the new group before opening it
			//send an ajax request to the dragoon API to perform this copy

			$.ajax({
			type: "POST",
			url: $("#dragoon_url").val()+"global.php",
			data: {
				"t": "modelAction",
				"action": "copyModel",
				"src": original_group,
				"mod": prob,
				"dest": new_group,
				"user": user,
				"section": copy_sec
			},
			success: function (data) {
				console.log("copied", data);
				//location.reload();
			},
			error: function (data) {
				console.log("move failed", data);
				alert('something failed, please contact site admin');
				return;
			}
		});	
		}
		form["g"].value = $('select[name=authorAssignSave]').val();
		//f parameter is for topomath
		//TODO: a permanent solution for the use of different parameters
		form["f"].value = $('select[name=authorAssignSave]').val();
		//assignment problem has to be opened for authoring (as teacher wants this to be authoring assignment) in user selected folder and his non-class-models section
		form["s"].value = "non-class-models";
		console.log(form);
		form.submit();
	});

	$('#messageReader').html('Your problem has been opened in new tab. If no new tab appeared, disable popup blocking for this website and try again. To open the problem again, refresh this page or visit the link again.');
	if(sd_path){
		$('#messageReader').append("<br/>please check sd <a href='"+upload_dir+sd_path+"'>here</a>");
	}
});
