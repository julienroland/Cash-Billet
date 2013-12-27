
/* HEPL RIA 2013 - Test One
 *
 * JS Document - /js/main.js
 *
 * coded by [Julien Roland]
 * started at 28/10/13
 */

 /* jshint boss: true, curly: true, eqeqeq: true, eqnull: true, immed: true, latedef: true, newcap: true, noarg: true, browser: true, jquery: true, noempty: true, sub: true, undef: true, unused: true, white: false */
 ;(function( $ ){

 	"use strict";
 	var gMap,
 	gStartPosition = new google.maps.LatLng(50 ,8 ),
 	gMarkerBank = [],
 	aMarkerBank ={},
 	gMarkerMy = new google.maps.Marker,
 	uIconBank = './img/framework/icon/markerBank.png',
 	uIconMy = './img/framework/icon/markerMy.png',
 	oMyPosition,
 	oData,
 	oDataOne,
 	$listBank = $('.listing'),
 	$listAgences = $('#agence'),
 	$dimension = $('.listGlobal .dimension'),
 	$showMapOnly = $('.showMap'),
 	$app = $('.app'),
 	$appMap = $('.appDistrib'),
 	$appOne = $('.appOne'),
 	nMaxList = 10,
 	addMoreBank = 20,
 	nTime = 60,
 	nCarSpeed = 50,
 	nFootSpeed = 5,
 	nTypeUnit = 1, //1  = mètre, 2 = seconde,3 = minute
 	aAgences = [],
 	uUrlAPI;

 	$(function(){
 		$listAgences.on('change',orderByAgence);
 		$listBank.on('click', '.more a' ,moreBankInList );
 		$dimension.on('click','a',changeUnit);
 		$('.mapInteraction').on('click','a',interactionMap);
 		$('.reload').on('click','a',reloadPage);
 		$showMapOnly.on('click','a',changeViewToMap);
 		$appMap.on('click','a',changeViewToList);

 		window.addEventListener( "popstate", historyHasChanged);


 	});

 	var initialize = function(){

 		$('.loading').delay(500).fadeOut('slow');

 		displayGoogleMap();

 		history.pushState ( {selector:'.app',old:'.appDistrib'}, "index", "index.html");

 		

 		locateMe();
 	};
 	var historyHasChanged = function( e ){
 		changeView(e.state ? e.state : "index.html");

 	};
 	var showThisBank = function( e ){
 		oDataOne = oData[this.id];
 		changeViewToOne( oDataOne );

 	};
 	var changeView = function( oSelector ){
 		if(oSelector){
 			var $selector = $(oSelector.selector),
 			$old = $(oSelector.old);

 			$old.fadeOut('fast');
 			$selector.fadeIn('fast');
 		}
 	};
 	var reloadPage = function(){
 		location.reload();
 	};
 	var locateMe = function(){
 		if(navigator.geolocation){
 			navigator.geolocation.getCurrentPosition(getPositionSucces,getPositionError);
 		}else{

 			alert('Impossible de vous localiser !');
 		}
 	};
 	var changeViewToMap = function( e ){
 		e.preventDefault();
 		history.pushState ( {selector:'.appDistrib',old:'.app'}, e.target.rel, e.target.rel + ".html");
 		$app.fadeOut('fast');
 		$appMap.fadeIn();

 	};
 	var changeViewToList = function( e ){
 		e.preventDefault();
 		history.pushState ( {selector:'.app',old:'.appDistrib'}, e.target.rel, e.target.rel + ".html");
 		$appMap.fadeOut('fast');
 		$app.fadeIn();

 	};	
 	var changeViewToOne = function( oDataOne ){

 		//history.pushState ( {selector:'.app',old:'.appDistrib'}, e.target.rel, e.target.rel + ".html");
 		$appMap.fadeOut('fast');
 		$app.fadeOut('fast');
 		$appOne.fadeIn();

 		console.log( oDataOne );
 		var foot  = Math.round((( nTime / nFootSpeed ) * parseFloat(oDataOne.distance) / 1000));
 		//header
 		$appOne.find('.details').css('background-color','#'+oDataOne.bank.color);
 		$appOne.find('img').attr('src',oDataOne.bank.icon);
 		$appOne.find('h2').html(oDataOne.bank.name);
 		$appOne.find('h2>a').attr('href',oDataOne.bank.url);
 		$appOne.find('address').html(oDataOne.address);
 		//distance
 		$appOne.find('.nb').html(foot+'\'');
 		$appOne.find('.distance>span').html(oDataOne.distance+'m');


 	};
 	var interactionMap = function( e ){
 		e.preventDefault();
 		locateMe();
 	};
 	var changeUnit = function( e ){
 		e.preventDefault();
 		var $Dimension;
 		$Dimension = $listBank.find('.dimension');

 		if(nTypeUnit === 1){ //mètre
 			toTimeCar( $Dimension);
 			$dimension.find('a').css({
 				backgroundImage: 'url(./img/framework/icon/walk.png)',
 			});
 		}
 		else if(nTypeUnit === 2){ //seconde car
 			
 			toTimeFoot( $Dimension);
 			$dimension.find('a').css({
 				backgroundImage: 'url(./img/framework/icon/bird.png)',
 			});
 		}
 		else if(nTypeUnit === 3){ //minute foot
 			toMeter( $Dimension);

 			$dimension.find('a').css({
 				backgroundImage: 'url(./img/framework/icon/car.png)',
 			});
 		}
 		
 	};
 	var toTimeCar = function( $Dimension ){ // etape 1
 		$Dimension.each(function(){
 			var time  = Math.round(( 3600 / 50000 ) * parseFloat($(this).attr('data-dimension')));
 			$(this).html(time+'\"');
 		});
 		nTypeUnit = 2; //minute car
 		
 	};
 	var toMeter = function( $Dimension ){
 		$Dimension.each(function(){
 			var meter  = $(this).attr('data-dimension');
 			$(this).html(meter+'m');
 		});
 		nTypeUnit = 1; //meter
 		
 	};
 	var toTimeFoot = function( $Dimension ){// etape 2
 		$Dimension.each(function(){
 			var time  = Math.round((( 60 / 5 ) * parseFloat($(this).attr('data-dimension')) / 1000));
 			$(this).html(time+'\'');
 		});
 		nTypeUnit = 3; //seconde car
 		
 	};
 	var moreBankInList = function( e ){
 		e.preventDefault();
 		var $more = $('.more');
 		if((nMaxList + addMoreBank) <= oData.length){

 			for( var i = nMaxList; i<=(nMaxList+addMoreBank)-1; i++){

 				if(oData[i].bank){

 					$more.before('<li data-id="'+i+'" data-idBank="'+oData[i].bank.id+'"><a href="javascript:void()" title="Voir la fiche de la"'+oData[i].bank.name+'"><span class="overBank" style="color:white;background-color:#'+oData[i].bank.color+'">Voir cette bank ('+oData[i].bank.name+')</span><div class="infosBank" data-type="'+oData[i].bank.color+'"><div class="logoBank"><img src="'+oData[i].bank.icon+'" alt="Logo de la bank '+oData[i].bank.name+'"></div><span style="color:#'+oData[i].bank.color+'" class="titleBank">'+oData[i].bank.name+'</span></div><div class="dimension" data-dimension="'+oData[i].distance+'" style="background-color:#'+oData[i].bank.color+'"><span>'+oData[i].distance+'</span></div></a></li>');

 					if(!agenceExist(oData[i].bank.id , aAgences)){
 						aAgences.push([oData[i].bank.id,oData[i].bank.name]);
 					}
 				}
 			};
 			
 			addAgenceSelect();
 			drawBankMarker(  );
 			nMaxList += addMoreBank;
 		}
 		else{
 			$more.remove();
 			alert('Il n\' a pas d\'autre distributeur dans la région !');
 		}

 	};

 	var orderByAgence = function( e ){
 		var nIdBank = parseFloat($(this).find('option:selected').val());
 		var $listingLi = $('.listing li');
 		if(nIdBank === 0){

 			$listingLi.slideDown();

 		}else{

 			$listingLi.not("[data-idBank='"+nIdBank+"']").slideUp();
 			$('.listing li[data-idBank="'+nIdBank+'"]').slideDown();

 		}
 	};
 	var getPositionSucces = function( oPosition ){ 
 		oMyPosition = oPosition.coords;  //OBJ LAT LNG;

 		gMarkerMy.setMap( gMap );
 		gMarkerMy.setPosition( new google.maps.LatLng(oMyPosition.latitude,oMyPosition.longitude ));
 		gMarkerMy.setIcon( uIconMy);
 		
 		
 		updatePosition(); //Recentrer sur la position
 		requestBankFromApi(); //demander les banks
 	};	
 	var createUrlAPI = function( nLat, nLong){
 		var nRadius = 10;
 		//console.log('la:'+ nLat + 'long:'+ nLong + 'r:'+nRadius );
 		return "http://ccapi.superacid.be/terminals?latitude="+nLat+"&longitude="+nLong+"&radius="+nRadius;
 	};
 	var getPositionError = function( oError ){
 		console.log(oError);

 	};
 	var requestBankFromApi = function(  ){

 		uUrlAPI = createUrlAPI( oMyPosition.latitude, oMyPosition.longitude );

 		$.ajax({
 			url:uUrlAPI,
 			dataType: 'json',
 			type: 'GET',
 			cache:'true',
 			success:function(oResponse){
 				console.log(oResponse);
 				if(oResponse.error === false){

 					oData = oResponse.data;
 					
 					displayList( nMaxList );
 					addAgenceSelect(  );
 					drawBankMarker(  );
 					
 					
 				};
 			},
 		});
 	};
 	var drawBankMarker = function(){
 		for(var i = 0; i<=nMaxList-1;i++){
 			var marker
 			
 			marker = new google.maps.Marker({
 				position: new google.maps.LatLng(oData[i].latitude,oData[i].longitude),
 				map: gMap,
 				icon: uIconBank,
 				id: i,
 				title:"Voir le detail de la banque"
 			});
 			gMarkerBank.push(marker);
 			google.maps.event.addListener(marker, "click",showThisBank);
 		}
 	};

 	var displayList = function( nMaxList ){
 		if((nMaxList + addMoreBank) <= oData.length){
 			for( var i = 0; i<=nMaxList-1; i++){

 				$listBank.append('<li data-id="'+i+'" data-idBank="'+oData[i].bank.id+'"><a href="javascript:void()" title="Voir la fiche de la"'+oData[i].bank.name+'"><span class="overBank" style="color:white;background-color:#'+oData[i].bank.color+'">Voir cette bank ('+oData[i].bank.name+')</span><div class="infosBank" data-type="'+oData[i].bank.color+'"><div class="logoBank"><img src="'+oData[i].bank.icon+'" alt="Logo de la bank '+oData[i].bank.name+'"></div><span style="color:#'+oData[i].bank.color+'" class="titleBank">'+oData[i].bank.name+'</span></div><div class="dimension" data-dimension="'+oData[i].distance+'" style="background-color:#'+oData[i].bank.color+'"><span>'+oData[i].distance+'</span></div></a></li>');

 				if(!agenceExist(oData[i].bank.id , aAgences)){
 					aAgences.push([oData[i].bank.id,oData[i].bank.name]);
 				}

 			};
 		}
 	};
 	var addAgenceSelect = function(  ){
 		var $OptionSelect = $listAgences.find('option');

 		if($OptionSelect.size() > 1){

 			$OptionSelect.remove();

 			for( var i = 0; i<=aAgences.length -1; i++){

 				$listAgences.append('<option value="'+aAgences[i][0]+'">'+aAgences[i][1]+'</option>');
 			}
 			$listAgences.find('option:first-child').before('<option value="0">Toutes</option>');

 		}else{

 			for( var i = 0; i<=aAgences.length -1; i++){

 				$listAgences.append('<option value="'+aAgences[i][0]+'">'+aAgences[i][1]+'</option>');
 			}
 			$listBank.append('<li class="more"><a href="" title="Voir plus de banques"><span class="icon icon-plus-grey"></span><span>Voir plus de distributeurs</span></a></li>');
 		}


 		
 		
 	};
 	var agenceExist  = function( aBaseArray , aArrayToCheck ){

 		for(var a = 0; a<=nMaxList; a++){

 			if($.inArray( aBaseArray , aArrayToCheck[a] ) >= 0){
 				return true;

 			}	
 		}
 	};
 	var updatePosition = function(  ){
 		var gMyPosition = new google.maps.LatLng( oMyPosition.latitude , oMyPosition.longitude );
 		gMap.panTo( gMyPosition );


 	};
 	var displayGoogleMap = function(){

 		gMap = new google.maps.Map(document.getElementById('gmap'),{
 			center:gStartPosition,
 			zoom:16,
 			disableDefaultUI:true,
 			scrollwheel:false,
 			mapTypeId:google.maps.MapTypeId.ROADMAP,
 		});

 	};



 	$( window ).ready( initialize );

 }).call(this,jQuery);