
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
 	gMarker = new google.maps.Marker;

 	$(function(){

 		//displayGoogleMap();

 		//window.addEventListener( "popstate", historyHasChanged);
 	});
 	var initialize = function(){
 		$('.loading').delay(500).fadeOut('slow');

 		displayGoogleMap();
 	}
 	var displayGoogleMap = function(){

 		gMap = new google.maps.Map(document.getElementById('gmap'),{
 			center:gStartPosition,
 			zoom:10,
 			disableDefaultUI:true,
 			scrollwheel:false,
 			mapTypeId:google.maps.MapTypeId.ROADMAP,
 		});

 	};


 	$( document ).ready( initialize );

 }).call(this,jQuery);