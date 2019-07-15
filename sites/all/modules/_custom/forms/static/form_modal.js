jQuery(document).ready(function($) {

	//'should_check_share' variable controls whether last second check should be performed whether the user is allowed
	//to open specific problem, it has to be false in case of public models, private models but true in case of 
	//shared models by other users
	var should_check_share = false;
	var form = document.forms['dragoon_problem_form'];
	var tutor = form["tutor_name"].value;
	console.log("tutor", tutor);
	var showForm = function(/* object */ event){
		var id = '#' + event.data.id;
		should_check_share = false;
		//hide the author mode radio and by default check student mode/immediate feedback mode
		$('input[type=radio]#edit-m-authoraconstruction').closest('div').hide();
		//by default check the student mode
		$('input[type=radio]#edit-m-studentaconstruction').prop('checked',true);

		//model library problems should have restart problem and lock nodes enabled by default
		enableRestart(true);
		enableLockNodes(true);
		if(tutor == "topo"){
			enableGiveParams(true);
			enableGiveSchemas(true);
			enableSkipUnits(true);
			setDefaults(true);
		}
		//model library problems should not have group "g" set, so remove the element from the form
		//same applies to "f" which depicts group(folder) incase of topomath
		if(form["g"] != undefined)
			form["g"].remove();
		if(form["f"] != undefined)
			form["f"].remove();
		//model library problems will not have system descriptions button
		$('#open_sysdescmodal').hide();
		//also make sure other fields like section are set to default values
		form["s"].value = "public-login";
		if(event.data.hasOwnProperty("update") && event.data.update == true){
			if(event.data.hasOwnProperty("value")){
				event.data.func(event);
			}
		}
	};

	var hideForm = function(/* object */ event){
		var id = '#' + event.data.id;
		if(event.data.hasOwnProperty("submit") && event.data.submit){
			event.data.func(event.data.formID);
		}
	};

	var enableRestart = function(/* status */ status){

		if(status){
			$('#rp_checkbox_container').show();
		}
		else{
			$('#rp_checkbox_container').hide();
		}
		//by default each time restart is enabled or disabled, uncheck the box and also set form rp value to off
		$('#rp_checkbox').prop('checked',false);
		form['rp'].value = "off";
	}

	var enableLockNodes = function(/* status */ status){
		if(status){
			$('#ln_checkbox_container').show();
		}
		else{
			$('#ln_checkbox_container').hide();
		}
		//by default each time lock nodes is enabled or disabled, uncheck the box and also set form fp value to off
		$('#ln_checkbox').prop('checked',false);
		form['fp'].value = "off";
	}

	var enableGiveParams = function(/* status */ status){
		if(status){
			$('#gp_checkbox_container').show();
		}
		else{
			$('#gp_checkbox_container').hide();
		}
		//by default each time lock nodes is enabled or disabled, uncheck the box and also set form fp value to off
		$('#gp_checkbox').prop('checked',false);
		form['gp'].value = "off";
	}

	var enableGiveSchemas = function(/* status */ status){
		if(status){
			$('#gs_checkbox_container').show();
		}
		else{
			$('#gs_checkbox_container').hide();
		}
		//by default each time lock nodes is enabled or disabled, uncheck the box and also set form fp value to off
		$('#gs_checkbox').prop('checked',false);
		form['gs'].value = "off";
	}

	var enableSkipUnits = function(/* status */ status){
		if(status){
			$('#su_checkbox_container').show();
		}
		else{
			$('#su_checkbox_container').hide();
		}
		//by default each time lock nodes is enabled or disabled, uncheck the box and also set form fp value to off
		$('#su_checkbox').prop('checked',false);
		form['su'].value = "off";
	}

	var setDefaults = function(/* status */ status){
		//make default changes to flags, this is dynamic and can change, enabling skip units and give params for topomath for summer
		$('#su_checkbox').prop('checked',status);
		form['su'].value =  status == true ? "on": "false";
		$('#gp_checkbox').prop('checked',status);
		form['gp'].value = status == true ? "on": "false";
	}

	var submitProblemsForm = function(){
		//before submission we need to perform a final sharing check just in case user has been disabled sharing after he has opened the dialog
		if(!should_check_share){
			doSubmit();
		}
		else{
			$.when(checkSharing(form["g"].value,form["u"].value)).done(function(share_check){
				if(share_check == '0'){
					$('#alertDisabledSharing').modal('show');
					return;
				} 
				doSubmit();
			});
		}
	};

	var doSubmit = function(){
		var date = Math.round(new Date().getTime()/1000);
			if(form.u && form.u.value.indexOf("anon") >= 0)
				form.u.value = "anon-"+ date.toString();
			form.setAttribute("action", $("#dragoon_url").val()+"index.php");
			form.setAttribute("target", "_blank");
			form.setAttribute("method", "POST");
			form.submit();
	};

	var updateProblemsForm = function(/* object */ event){
		var key = event.data.key;
		var values = [$("#"+event.target.id).attr('value'), $("#" + event.target.id).attr('key')];
		var keys = [];
		if(key.indexOf("&") >= 0){
			keys = key.split("&");
		} else {
			keys = [event.data.key];
		}

		for(index in keys){
			form[keys[index]].value = values[index];
		}
		//form.pname.value = "Rabbits";
	};

	var checkSharing = function(folder_id,user){
		return $.ajax({
			type: "POST",
			url: "sites/all/modules/_custom/NC_models/static/nonClassUpdates.php",
			data: {'folder_id': folder_id, 'req_type': 'checkSharing', 'user': user},
			success: function (data) {
				//console.log("success");
			},
			error: function (data) {
				//console.log("fail");
			}
		});
	};

	$('.dragoon_problem').click({
		id: "dragoon_problem_wrapper",
		update: true,
		func: updateProblemsForm,
		value: true,
		key: "p&pname"
	}, showForm);

	$('.dragoon_nc_problem').click(function(){
		//non class models should have have system descriptions button
		$('#open_sysdescmodal').show();
		var user = form["u"].value;
		var prob_name = $(this).text();
		if(prob_name != "No models"){
			var group_name = $(this).closest('.accordion').find('h2:first').text();
			if(group_name == "private"){
				group_name = user+"-private";
				should_check_share = false;
			}
			else{
				//group name might contain by keyword which indicates the actual owner
				//if there is no by key word user himself is the owner
				var local_shared_store = $('#local_shared_store').val();
				var local_shared_arr = local_shared_store.split("&");
				var get_group_owner = [];
				local_shared_arr.forEach(function(local_grp){
					if(local_grp!=""){
						var local_grp_ar = local_grp.split("=");
						get_group_owner[local_grp_ar[0].trim()] = local_grp_ar[1].trim();
					}
				});
				
				if(get_group_owner[group_name] !== undefined)
					group_name = get_group_owner[group_name].trim();
				else
					group_name = group_name + "-" + user;
				var owner = group_name.split("-");
				if(owner[1] == user)
					should_check_share = false;
				else
					should_check_share = true;
			}
		}
		form["pname"].value = prob_name;
		form["p"].value = prob_name;
		form["s"].value = "non-class-models";
		//in case author mode radio button is hidden, it has to be shown
		$('input[type=radio]#edit-m-authoraconstruction').closest('div').show();
		//author mode has to be the default value in case of non class models
		$('input[type=radio]#edit-m-authoraconstruction').prop('checked',true);
		//since default is author mode, restart problem and lock nodes should be hidden and disabled
		enableRestart(false);
		enableLockNodes(false);
		if(tutor == "topo"){
			enableGiveParams(false);
			enableGiveSchemas(false);
			enableSkipUnits(false);
			setDefaults(false);
		}
		// add "g" to the form as the public library models wont have a g in the form them selves, g indicates group
		//check if g is defined already and remove it from form before appending a new value
		if(form["g"] != undefined){
			form["g"].remove();
		}
		var hiddenGroupField = document.createElement("input");
		hiddenGroupField.setAttribute("type", "hidden");
		hiddenGroupField.setAttribute("name", "g");
		hiddenGroupField.setAttribute("value", group_name);
		form.appendChild(hiddenGroupField);
		
		//same applies to "f" param which indicats group(or folder) in case of topomath
		if(form["f"] != undefined){
			form["f"].remove();
		}
		var hiddenGroupField = document.createElement("input");
		hiddenGroupField.setAttribute("type", "hidden");
		hiddenGroupField.setAttribute("name", "f");
		hiddenGroupField.setAttribute("value", group_name);
		form.appendChild(hiddenGroupField);
	});

	$('#submit_button').click({
		id: "dragoon_problem_wrapper",
		submit: true,
		func: submitProblemsForm
	}, hideForm);

	$('#form_open_radios').change(function(){
		var mode_val = $("input[type='radio'][name='m']:checked").val();
		var mode_val_ar = mode_val.split("&");
		var mode = mode_val_ar[0];
		if(mode == "AUTHOR" || mode == "SEDITOR"){
			enableRestart(false);
			enableLockNodes(false);
			
			if(tutor == "topo"){
				enableGiveParams(false);
				enableGiveSchemas(false);
				enableSkipUnits(false);
				setDefaults(false);
			}
		}
		else{
			enableRestart(true);
			enableLockNodes(true);
			if(tutor == "topo"){
				enableGiveParams(true);
				enableGiveSchemas(true);
				enableSkipUnits(true);
				setDefaults(true);
			}
		}
	});

	$('#rp_checkbox').change(function(){
		var checked = $("input[name='rp_checkbox']:checked").val();
		if(checked)
			form["rp"].value = 'on';
		else
			form["rp"].value = 'off';
	});

	$('#ln_checkbox').change(function(){
		var checked = $("input[name='ln_checkbox']:checked").val();
		if(checked)
			form["fp"].value = 'on';
		else
			form["fp"].value = 'off';
	});

	$('#gs_checkbox').change(function(){
		var checked = $("input[name='gs_checkbox']:checked").val();
		if(checked)
			form["gs"].value = 'on';
		else
			form["gs"].value = 'off';
	});
	$('#gp_checkbox').change(function(){
		var checked = $("input[name='gp_checkbox']:checked").val();
		if(checked)
			form["gp"].value = 'on';
		else
			form["gp"].value = 'off';
	});
	$('#su_checkbox').change(function(){
		var checked = $("input[name='su_checkbox']:checked").val();
		if(checked)
			form["su"].value = 'on';
		else
			form["su"].value = 'off';
	});

});
