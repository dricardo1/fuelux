/*
 * Fuel UX Infinite Scroll
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2014 ExactTarget
 * Licensed under the MIT license.
 */

// -- BEGIN UMD WRAPPER PREFACE --

// For more information on UMD visit:
// https://github.com/umdjs/umd/blob/master/jqueryPlugin.js

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// if AMD loader is available, register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function ($) {
	// -- END UMD WRAPPER PREFACE --

	// -- BEGIN MODULE CODE HERE --

	var old = $.fn.infinitescroll;

	// INFINITE SCROLL CONSTRUCTOR AND PROTOTYPE

	var InfiniteScroll = function (element, options) {
		this.$element = $(element);
		this.$element.addClass('infinitescroll');
		this.options = $.extend({}, $.fn.infinitescroll.defaults, options);

		this.curScrollTop = this.$element.scrollTop();
		this.curPercentage = (this.$element.height() / (this.$element.get(0).scrollHeight - this.curScrollTop)) * 100;
		this.fetchingData = false;

		this.$element.on('scroll', $.proxy(this.onScroll, this));
	};

	InfiniteScroll.prototype = {

		constructor: InfiniteScroll,

		fetchData: function(){
			var load = $('<div class="infinitescroll-load"></div>');
			var self = this;
			var moreBtn;

			var fetch = function(){
				var helpers = { percentage: self.curPercentage, scrollTop: self.curScrollTop };
				load.append('<div class="loader"><i></i><i></i><i></i><i></i><!--[if lt IE 10]><scr' +
					'ipt type="text/javascript">window.fuelux_loader.scan();</scr' + 'ipt><![endif]--></div>');
				if(self.options.dataSource){
					self.options.dataSource(helpers, function(resp){
						load.remove();
						if(resp.content){
							self.$element.append(resp.content);
						}
						self.fetchingData = false;
					});
				}
			};

			this.fetchingData = true;
			this.$element.append(load);
			if(this.options.hybrid){
				moreBtn = $('<button type="button" class="btn btn-primary"></button>');
				if(typeof this.options.hybrid === 'object'){
					moreBtn.append(this.options.hybrid.label);
				}else{
					moreBtn.append('<span class="glyphicon glyphicon-repeat"></span>');
				}
				moreBtn.on('click', function(){
					moreBtn.remove();
					fetch();
				});
				load.append(moreBtn);
			}else{
				fetch();
			}
		},

		onScroll: function(e){
			this.curScrollTop = this.$element.scrollTop();
			this.curPercentage = (this.$element.height() / (this.$element.get(0).scrollHeight - this.curScrollTop)) * 100;
			if(!this.fetchingData && this.curPercentage>=this.options.percentage){
				this.fetchData();
			}
		}

	};

	// INFINITE SCROLL PLUGIN DEFINITION

	$.fn.infinitescroll = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this   = $( this );
			var data    = $this.data( 'infinitescroll' );
			var options = typeof option === 'object' && option;

			if( !data ) $this.data('infinitescroll', (data = new InfiniteScroll( this, options ) ) );
			if( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.infinitescroll.defaults = {
		dataSource: null,
		hybrid: false,	//can be true or an object with structure: { 'label': (markup or jQuery obj) }
		percentage: 95	//percentage scrolled to the bottom before more is loaded
	};

	$.fn.infinitescroll.Constructor = InfiniteScroll;

	$.fn.infinitescroll.noConflict = function () {
		$.fn.infinitescroll = old;
		return this;
	};

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --