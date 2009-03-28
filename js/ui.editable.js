(function($) {

$.widget('ui.editable', {
	_init: function() {
		this.element.addClass('ui-editable');
		this.element.bind(this.options.eventStart, function() {
			$(this).editable('start');
		});
		if( this.options.sync ) {
			$(this.options.sync).val( this.element.text() );
		}
	},
	start: function() {
		var elem = this.element;
		if( !elem.data('editing') ) {
			elem.data('editing', true);
			$input = $('<input />').val( $(elem).text() ).width( $(elem).width() );
			$span = $('<span class="ui-inline" title="' + $(elem).text() + '" />').append($input)
			$(elem).html( $span );
			if( this.options.autoFocus ) $input.focus();
			if( this.options.autoSelect ) $input.select();
			this._buildButtons();
			$input.blur(function() {
				if( elem.editable('option', 'finishOnBlur') ) elem.editable('finish');
			});
			$input.keydown(function(e) {
				if( elem.editable('option', 'finishOnKey') && e.keyCode == elem.editable('option', 'finishOnKey')) elem.editable('finish');
			});
		}
	},
	finish: function() {
		var elem = this.element;
		if( !elem.editable('option', 'validation') || (elem.editable('option', 'validation') && elem.editable('option', 'validation').test( elem.find('input').val() )) ) {
			if(this.options.sync) {
				$(this.options.sync).val( elem.find('input').val() );
			}
			elem.text( elem.find('input').val() );
			elem.data('editing', false);
		}
	},
	cancel: function() {
		var elem = this.element;
		if( elem.data('editing') ) {
			elem.text( elem.find('span').attr('title') );
			elem.data('editing', false);
		}
	},
	_buildButtons: function() {
		var elem = this.element,
			self = this;
		$.each(this.options.buttons, function(label, action) {
			var $button = $('<button>' + label + '</button>');
			$button.click(function() { action.apply(self.element[0]); })
			elem.find('span').append($button);
			elem.find('input').width( elem.find('input').width() - ($button.outerWidth() + 3) );
		});
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
		buttons: {},
		sync: false
	}
});

})(jQuery);