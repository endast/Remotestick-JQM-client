$( '#index' ).live( 'pageinit',function(event){

	$.getJSON('../devices.json', function(data) {

		$.each(data.devices, function(key, value) { 
			$("#indexList").append('<li><a href="#controlPage?deviceId='+value.id+'">'+value.name+'</a></li>');
		});
		
		$('#indexList').listview('refresh');
	});
	

	$(document).bind( "pagebeforechange", function( e, data ) {

		if ( typeof data.toPage === "string" ) {

			var u = $.mobile.path.parseUrl( data.toPage ),
				re = /^#controlPage/;

			if ( u.hash.search(re) !== -1 ) {
				showDevice( u, data.options );
				e.preventDefault();
			}
		}
	});
	
	
	$( '#controlPage' ).live( 'pagehide',function(event, ui){
		// Hide all controllers when exiting the controll page
		hideControllers();
	});


	function showDevice( urlObj, options )
	{
		var deviceId = urlObj.hash.replace( /.*deviceId=/, "" )

		var	pageSelector = urlObj.hash.replace( /\?.*$/, "" );

			$.getJSON('../devices/'+deviceId+'.json', function(device) {
					
					if ( device ) {

						var $page = $( pageSelector );

						var	$header = $page.children( ":jqmData(role=header)" );

						var	$content = $page.children( ":jqmData(role=content)" );
						
						$.each(device.supportedMethods, function(index, supportedMethod) { 
						  	
							if(supportedMethod.name == "TELLSTICK_TURNON" ){

									$('#on').show();
														
							} else if(supportedMethod.name == "TELLSTICK_TURNOFF"){
									
								$('#off').show();

							}	else if(supportedMethod.name == "TELLSTICK_DIM"){

								$('#dimmerContainer').show();
									
							}
								
						});
					
						$header.find( "h1" ).html( device.name );

						$page.page();
						options.dataUrl = urlObj.href;
						$.mobile.changePage( $page, options );
					}
										
				});
	}

	function hideControllers(){
		$('#on').hide();
		$('#off').hide();
		$('#dimmerContainer').hide();
	}

	function turnOn(){
		$.getJSON('../devices/'+getId()+'/on.json');
		
	}
	
	function turnOff(){
		$.getJSON('../devices/'+getId()+'/off.json');
	}
	
	function getId(){
		var id = jQuery(location).attr('href').split("=")[1];
		return id
	}
	
	$("#off").click(function() {
		turnOff();
	});
	
	$("#on").click(function() {
		turnOn();
	});
	
	$("#dim").live("change", function() {
		var dim_value = $(this).val();
		$.getJSON('../devices/'+getId()+'/dim/'+dim_value+'.json');
		
	    console.log(dim_value);
	  });

});