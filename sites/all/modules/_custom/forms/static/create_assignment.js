jQuery(document).ready(function($) {
	var form = document.forms['create_assignment_form'];
	var tutor = form["tutor_name"].value;
	var submitForm = function(){
		if(form.create_session.value){
			var g = form.g && form.g.value ? form.g.value : "";
			var result = createSession(form.p.value, form.s.value, g, form.aname.value);
			form.create_session.value += result;
		}
		form.submit();
	};

	var showForm = function(event){
		form.s.value = $("#section").val();
		var id = "#" + event.target.id;
		form.problem.value = $(id).attr('key');
		form.pname.value = $(id).attr('key');

		form.p.value =$(id).attr('value');
		form.cc.value = $('#code').val();
		if($(event.target).attr("class").indexOf("nc") > -1){
			updateGroup(event);
			form.create_session.value = true;
		} else {
			form.create_session.value = false;
		}
		enableLockNodes(false);
		if(tutor == "topo"){
			enableGiveParams(false);
			enableGiveSchemas(false);
			enableSkipUnits(false);
			setDefaults(false);
		}
		updateSystemDescriptions();
	};

	var createSession = function(p, s, g, aname){
		var u = $("#userName").val();
		//var url = "http://localhost/code/global.php";
		var url = $("#dragoon_url").val()+"global.php";
		$.ajax({
			type: "POST",
			url: url,
			data: {
				'u': u,
				'p': p,
				'aname' : aname,
				's': s,
				'g': g,
				't': "copyNCModelToSection"
			},
			async: false,
			success: function(data){
				if(data.error){
					console.log(data);
					alert("Something went wrong we are trying to fix it");
				}
				return data;
			},
			error: function(data){
				console.log(data);
				return data;
			}

		});
	};

	var updateGroup = function(event){
		var id = "#" + event.target.id;
		var user = $("#userName").val();

		var group_name = $(id).closest('.accordion').find('h2:first').text();
		if(group_name == "private"){
			group_name = user+"-private";
		} else {
			var group_owner = group_name.split('by');
			if(group_owner.length>1){
				group_name = group_owner[0].trim()+"-"+group_owner[1].trim();
			} else {
				group_name = group_name + "-" + user;
			}
		}
		form.g.value = group_name;
	};

	var enableLockNodes = function(/* status */ status){
		if(status){
			$('#ln_checkbox_container').show();
		}
		else{
			$('#ln_checkbox_container').hide();
		}
		//by default each time lock nodes is enabled or disabled, uncheck the box and also set form fp value to off
		$('#ln_checkbox').prop('checked',false);
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
	}

	var setDefaults = function(/* status */ status){
		//make default changes to flags, this is dynamic and can change, enabling skip units and give params for topomath for summer
		$('#su_checkbox').prop('checked',status);
		$('#gp_checkbox').prop('checked',status);
	}

	var updateSystemDescriptions = function(){
		//if the current site is topomath, system descriptions for the current problem have to be loaded
		console.log("update system descriptions called");
		if($('#assignment_def_sd').length){
			//send a request to load sds
			var folder = form.g && form.g.value ? form.g.value : "";
			var problem = form["pname"].value;
			var section = "non-class-models";
			var sd_update_handler = "sites/topomath.asu.edu/modules/system_descriptions/static/sysDescUpdates.php";
			var input = {
				f: folder,
				p: problem,
				s: section,
				req_type: "sds_assignments"
			}
			console.log("input data sent", input);
			$.post(sd_update_handler, input)
				.success(function (datum) {
					console.log("received",datum);
					var sys_json = JSON.parse(datum);
					$("#assignment_def_sd").find('option').remove();
					if(!$.isEmptyObject(sys_json)){
						$.each(sys_json, function(key,value){
						var o = new Option(value, key);
						$('#assignment_def_sd').append($(o));
					})						
					}
					else{
						var o = new Option("No system descriptions found",0);
						$('#assignment_def_sd').append($(o));
					}

			});
		}
	}

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
	$('#form_open_radios').change(function(){
		var mode_val = $("input[type='radio'][name='m']:checked").val();
		var mode_val_ar = mode_val.split("|");
		var mode = mode_val_ar[0];
		console.log(mode, "is ");
		if(mode == "AUTHOR"){
			enableLockNodes(false);
			if(tutor == "topo"){
				enableGiveParams(false);
				enableGiveSchemas(false);
				enableSkipUnits(false);
				setDefaults(false);
			}
		}
		else{
			enableLockNodes(true);
			if(tutor == "topo"){
				enableGiveParams(true);
				enableGiveSchemas(true);
				enableSkipUnits(true);
				setDefaults(true);
			}
		}

	});
	$('.dragoon_problem').click(showForm);
	$('.dragoon_nc_problem').click(showForm);
	$('#submit_button').click(function(event){
		event.preventDefault();
		submitForm();
		});
});

