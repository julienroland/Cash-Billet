
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
 	gMarker = new google.maps.Marker,
 	oMyPosition,
 	oData,
 	a,
 	found = -1,
 	$listBank = $('.listing'),
 	$listAgences = $('#agence'),
 	nMaxList = 10,
 	addMoreBank = 20,
 	aAgences = [],
 	uUrlAPI;

 	$(function(){
 		$listAgences.on('change',orderByAgence);
 		$('.listing').on('click', '.more a' ,moreBankInList );

 	});

 	var initialize = function(){

 		$('.loading').delay(500).fadeOut('slow');

 		displayGoogleMap();

 		if(navigator.geolocation){
 			navigator.geolocation.getCurrentPosition(getPositionSucces,getPositionError);
 		}
 	};
 	var moreBankInList = function( e ){
 		e.preventDefault();
 		
 		console.log('max:'+oData.length);
 		console.log('maxList:'+nMaxList);

 		if((nMaxList + addMoreBank) <= oData.length){

 			for( var i = nMaxList; i<=(nMaxList+addMoreBank)-1; i++){
 				console.log(oData[i].bank);
 				if(oData[i].bank){

 					$('.more').before('<li data-id="'+oData[i].bank.id+'"><a href="javascript:void()" title="Voir la fiche de la"'+oData[i].bank.name+'"><span class="overBank" style="color:white;background-color:#'+oData[i].bank.color+'">Voir cette bank ('+oData[i].bank.name+')</span><div class="infosBank" data-type="'+oData[i].bank.color+'"><div class="logoBank"><img src="'+oData[i].bank.icon+'" alt="Logo de la bank '+oData[i].bank.name+'"></div><span style="color:#'+oData[i].bank.color+'" class="titleBank">'+oData[i].bank.name+'</span></div><div class="dimension" style="background-color:#'+oData[i].bank.color+'"><span>'+oData[i].distance+'</span></div></a></li>');

 					if(!agenceExist(oData[i].bank.id , aAgences)){
 						aAgences.push([oData[i].bank.id,oData[i].bank.name]);
 					}
 				}
 			};
 			addAgenceSelect();
 		}
 		nMaxList += addMoreBank; 
 	};

 	var orderByAgence = function( e ){
 		var nIdBank = parseFloat($(this).find('option:selected').val());
 		
 		if(nIdBank === 0){

 			$('.listing li').slideDown();

 		}else{

 			$('.listing li').not("[data-id='"+nIdBank+"']").slideUp();
 			$('.listing li[data-id="'+nIdBank+'"]').slideDown();

 		}
 	};
 	var getPositionSucces = function( oPosition ){ 
 		oMyPosition = oPosition.coords;  //OBJ LAT LNG;
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
 					
 				};
 			},
 		});
 	};
 	var displayList = function( nMaxList ){
 		if((nMaxList + addMoreBank) <= oData.length){
 			for( var i = 0; i<=nMaxList-1; i++){

 				$listBank.append('<li data-id="'+oData[i].bank.id+'"><a href="javascript:void()" title="Voir la fiche de la"'+oData[i].bank.name+'"><span class="overBank" style="color:white;background-color:#'+oData[i].bank.color+'">Voir cette bank ('+oData[i].bank.name+')</span><div class="infosBank" data-type="'+oData[i].bank.color+'"><div class="logoBank"><img src="'+oData[i].bank.icon+'" alt="Logo de la bank '+oData[i].bank.name+'"></div><span style="color:#'+oData[i].bank.color+'" class="titleBank">'+oData[i].bank.name+'</span></div><div class="dimension" style="background-color:#'+oData[i].bank.color+'"><span>'+oData[i].distance+'</span></div></a></li>');

 				if(!agenceExist(oData[i].bank.id , aAgences)){
 					aAgences.push([oData[i].bank.id,oData[i].bank.name]);
 				}

 			};
 		}
 	};
 	var addAgenceSelect = function(  ){

 		console.log($(this));
 		if($listAgences.find('option').size() > 1){

 			$listAgences.find('option').remove();

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
 			zoom:10,
 			disableDefaultUI:true,
 			scrollwheel:false,
 			mapTypeId:google.maps.MapTypeId.ROADMAP,
 		});

 	};



 	$( window ).ready( initialize );

 }).call(this,jQuery);