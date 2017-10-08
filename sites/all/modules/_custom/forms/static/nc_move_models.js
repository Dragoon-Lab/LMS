(function($) {
	Drupal.behaviors.handleMoveCopy = {
		attach: function(context, settings){
			var model_select = $('#select_source_model');
			var dest_select = $('#select_destination_folder');
			var src_select = $('#select_source_folder');
			var cp_button = $('#cp_model_but');
			var mv_button = $('#mv_model_but');
			var form = document.forms['dragoon_nc_move_models'];
			var current_op = "";
			var current_src_options;
			var current_button;

			//helper functions

			//updates button (move or copy) based on user choice
			var update_button = function(src_button, enable){
				cp_button.hide(); mv_button.hide();
				if(src_button == "Copy Models")
					current_button = cp_button;
				else if(src_button == "Move Models")
					current_button = mv_button;
				current_button.show();
				current_button.attr("disabled",true);
			};

			//refreshes select field : enables, removes current options and updates options
			var refresh_select = function(current_select, new_options){
				
				//enable in case disabled
				current_select.attr("disabled", false);

				//remove any options from current select, before replenishing
				current_select.find('option').remove();

				//replace options from new_options
				for(var key in new_options){
					var temp_option = new Option(new_options[key],key);
					current_select.append($(temp_option));
				}
			}

			// updates the model and destination selects when no data received
			// either because the current folder has no models or query has failed
			var no_data_received = function(message){
				//update model select and disable
				refresh_select(model_select, message);
				model_select.attr("disabled",true);
				
				//update dest select and disable
				refresh_select(dest_select, message);
				dest_select.attr("disabled",true);
				
				//disable copy/move button
				current_button.attr("disabled", true);
			}

			
			//sets up the user form based on user choice
			var mvcp_form_setup = function(src_button){
				
				update_button(src_button,false);
		
				var new_folders;
				if(src_button == "Copy Models"){
					new_folders = form["source_folder_data2"].value;
				}
				else if(src_button == "Move Models"){
					new_folders = form["source_folder_data"].value;
				}

				current_src_options = $.parseJSON(new_folders);
				//update the src folders select
				refresh_select(src_select, current_src_options);
				src_select.trigger('change');
			};

			//updates model list and destination list based on current folder
			var update_mvcp_options = function(src_data){
				var current_folder = src_select.val();
				
				//make a call to Dragoon API to get models for the current folder
				$.ajax({
					type: "POST",
					url: $("#dragoon_url").val()+"global.php",
					data: {
						"t": "reqNonClassProblems",
						"g" : current_folder
					},
					success: function (data) {
						console.log("success");
						//incase of api side query fail or any another issue
						//an error object is returned ({ 'error': 'No Models'})
						var model_data = $.parseJSON(data);
						if(model_data["error"] !== undefined){
							//no data received
							var empty_option = {"none": "Selected folder is empty"};
							no_data_received(empty_option);
						}
						else{
							//update model select using data got back
							refresh_select(model_select, model_data);

							//console.log(select_data, current_folder);
							//update destination select with all source folders except current folder
							refresh_select(dest_select, src_data);
							dest_select.find('option[value='+current_folder+']').remove();
							//enable the copy/move button
							current_button.attr("disabled", false);
						}
					},
					error: function (data) {
						console.log(data,"failed");
						var failed_option = {"none": "Something went wrong! try again later"};
						no_data_received(failed_option);
					}
				});
			};

			//Events related to move/copy form

			//modAction is the class attribute of move and copy model buttons
			$('.modAction').on("click",function(){
				console.log($(this).html());
				var current_op = $(this).html();
				mvcp_form_setup(current_op);

			});

			$('#select_source_folder').on("change", function(){
				update_mvcp_options(current_src_options);
			});

		}
	}
})(jQuery);
