//$.ui.inline.defaults = {
//	save: function() { },
//	afterSave: function() { },
//	finishOnBlur: true,
//	finishOnEnter: true,
//	buttons: false
//}
//$.fn.inline = function() {
//	this.initialise = function(settings) {
//		$(this.selector).live('dblclick', function() {
//			if(!$(this).data('editing')) {
//				$(this).data('editing', true);
//				$input = $('<input type="text" />').val( $(this).text() ).width( $(this).width() ).keydown(function(e) {
//					if(e.keyCode == 13) {
//						$(this).blur();
//					}
//				});
//				$input.blur(function(e) {
//					if( settings.save(e) ) {
//						$(this).parent().data('editing', false);
//						$(this).replaceWith( $(this).val() );
//						settings.afterSave();
//					}
//				});
//				$(this).html($input).find('input').focus().select();
//			}
//		});
//	}
//	if(arguments.length == 0 || (arguments.length == 1 && typeof(arguments[0]) == 'object')) {
//		this.initialise(arguments[0]);
//	}
//}

(function($) {

$.widget('ui.editable', {
	_init: function() {
		var options = this.options,
			self = this;
		
		this.element.addClass('ui-editable');
		this.element.bind(this.options.eventStart, function() {
			if(!$(this).data('editing')) {
				var $parent = $(this).parent();
				$(this).data('editing', true);
				$input = $('<input />').val( $(this).text() ).width( $(this).width() );
				$span = $('<span class="ui-inline" title="' + $(this).text() + '" />').append($input)
				$(this).html( $span );
				if( options.autoFocus ) $input.focus();
				if( options.autoSelect ) $input.select();
				$input.blur( self._blur(this, options) );
				$input.keydown( self._keydown(this, options) );
			}
		});
	},
	_finish: function(element) {
		if( !$(element).editable('option', 'validation') || ($(element).editable('option', 'validation') && $(element).editable('option', 'validation').test( $(element).find('input').val() )) ) {
			$(element).text( $(element).find('input').val() );
			$(element).data('editing', false);
		}
	},
	_blur: function(element) {
		var self = this;
		return function() {
			if( $(element).editable('option', 'finishOnBlur') ) self._finish(element)
		}
	},
	_keydown: function(element) {
		var self = this;
		return function(e) {
			if( $(element).editable('option', 'finishOnKey') && e.keyCode == $(element).editable('option', 'finishOnKey')) self._finish(element);
		}
	}
});

$.extend($.ui.editable, {
	version: "0.1",
	defaults: {
		finishOnKey: 13,
		finishOnBlur: true,
		autoFocus: true,
		autoSelect: true,
		eventStart: 'dblclick',
		validation: false,
		buttons: {}
	}
});

})(jQuery);