jQuery(document).ready(function($) {
	//attach functions to global objects as this serves other files and is in ready callback

	//checks if new folder name/model name is empty
	window.isNameEmpty = function(name){
		return ( (name.length > 0) ? false: true);
	}

	//check whether folder/model names are within length specs
	window.lengthExceeded = function(name, max_len){
		return ( (name.length) > max_len ? true: false );
	}

	//checks for special character
	window.checkSpecialChars = function(name){
		//special characters case
		var pattern = new RegExp(/[~`!#$()%\^&*+=\-\[\]\\;,/{}|\\":<>\?@]/);
		// if folder/model name is a single character, do not allow legit special chars ._ (dot, underscore)
		if(name.length === 1)
			pattern = new RegExp(/[~`!#$()%\^&*+=\-\[\]\\';,/{}|\\":<>\?@_.]/);
		if (pattern.test(name)) {
			return true;
		}
	}

	window.showErrorTextbox = function(/*string*/ element,/*string*/ message){
		var cur_element = $('#'+ element);
		cur_element.val('');
		cur_element.addClass('focusedtextselect');
		cur_element.attr("placeholder", message);			
	}

});