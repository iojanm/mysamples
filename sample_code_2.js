(function($) {	
	
	
    $.fn.jjOverlay = function(action, customOptions) {
    	
    	var _defaultOptions = {
				"zIndex": 10000,
				"display": 'none',
				"width": '400px',
				"height": '300px',
				"bgColor": '#EAEAEA',
				"useDefaultStyles": false
			}; 	
    	
    	var myOverlay;
    	
		var options  = $.extend({}, _defaultOptions, customOptions || {});
		
		
			
			
			
			var _getZindex = function(){
				var myZindex = 10000;
				$(".jjOverlayOpened").each(function(){
					if (parseInt($(this).css("z-index")) > myZindex){
						myZindex = $(this).css("z-index");
					}
				});
				
				return myZindex;
			};
			
						
			var _getOverlay = function(MyObject){
				
				return $("#"+$(MyObject).data("jjOverlayId"));
				
			};
			
			var _getSource = function(MyObject){
				
				return $("#"+$(MyObject).data("jjOverlayId"));
				
			};
			
			var _hideMask = function(jjOverlayId){
				var myMask = $("#"+jjOverlayId+"MASK");	
				myMask.hide();
				myMask.remove();
			};
			
			var _showMask = function(jjOverlayId){				
				
				
				
				var mask = $("<div id='"+jjOverlayId+"MASK' />");
				mask.data("jjOverlayId", jjOverlayId);
				$('body').prepend(mask);
				mask.css('filter', 'alpha(opacity=50)');
				mask.css('-moz-opacity', '0.5');
				mask.css('-khtml-opacity', '0.5');
				mask.css('opacity', '0.5');
				mask.css('position', 'absolute');
				mask.css('top', '0px');
				mask.css('left', '0px');
				mask.css('z-index', myOverlay.css("z-index") - 1);
				mask.css('background-color', 'black');
				mask.css('width', _getDocumentWidth() + 'px');
				mask.css('height', $(document).height() + 'px');
				
				
				myOverlay.data('mask',mask);
				
				myOverlay.data('mask').show();
				
				mask.bind("click",_close);
				
			};
			
			var _setLeft = function(){
				
				var relativeLeftPos = Math.round( ($(window).width() / 2) - myOverlay.outerWidth() / 2 );
				
				var leftPos = $(window).scrollLeft() + relativeLeftPos;
				
				myOverlay.stop().animate({left: leftPos+'px'});
				
			};
			
			var _setInitialPosition = function(){
				
				var topPos = Math.round( ($(window).height() / 2) - myOverlay.outerHeight() / 2 ) + $(window).scrollTop();
				
				var leftPos = Math.round( ($(window).width() / 2) - myOverlay.outerWidth() / 2 ) + $(window).scrollLeft();
				
				myOverlay.css("top", topPos+'px');
				
				myOverlay.css("left", leftPos+'px');
				
			};
			
			var _setTopLeft = function(){
				
				var relativeTopPos = Math.round( ($(window).height() / 2) - myOverlay.outerHeight() / 2 );
				
				var topPos = $(window).scrollTop() + relativeTopPos;
				
				var relativeLeftPos = Math.round( ($(window).width() / 2) - myOverlay.outerWidth() / 2 );
				
				var leftPos = $(window).scrollLeft() + relativeLeftPos;
				
				myOverlay.stop().animate({top: topPos+'px', left: leftPos+'px' });
				
			};
			
			
			
			
			
			var _setAnimation = function(){
				$(window).scroll(function(){
					_setTopLeft();
				});
				$(window).resize(function(){
					_setTopLeft();
				});
			};
			
			var _externalCenter = function(MyObject){
				
				var jjOverlayId = $(MyObject).data("jjOverlayId");
				
				myOverlay = $("#"+jjOverlayId);	
				
				var relativeTopPos = Math.round( ($(window).height() / 2) - myOverlay.outerHeight() / 2 );
				
				var topPos = $(window).scrollTop() + relativeTopPos;
				
				var relativeLeftPos = Math.round( ($(window).width() / 2) - myOverlay.outerWidth() / 2 );
				
				var leftPos = $(window).scrollLeft() + relativeLeftPos;
			};
			
			var _open = function(MyObject){
				
				if (!_isOpen(MyObject)){
				
					$(MyObject).data("jjOverlayId",_createOverlay());
								
					myOverlay.addClass('jjOverlayOpened');
				
					myOverlay.css('z-index', parseInt(_getZindex()) + 2);
				
					_showMask($(MyObject).data("jjOverlayId"));
				
					myOverlay.fadeIn("fast", function(){
						_setAnimation();
					});
					
					_setInitialPosition();		
				
				}	
				
			};
			
			var _isOpen = function(MyObject){
				if ($("#"+$(MyObject).data("jjOverlayId")).length > 0 ){
					return true;
				}else{
					return false;
				}
			};
			
			var _createOverlay = function(){
				
				var Id = _uniqueId();
				
				myOverlay = $("<div class='jjOverlay' id='" + Id + "' />");
				
				_loadContent();
					
				_addCloseButton(Id);
				
				_applyCss();
				
				$('body').prepend(myOverlay);
				
				return Id;
				
			};
			
			var _loadContent = function(){
				
				
				myOverlay.prepend(options.content);
				
				
				//console.log(typeof(options.onContentLoad));
				if (options.onContentLoad && typeof(options.onContentLoad) == 'function'){
					options.onContentLoad.call(this, arguments);
				}
				
			};
			
			var _addCloseButton = function(jjOverlayId){
				
				if (myOverlay.find(".close").lenght == 0){
					
					var closeBtn = $("<a>close</a>");
					
					closeBtn.css("display", 'block');
					closeBtn.css("position", 'absolute');
					closeBtn.css("right", '0');
					closeBtn.css("top", '0');
					closeBtn.css("cursor", 'pointer');
					myOverlay.prepend(closeBtn);
					
				}else{
					
					closeBtn = myOverlay.find(".close");
					
				}
				
				closeBtn.data("jjOverlayId",jjOverlayId);
				closeBtn.bind('click', _close);
				
				
			};
			
			var _close = function(){
					var jjOverlayId = $(this).data("jjOverlayId");
					myOverlay = $("#"+jjOverlayId);		
					myOverlay.stop().fadeOut('fast', function(){
										_hideMask(jjOverlayId);					
										myOverlay.remove();	
										//console.log(typeof(options.onContentLoad));
										if (options.onClose && typeof(options.onClose) == 'function'){
											options.onClose.call(this, arguments);
										}
													
										});
				
			};

			var _externalClose = function(MyObject){
				
				var jjOverlayId = $(MyObject).data("jjOverlayId");
				
				myOverlay = $("#"+jjOverlayId);		
					myOverlay.stop().fadeOut('fast', function(){
										_hideMask(jjOverlayId);					
										myOverlay.remove();										
										});
				
			};
			
			
			
			var _applyCss = function(){
				var myCss = {
					"position": "absolute",
					"z-index": options.zIndex,
					"display": options.display
				};
				
				myOverlay.css(myCss);
				
				if (options.useDefaultStyles){
					var myCss = {					
						"width": options.width,
						"height": options.height,
						"background-color": options.bgColor
					};
					myOverlay.css(myCss);
				}
				
				
			};
			
			var _uniqueId = function (){
			    // always start with a letter (for DOM friendlyness)
			    var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
			    do {                
			        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
			        var ascicode=Math.floor((Math.random()*42)+48);
			        if (ascicode<58 || ascicode>64){
			            // exclude all chars between : (58) and @ (64)
			            idstr+=String.fromCharCode(ascicode);    
			        }                
			    } while (idstr.length<32);
			
			    return (idstr);
			};
						
				
			var _getDocumentWidth = function(){
				
				if($.browser.msie){
					if($.browser.version == "8.0") {
						var wd = $(document).width() - 21;
						return wd;
					} else {
						if ($.browser.version == "9.0") {
							var wd = $(document).width() - 17;
							return wd;
						}else{
							var wd = $(document).width() - 17;
							return wd;
						}
					}
				} else {
					return $(document).width();
				}
			};
				
			
		
        this.each( function() {
			
			if (!$(this).hasClass("jjOverlay-content")){
				
				if (options.content == undefined){
					options.content = $(this).clone().addClass("jjOverlay-content").css("display",'block');
				}
				
				switch(action){
					case 'close': _externalClose(this);
					case 'center': _externalCenter(this);
					break;
					default: _open(this);
				}		
			
			}	
                        
        });
		
		
   };

}(jQuery));