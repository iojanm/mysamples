$(document).ready(function(){
	
	featuresTrips.initialize(jSONTrips);
        
    /* Play Slide*/
    var transitionTime = $("#ft-container").data("transition-time");    
    featuresTrips.setDuration(transitionTime);
    featuresTrips.play();
});


var featuresTrips = (function(){
   
    /**
     * This method check the status of the overlays before the
     * Feature trips Scrolls.
     */
    var _checkOverlay = function(overlay){
        var overlay = $("#"+overlay+"[rel]").overlay();
        var isOpened = overlay.isOpened();
        if (isOpened) overlay.close();
    };

    /**
     * This method get the id of the selected trip
     * @returns (string)
     */
    var _getSelectedElement = function() {
        var actualScroll  = _getBarScrollPosition();
        var selectedElement = _getBarScrollPosition() / 288;
        if(selectedElement == 0) {
            return _getSelectedElementId(2);
        } else {
            return _getSelectedElementId(selectedElement);
        }
    };

    /**
     * This method get the id of an element.
     * @returns (string)
     */
    var _getSelectedElementId = function(element) {
        var divId = $('#tripsBarTripContainer :nth-child('+element+')')
            .attr('id');
        return divId;
    };

    

    /**
     * This method appends a Div mask to the body
     */
    var _appendMaskBody = function(){
        var masDiv = $('<div id="exposeMak"/>');
        $('body').prepend(masDiv);
    };

    var _maskCss = function(){
        $("#exposeMak").css('display','none');
        $("#exposeMak").css('width', $(document).width());
        $("#exposeMak").css('height', $(document).height());
        $("#exposeMak").css('filter', 'alpha(opacity=50)');
        $("#exposeMak").css('-moz-opacity', '0.5');
        $("#exposeMak").css('-khtml-opacity', '0.5');
        $("#exposeMak").css('opacity', '0.5');
        $("#exposeMak").css('position', 'absolute');
        $("#exposeMak").css('top', '0px');
        $("#exposeMak").css('left', '0px');
        $("#exposeMak").css('z-index', '31');
        $("#exposeMak").css('background-color', 'black');
    };

    var _showMask = function() {
        _maskCss();
        $("#gde_chromeContainer").css('z-index','10');
        $("#exposeMak").css('display','');
    };

    var _closeMask = function() {
        $("#gde_chromeContainer").css('z-index','10000000');
        $("#exposeMak").css('display','none');
    };

    var _removeMask = function() {
        $("#exposeMak").remove();
    };
   
    
    /**
     * Set default values
     */
    var _direction = "right";
    var _playInterval = null;
    var _duration = 6000;
    var _transitionStatus = false;
    var _currentIndex = 0;
    var _bgWidth = 1260;
    var _iPadFlag = false;
    
    
    
    
    /**
     * This method set the Slide Elements
     * @param (json) slideElements 
     */
    var _setSlideElements = function(slideElements){
        _slideElements = slideElements;
    };
    
    /**
     * This method get current index that are being showed
     * @return (int) currentIndex
     */
    var _getSlideElements = function(){
        return _slideElements;
    };
    
    /**
     * This method set the current index that are being showed
     * @param (int) currentIndex 
     */
    var _setCurrentIndex = function(currentIndex){
        _currentIndex = currentIndex;
    };
    
    /**
     * This method get current index that are being showed
     * @return (int) currentIndex
     */
    var _getCurrentIndex = function(){
        return _currentIndex;
    };
    
    /**
     * This method set the duration for Play functionality.
     * @param (string) duration 
     */
    var _setDuration = function(duration){
        _duration = duration;
    };
    
    /**
     * This method get the current duration for Play functionality.
     * @return (string) duration
     */
    var _getDuration = function(){
        return _duration;
    };
    
    /**
     * This method set the direction for Play functionality.
     * @param (string) direction [left|right] 
     */
    var _setDirection = function(direction){
        _direction = direction;
    };
    
    /**
     * This method get the current direction for Play functionality.
     * @return (string) direction [left|right] 
     */
    var _getDirection = function(){
        return _direction;
    };
    
    /**
     * This method set the Bg Width
     * @param (int) bgWidth 
     */
    var _setBgWidth = function(bgWidth){
        _bgWidth = bgWidth;
    };
    
    /**
     * This method get the Bg Width
     * @return (int) _bgWidth
     */
    var _getBgWidth = function(){
        return _bgWidth;
    };
    
    /**
     * This method set the iPAD Flag
     * @param (int) myVal 
     */
    var _setIPadFlag = function(myVal){
        _iPadFlag = myVal;
    };
    
    /**
     * This method get the iPAD Flag
     * @return (int) _iPadFlag
     */
    var _getIPadFlag = function(){
        return _iPadFlag;
    };
    
    /**
     * This method get the playInterval value 
     * @return (interval) 
     */   
    var _getPlayInterval = function(){
        return _playInterval;
    };
    
    /**
     * This method set the playInterval value 
     * @param (function) callback
     * @param (string) time
     */
    var _setPlayInterval = function(callback, time){
        _playInterval = setInterval(callback, time);
    };
    
    /**
     * This method start slide play function
     */
    var _play = function (){              
        if (_getPlayInterval() == null){
            if (_getDirection() == 'left'){
                _setPlayInterval(_scrollRight, _getDuration());
            }else{
                _setPlayInterval(_scrollLeft, _getDuration());
            }
        }
    };
    
    /**
     * This method stop slide play function
     */
    var _stop = function (){              
        if (_getPlayInterval() != null){
            clearInterval(_playInterval);  
            _playInterval = null;
        }
    };
    
    var _setTransitionStatus = function(MyVal){
        _transitionStatus = MyVal;
    };
    
    var _getTransitionStatus = function(){
        return _transitionStatus;
    };
    
    /**
     * This method Loads Trip data
     * according the trip selected.
     * @param (string) tripIndex.
     */
    var _loadContent = function(tripIndex, callback){
    	
    	_stop();
    	
    	var slideElement = _getSlideElements()[tripIndex];
    	
    	var type = slideElement.type;
    	
    	//console.log(type);
    	
    	switch (type){
    		
    		case 'ContentItem':
    			
    			_loadContentType(slideElement, callback);
    			
    		break;
    		
    		case 'RelatedTrip':
    		
    			_loadRelatedTripData(slideElement, callback);
    		
    		break;
    		
    	}    	
        
    };
    
    /**
     * This method Loads ContentType data
     * @param (jSON) data.
     */
    var _loadContentType = function(slideElement, callback){
    	
    	//console.log('_loadContentType');
    	
    	
    	
    	$("#ft-container").html('');
    	
    	// Load BG
    	
    	var source = $("#homepage-background-template").html();
  		
  		var template = Handlebars.compile(source);		
    	
    	var backgroundHTML = template(slideElement);
    	
    	// Load textBox 
    	
    	source = $("#homepage-text-box-template").html();
    	
    	template = Handlebars.compile(source);
    	
    	//console.log(slideElement);
    	
    	var textBoxHTML = template(slideElement);
    	
    	// Load DataContainer
    	
    	source = $("#homepage-slide-content-template").html();
    	
    	template = Handlebars.compile(source);
    	
    	var dataHTML = template({'content': textBoxHTML}); 
    	
    	// Append HTML
    	
    	$("#ft-container").append(backgroundHTML);
    	
    	$("#ft-container").append(dataHTML);
    	
    	
    	_showCurrentElement(callback);
    	
    	
    };
    
    /**
     * This method Loads RelatedTrip data
     * @param (jSON) data.
     */
    var _loadRelatedTripData = function(slideElement, callback){
    	
    	$("#ft-container").html('');
    	
    	// Load BG
    	
    	var source = $("#homepage-background-template").html();
  		
  		var template = Handlebars.compile(source);		
    	
    	var backgroundHTML = template(slideElement);
    	
    	// Load miniMap 
    	
    	//console.log(slideElement);
    	
    	source = $("#homepage-trip-promo-template").html();
    	
    	template = Handlebars.compile(source);
    	
    	var tripPromo = template(slideElement);
    	
    	// Load DataContainer
    	
    	source = $("#homepage-slide-content-template").html();
    	
    	template = Handlebars.compile(source);
    	
    	var dataHTML = template({'content': tripPromo});
    	
    	
    	// Append HTML
    	
    	$("#ft-container").append(backgroundHTML);
    	
    	$("#ft-container").append(dataHTML);
    	
    	
    	_showCurrentElement(callback);
    	
    	
    	
    };
    
    /**
     * This method scrolls the features trips bar to the right
     */
    var _scrollRight = function() {
    	
    	//console.log("scrollRight");
    	    
        _setTransitionStatus(true);
        
        var currentIndex = _getCurrentIndex();
        
        var countSlideElements = _getSlideElements().length;
        
        if (currentIndex == countSlideElements - 1){
        	
        	currentIndex = 0;
        }else{
        	
        	currentIndex++;
        }
        
        _setCurrentIndex(currentIndex);
        
        _hideCurrentElement();
    	
    	   
    };
    
     /**
     * This method scrolls the features trips bar to the right
     */
    var _scrollLeft = function() {
    	
    	//console.log("scrollLeft");
    	    
        _setTransitionStatus(true);
        
        var currentIndex = _getCurrentIndex();
        
        var countSlideElements = _getSlideElements().length;
        
        if (currentIndex == 0){
        	
        	currentIndex = countSlideElements - 1;
        }else{
        	
        	currentIndex--;
        }
        
        _setCurrentIndex(currentIndex);
        
        _hideCurrentElement();
    	
    	   
    };
    
    var _hideCurrentElement = function(callback){
    	
    	$("#featuresTripsContent").fadeOut('fast',function(){
    		$("#ft-container").fadeOut('fast',function(){
    			_loadContent(_getCurrentIndex(), callback);
    		});    		
    	});
    	
    };
    
    var _showCurrentElement = function(callback){
    	
    	
    	
    	$("#featuresTripsContent").hide();
    	$("#ft-container").hide();    	
    	
    	if(_getIPadFlag() === true) {			
				_hideWatchVideoButtons();				
		}
		
		var showContent = function(){
			$("#featuresTripsContent").fadeIn('slow', function(){
				
					_linkTracking();
					
    				$(".highlight.cta").click(_showHighLights);
    				_bindVideoEvents();
    				_setTransitionStatus(false);
    				
    				_play();
    				
    				if (callback != undefined){
    					callback();
    				}
    			}); 
		};
    	
    	$("#ft-background > img").load(function(){    		
    		$("#ft-container").fadeIn('fast', function(){
    			showContent(); 		
    		});
    	});
    	
    	$("#ft-background > img").error(function(){
    		showContent(); 
    	});
    	
    	
    	
    };
    
    var _showHighLights = function(e){
    	
    	e.preventDefault();
    	
    	// Load DataContainer 
    	
    	source = $("#homepage-highlights-template").html();
    	
    	template = Handlebars.compile(source);
    	
    	var slideElement = _getSlideElements()[_getCurrentIndex()];
    	
    	
    	//console.log(slideElement);
    	
    	var dataHTML = template(slideElement);
    	
    	
    	featuresTrips.stop();
    	
    	$("#featuresTripsContent .highlightsOverlay").html(dataHTML);
    	
    	_setHightLightsPosition();
    	
    	$("#featuresTripsContent .highlightsOverlay").fadeIn("fast", function(){
    		$("#featuresTripsContent .highlightsOverlay .closeBtn").click(_hideHighLights);
    	});
    	
    	$("#featuresTripsContent #overlay-signal").fadeIn("fast");
    	
    };
    
    var _hideHighLights = function(){
    	
    	$("#featuresTripsContent .highlightsOverlay").fadeOut("fast", _play);
    	
    	$("#featuresTripsContent #overlay-signal").hide();
    	
    };
    
    var _setHightLightsPosition = function(){
    	
    	var contentTop = $("#featuresTripsContent").offset().top;
    	
    	var contentLeft = $("#featuresTripsContent").offset().left;
    	
    	var btnLeft = Math.round($(".highlight.cta").offset().left - contentLeft);
    	
    	var btnTop = Math.round($(".highlight.cta").offset().top - contentTop);
    	
    	var overlayTop = Math.round( btnTop - ( $("#featuresTripsContent .highlightsOverlay").outerHeight() / 2 ) );
    													
    	var overlayLeft = Math.round( btnLeft +  $(".highlight.cta").outerWidth() );

	var overlayBottom = 'auto';
    	
    	
    	if (overlayTop < 30 ){
    		overlayTop = 30;
    	}
	
	if ( (overlayTop + $("#featuresTripsContent .highlightsOverlay").outerHeight()) >$("#featuresTripsContent").height() ){
		
		overlayBottom = 30;

		overlayTop = 'auto';
	}
    	
    	// Append arrow
    	
    	var arrowWidth = 10;
    	
    	var arrowPadding = 5;
    	
    	var arrow = $("<div id='overlay-signal'></div>");
    	
    	var arrowTop = Math.round( btnTop + ( $(".highlight.cta").outerHeight() / 2 ) - 11 );
    	
    	var arrowLeft = overlayLeft + arrowPadding;
    	
    	overlayLeft = arrowLeft + arrowWidth; 
    	
    	if (overlayLeft + $("#featuresTripsContent .highlightsOverlay").outerWidth() > $("#featuresTripsContent").width() ){
    		
    		arrowLeft = btnLeft - arrowPadding - arrowWidth;
    		
    		overlayLeft = Math.round( btnLeft -   $("#featuresTripsContent .highlightsOverlay").outerWidth() );
    		
    		overlayLeft = overlayLeft - arrowPadding - arrowWidth;
    		
    		$(arrow).addClass("left");
    		
    		$("#featuresTripsContent .highlightsOverlay #overlayDetails").css("border-left","1px solid #DAD8D5");
    		$("#featuresTripsContent .highlightsOverlay #overlayDetails").css("border-right","none");
    		
    	}
    	
    	
    	$(arrow).css({top: arrowTop+'px',
    				  left: arrowLeft+'px',
    				   position:'absolute'
    				   });
    	
    	$("#featuresTripsContent").append(arrow);
    	
    	
    	if (overlayTop != 'auto'){
    		$("#featuresTripsContent .highlightsOverlay").css({top: overlayTop+'px',    	 												   left: overlayLeft+'px'});
	}else{
		$("#featuresTripsContent .highlightsOverlay").css({top: overlayTop, bottom:  overlayBottom+'px', left: overlayLeft+'px'});

	}

	$("#featuresTripsContent .highlightsOverlay .closeBtn").click(function(){

		$(".highlight.cta").die();
		$(".highlight.cta").unbind("click");
	
		$(".highlight.cta").live("click",function(){

			setTimeout(function(){
				
			 _setHightLightsPosition();

			},0);
				
			$("#featuresTripsContent .highlightsOverlay").fadeIn("fast", function(){
    				$("#featuresTripsContent .highlightsOverlay .closeBtn").click(_hideHighLights);
    			});
    	
    			$("#featuresTripsContent #overlay-signal").fadeIn("fast");
		
		});
	

	});
    	
    	
    	
   };
    
    var _setHightLightsPosition = function(){
    	
    	var contentTop = $("#featuresTripsContent").offset().top;
    	
    	var contentLeft = $("#featuresTripsContent").offset().left;
    	
    	var btnLeft = Math.round($(".highlight.cta").offset().left - contentLeft);
    	
    	var btnTop = Math.round($(".highlight.cta").offset().top - contentTop);
    	
    	var overlayTop = Math.round( btnTop - ( $("#featuresTripsContent .highlightsOverlay").outerHeight() / 2 ) );
    													
    	var overlayLeft = Math.round( btnLeft +  $(".highlight.cta").outerWidth() );
    	
    	
    	if (overlayTop < 30 ){
    		overlayTop = 30;
    	}
    	
    	var overlayBottom = 'auto';
    	
    	if ( (overlayTop + $("#featuresTripsContent .highlightsOverlay").outerHeight()) >$("#featuresTripsContent").height() ){
		
			overlayBottom = 30;
	
			overlayTop = 'auto';
		}
    	
    	// Append arrow
    	
    	var arrowWidth = 10;
    	
    	var arrowPadding = 5;
    	
    	var arrow = $("<div id='overlay-signal'></div>");
    	
    	var arrowTop = Math.round( btnTop + ( $(".highlight.cta").outerHeight() / 2 ) - 11 );
    	
    	var arrowLeft = overlayLeft + arrowPadding;
    	
    	overlayLeft = arrowLeft + arrowWidth; 
    	
    	if (overlayLeft + $("#featuresTripsContent .highlightsOverlay").outerWidth() > $("#featuresTripsContent").width() ){
    		
    		arrowLeft = btnLeft - arrowPadding - arrowWidth;
    		
    		overlayLeft = Math.round( btnLeft -   $("#featuresTripsContent .highlightsOverlay").outerWidth() );
    		
    		overlayLeft = overlayLeft - arrowPadding - arrowWidth;
    		
    		$(arrow).addClass("left");
    		
    		$("#featuresTripsContent .highlightsOverlay #overlayDetails").css("border-left","1px solid #DAD8D5");
    		$("#featuresTripsContent .highlightsOverlay #overlayDetails").css("border-right","none");
    		
    	}
    	
    	
    	$(arrow).css({top: arrowTop+'px',
    				  left: arrowLeft+'px',
    				   position:'absolute'
    				   });
    	
    	$("#featuresTripsContent").append(arrow);
    	
    	if (overlayTop != 'auto'){
    		$("#featuresTripsContent .highlightsOverlay").css({top: overlayTop+'px', left: overlayLeft+'px'});
		}else{
			$("#featuresTripsContent .highlightsOverlay").css({top: overlayTop, bottom:  overlayBottom+'px', left: overlayLeft+'px'});
	
		}
    	
    	$("#featuresTripsContent .highlightsOverlay").css({top: overlayTop+'px',
    	 												   left: overlayLeft+'px'});
    	
    	
    	
    };
    
    /**
     * This method returns the video ID of the selected Trip.
     * @returns (string)
     */
    var _getVideoId = function(){
    	
    	var slideElement = _getSlideElements()[_getCurrentIndex()];
    	
    	return slideElement.video.id;
    	
    	
        //return $("#tripsBarTripContainer :nth-child(3)").attr("videoId");
    };
    
    
    var _bindVideoEvents = function(){
    	
    	
		  	$(".jjOverlay-content .close").live("click", function(){
		  		 _play();
		  	});
		  	$(".mediaPlayerLauncher").live("click", function(){
		  		 _stop();
		  	});
	    
    };
    
    
    var _setSlideArrowsPosition = function(){
    	
    	var bgImgLeft = Math.round($("#ft-background img").offset().left);
    	
    	var bgImgWidth = Math.round($("#ft-background img").width());
    	
    	//LeftArrow
    	
    	$("#leftArrow").css("left",bgImgLeft+"px");
    	
    	//RightArrow
    	
    	var arrowWidth = Math.round($("#rightArrow").width());
    	
    	$("#rightArrow").css("left", (bgImgLeft + bgImgWidth - arrowWidth) +"px");
    	
    	_bindArrowsEvents();
    };
    
    var _bindArrowsEvents = function(){
    	
    	$("#rightArrow").live("click",function(){
	       if (!_getTransitionStatus()){
	            _stop();
	            _setDirection("right");
	            _scrollRight();	            
	            _play();
	       }    	
	    });
	
	    $("#leftArrow").live("click",function(){
	        if (!_getTransitionStatus()){
	            _stop();
	            _setDirection("left");
	            _scrollLeft();
	            _play();
	        }
	    });
	   };
	    
	    
    var _fixArrowsPosition = function(){
    	
    	var windowW = $(document).width();
    	
    	var imgW = _getBgWidth(); 
    	
    	var myLeft = 0;
    	
    	var myRight = 0;
    	
    	if (windowW > imgW){
    		
    		var myLeft = Math.floor( (windowW  - imgW) / 2 );
    		
    		var myRight = myLeft;
    		
    	}    	
    	
    	$("#leftArrow").css("left", myLeft+"px");
    	$("#rightArrow").css("right", myRight+"px");
    	
    	$("#leftArrow, #rightArrow").show();
    	
    };
    
    var _scrollToSlideByTriggerVideoId = function(triggerVideo) {
    	
    	var slideElements = _getSlideElements();
    	
    	var index = 0;
    	
    	var mediaId = _getURLParameters("mediaId");
    	
    	for (var i in slideElements){
    		
    		if ( (slideElements[i].video_trigger != "" && slideElements[i].video_trigger == triggerVideo) ||
    			 (slideElements[i].video_id != "none" && slideElements[i].video_id != undefined && slideElements[i].video_id == mediaId) ){
    			
    			_setCurrentIndex(index);
    			
    			var callback = function(){
    				
    				$(".cta-watch-video").trigger("click");
    			};
    	
    			_hideCurrentElement(callback);
    			
    			
    			break;
    		}
    		
    		index++;
    		
    	}
    	
    	return;
	};
	
	var _hideWatchVideoButtons = function(){
		
		$(".cta-watch-video").hide();
		$(".cta-watch-video").parent().hide();

		if ($(".cta-watch-video").parent().next(".CTA-Button-Separator").length >0){
			$(".cta-watch-video").parent().next(".CTA-Button-Separator").hide();
		}else{
			$(".cta-watch-video").parent().prev(".CTA-Button-Separator").hide();
		}
		
	};
	
	var _linkTracking = function(){
		$("#featuresTripsContent .CTA-Button a").on("click", function(){
		 var objTrackingVars = {};
		 if ($(this).attr("name") != undefined && $(this).attr("name")!=""){
		 	var linkId = $(this).attr("name").replace('&lid=','');
		 }else{
        	 var linkId = $(this).parents().find(".text-box-title").text().trim() + '_' + $(this).text().trim();
         }
        
         if ($(this).attr("href")==undefined || $(this).attr("href")==""){         	
         	s_wdpro.trackClick(this,'ABD_Slide_' + ABD.pageTracking.cleanText(linkId),objTrackingVars);
         }
      });
	}
    
    var _initialize = function(jSONData){
    	
    	_setSlideElements(jSONData);		
		_fixArrowsPosition();
		_bindArrowsEvents();
		
		
		//iPad Fix
		_setIPadFlag(navigator.userAgent.match(/iPad/i) != null);
		
		if(_getIPadFlag() === true) {
			$("#featuresTrips").css("min-width", 996);
			$("#rightArrow").addClass("visible");
			$("#leftArrow").addClass("visible");
			_hideWatchVideoButtons();
			
		}
		
		//trigger Url Video
		var urlVideoTrigger = '';
	    urlVideoTrigger = (window.location.pathname.split('/')[1]);
	    MyFunction = _scrollToSlideByTriggerVideoId;
	    setTimeout(function(){MyFunction(urlVideoTrigger); urlVideoTrigger = null;},0);
	    
	
    	$(".highlight.cta").live("click",_showHighLights);
    	
    	$("body").prepend('<div class="simple_overlay_video_home" id="mies2">'
            +'<div id="overlayVideoDetailsHome">'
            +'<div id="videoOverlayTitleHome">Welcome Video</div>'
            +'<div id="videoPlayerHome"></div></div>'
    	);
    	
    	_bindVideoEvents();	
    	_linkTracking();	
    	
    	$(window).resize(function(){
	    	var leftPos = $(document).width() / 2;
	    	leftPos = leftPos - 390;
	    	var pos = Math.round(leftPos);
	    	$("#simple_overlay_video_home").css("left", pos);	    	
	    	_fixArrowsPosition();
		});
					
	};
	
	var _getURLParameters = function(paramName){
        var sURL = window.document.URL.toString();  
		    if (sURL.indexOf("?") > 0)
		    {
		       var arrParams = sURL.split("?");         
		       var arrURLParams = arrParams[1].split("&");      
		       var arrParamNames = new Array(arrURLParams.length);
		       var arrParamValues = new Array(arrURLParams.length);     
		       var i = 0;
		       for (i=0;i<arrURLParams.length;i++)
		       {
		        var sParam =  arrURLParams[i].split("=");
		        arrParamNames[i] = sParam[0];
		        if (sParam[1] != "")
		            arrParamValues[i] = unescape(sParam[1]);
		        else
		            arrParamValues[i] = "No Value";
		       }
		
		       for (i=0;i<arrURLParams.length;i++)
		       {
		                if(arrParamNames[i] == paramName){
		            //alert("Param:"+arrParamValues[i]);
		                return arrParamValues[i];
		             }
		       }
		       return undefined;
		    };
		
		};
    
    

    return {
        mask: _appendMaskBody,
        showMask: _showMask,
        closeMask : _closeMask,
        removeMask: _removeMask,
        getVideoId: _getVideoId,
        scrollLeft: _scrollLeft,
        getSelectedTrip : _getSelectedElement,
        scrollRight: _scrollRight,
        setDuration: _setDuration,
        play: _play,
        stop: _stop,
        initialize: _initialize
    };
    
})();