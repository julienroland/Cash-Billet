
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
 	$listBank = $('.listing'),
 	$listAgences = $('.agences'),
 	uUrlAPI;

 	$(function(){
 		$listAgences.on('change',orderByAgence);

 	});

 	var initialize = function(){

 		$('.loading').delay(500).fadeOut('slow');

 		displayGoogleMap();

 		if(navigator.geolocation){
 			navigator.geolocation.getCurrentPosition(getPositionSucces,getPositionError);
 		}
 	};
 	var orderByAgence = function(){
 		console.log('d');
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
 					var aAgences = [];

 					/* AFFICHER LES BANKS DANS LE HTML*/
 					for( var i = 0; i<=10; i++){

 						$listBank.append('<li><a href="javascript:void()" title="Voir la fiche de la"'+oData[i].bank.name+'"><span class="overBank" style="color:white;background-color:#'+oData[i].bank.color+'">Voir cette bank ('+oData[i].bank.name+')</span><div class="infosBank" data-type="'+oData[i].bank.color+'"><div class="logoBank"><img src="'+oData[i].bank.icon+'" alt="Logo de la bank '+oData[i].bank.name+'"></div><span style="color:#'+oData[i].bank.color+'" class="titleBank">'+oData[i].bank.name+'</span></div><div class="dimension" style="background-color:#'+oData[i].bank.color+'"><span>'+oData[i].distance+'</span></div></a></li>');
 						/* AFFICHER LA LISTE DES NOMS DE BANK DANS LE SELECT*/

 						aAgences[oData[i].bank.id] = oData[i].bank.name;

 						
 					};
 					
 					console.log(aAgences);
 					$listBank.append('<li class="more"><a href="javascript:void()" title="Voir plus de banques"><span class="icon icon-plus-grey"></span><span>Voir plus de distributeurs</span></a></li>');
 					
 					/* AFFICHER LA LISTE DES NOMS DE BANK DANS LE SELECT*/
 					for( var i = 0; i<=aAgences.id; i++){

 						$listAgences.append(aAgences[i]);
 					}
 					

 				}else{
 					//TODO AFFICHER UN MESSAGE D ERREUR
 				}
 			},
 		});
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