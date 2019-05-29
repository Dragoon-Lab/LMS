//declare outside ready to make the function scope global
var isNameEmpty;
var lengthExceeded;
var checkSpecialChars;
var showErrorTextbox;
var emptyTextbox;
jQuery(document).ready(function($) {
	
	//checks if new folder name/model name is empty
	isNameEmpty = function(name){
		return ( (name.length > 0) ? false: true);
	}

	//checks for special character
	checkSpecialChars = function(name){
		//special characters case
		var pattern = new RegExp(/[~`!#$()%\^&*+=\-\[\]\\;,/{}|\\":<>\?@]/);
		// if folder/model name is a single character, do not allow legit special chars ._ (dot, underscore)
		if(name.length === 1)
			pattern = new RegExp(/[~`!#$()%\^&*+=\-\[\]\\';,/{}|\\":<>\?@_.]/);
		if (pattern.test(name)) {
			return true;
		}
	}

	//error over a text box
	showErrorTextbox = function(/*string*/ element,/*string*/ message){
		var cur_element = $('#'+ element);
		cur_element.val('');
		cur_element.addClass('focusedtextselect');
		cur_element.attr('placeholder', message);			
	}

	//empty and remove any focussed classes from a textbox
	emptyTextbox = function(/*string*/ element, /*string*/ message){
		var cur_element = $('#'+ element);
		cur_element.val('');
		cur_element.removeClass('focusedtextselect');
		cur_element.attr('placeholder', message);	
	}

});