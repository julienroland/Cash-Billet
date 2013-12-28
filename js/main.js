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
 	gStartPosition = new google.maps.LatLng(50.833 ,4.333 ),
 	gMarkerBank,
 	gMarkerMy= new google.maps.Marker,
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
 	addMoreBank = 10,
 	nTime = 60,
 	nCarSpeed = 50,
 	nFootSpeed = 5,
	nTypeUnit = 1, //1  = mètre, 2 = seconde,3 = minute
	nTypeUnitOne = 1, //1 = minute(foot) 2 = seconde(car)
	aAgences = [],
	uUrlAPI,
	sBasePath = '/cashcash/';

	$(function(){
		$listAgences.on('change',orderByAgence);
		$listBank.on('click', '.more a' ,moreBankInList );
		$dimension.on('click','a',changeUnit);
		$('.mapInteraction').on('click','a',interactionMap);
		$('.reload').on('click','a',reloadPage);
		$showMapOnly.on('click','a',changeViewToMap);
		$appMap.on('click','a',changeViewToList);
		$('.time').on('click','a',changeUnitOne);
		$listBank.on('click','.bank a',changeViewToOneFromApp);
		$('.back').on('click','a',backHistory);

		console.log(location.pathname.replace( sBasePath, "").replace (".html",""));
		if(location.pathname !== sBasePath && location.pathname !== sBasePath + "index.html"){
			whenReloadedPage(location.pathname.replace( sBasePath, "").replace (".html",""));

		}

		window.addEventListener( "popstate", historyHasChanged);
		

	});

	var initialize = function(){

		$('.loading').delay(500).fadeOut('slow');

		displayGoogleMap();

		history.pushState ( {selector:'.app'}, "index", "index.html");

		locateMe();
	};
	var displayGoogleMap = function(){

		gMap = new google.maps.Map(document.getElementById('gmap'),{
			center:gStartPosition,
			zoom:14,
			disableDefaultUI:true,
			scrollwheel:false,
			mapTypeId:google.maps.MapTypeId.ROADMAP,
		});

	};
	var backHistory = function(){
		history.back();
	};
	var historyHasChanged = function( e ){
		changeView(e.state ? e.state : "index.html");

	};
	var showThisBank = function(){
		oDataOne = oData[this.id];
		changeViewToOne( oDataOne , this.id);

	};
	var whenReloadedPage = function( sPath ){

		if(sPath == 'index'){
			$appMap.fadeOut('fast');
			$appOne.fadeOut('fast');
			$app.fadeIn('fast');
		}
		else if(sPath == 'carte'){
			$app.fadeOut('fast');
			$appOne.fadeOut('fast');
			$appMap.fadeIn('fast');
		}

	};
	var changeView = function( oSelector ){
		if(oSelector){
			var $selector = $(oSelector.selector);
			if($selector.selector === $app.selector){

				$appMap.fadeOut('fast');
				$appOne.fadeOut('fast');
				$app.fadeIn('fast');
				for(var i  = 0;i<=nMaxList-1; i++){
					gMarkerBank[i].setMap( gMap );
				}
				updatePosition();
			}
			else if($selector.selector === $appMap.selector){

				$app.fadeOut('fast');
				$appOne.fadeOut('fast');
				$appMap.fadeIn('fast');
				for(var i  = 0;i<=nMaxList-1; i++){
					gMarkerBank[i].setMap( gMap );
				}
				updatePosition();
			}
			else if($selector.selector === $appOne.selector){

				$app.fadeOut('fast');
				$appMap.fadeOut('fast');
				$appOne.fadeIn('fast'); 

			}
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
		history.pushState ( {selector:'.appDistrib'}, e.target.rel, e.target.rel + ".html");
		$app.fadeOut('fast');
		$appMap.fadeIn();

	};
	var changeViewToList = function( e ){
		e.preventDefault();
		history.pushState ( {selector:'.app'}, e.target.rel, e.target.rel + ".html");
		$appMap.fadeOut('fast');
		$app.fadeIn();

	};  
	var changeViewToOneFromApp = function( e ){
		e.preventDefault();
		history.pushState ( {selector:'.appOne'}, $(this).attr('rel'), $(this).attr('rel').toLowerCase().split(' ').join('-') + ".html");
		$appMap.fadeOut('fast');
		$app.fadeOut('fast');
		$appOne.fadeIn();

		var nId = parseFloat($(this).attr('data-id'));
		oDataOne = oData[nId];
		showOnlyOneMarker( nId );

		//header
		$appOne.find('.details').css('background-color','#'+oDataOne.bank.color);
		$appOne.find('img').attr('src',oDataOne.bank.icon);
		$appOne.find('h2').html(oDataOne.bank.name);
		$appOne.find('h2>a').attr('href',oDataOne.bank.url);
		$appOne.find('address').html(oDataOne.address);
		//distance
		$appOne.find('.nb').html(toOneFoot(oDataOne.distance));
		$appOne.find('.nb').attr('data-distance',oDataOne.distance);
		$appOne.find('.distance>span').html(oDataOne.distance+'m');
	};
	var showOnlyOneMarker = function( nId ){
		for(var i = 0 ; i<=nMaxList-1; i++){
			if(i !== nId ){

				gMarkerBank[i].setMap( null );
			}
		}
		var gOnePosition = new google.maps.LatLng( oData[nId].latitude , oData[nId].longitude );
		gMap.panTo( gOnePosition );

	};
	var changeViewToOne = function( oDataOne , nId ){
		history.pushState ( {selector:'.appOne'}, oDataOne.bank.name, 'bank-'+oDataOne.bank.name.toLowerCase().split(' ').join('-')+ ".html");
		$appMap.fadeOut('fast');
		$app.fadeOut('fast');
		$appOne.fadeIn();

		showOnlyOneMarker( nId );

		//header
		$appOne.find('.details').css('background-color','#'+oDataOne.bank.color);
		$appOne.find('img').attr('src',oDataOne.bank.icon);
		$appOne.find('h2').html(oDataOne.bank.name);
		$appOne.find('h2>a').attr('href',oDataOne.bank.url);
		$appOne.find('address').html(oDataOne.address);
		//distance
		$appOne.find('.nb').html(toOneFoot(oDataOne.distance)+'\'');
		$appOne.find('.nb').attr('data-distance',oDataOne.distance);
		$appOne.find('.distance>span').html(oDataOne.distance+'m');


	};
	var addAgenceSelect = function(  ){
		var $OptionSelect = $listAgences.find('option');
		var i;
		if($OptionSelect.size() > 1){

			$OptionSelect.remove();
			
			for( i = 0; i<=aAgences.length -1; i++){

				$listAgences.append('<option value="'+aAgences[i][0]+'">'+aAgences[i][1]+'</option>');
			}
			$listAgences.find('option:first-child').before('<option value="0">Toutes</option>');

		}else{

			for( i = 0; i<=aAgences.length -1; i++){

				$listAgences.append('<option value="'+aAgences[i][0]+'">'+aAgences[i][1]+'</option>');
			}
			$listBank.append('<li class="more"><a href="" title="Voir plus de banques"><span class="icon icon-plus-grey"></span><span>Voir plus de distributeurs</span></a></li>');
		}
		
	};
	var changeUnitOne = function( e ){
		e.preventDefault();
		var nDistance;
		if(nTypeUnitOne === 1 ){
			nDistance  = parseFloat($(this).find('.nb').attr('data-distance'));
			$appOne.find('.nb').html(toOneCar( nDistance ));
			$appOne.find('.icon').removeClass('icon-foot');
			$appOne.find('.icon').addClass('icon-car');
			nTypeUnitOne = 2;

		}
		else if(nTypeUnitOne === 2 ){
			nDistance  = parseFloat($(this).find('.nb').attr('data-distance'));
			$appOne.find('.nb').html(toOneFoot( nDistance ));
			$appOne.find('.icon').removeClass('icon-car');
			$appOne.find('.icon').addClass('icon-foot');
			nTypeUnitOne = 1;
		}

	};
	var toOneCar = function( nDistance ){
		var time = ((nTime * nTime) / (nCarSpeed * 1000) ) * nDistance;
			if(time >= nTime){

				var nTimeM  = Math.floor(time / nTime) +'\'' ;
				var nTimeS  = Math.round(time % nTime) +'\"' ;

				return nTimeM + nTimeS;
			}
			else{

				return Math.round(time)+'\"';
			}
		};
		var toOneFoot = function( nDistance ){
			var time = (nTime / nFootSpeed ) * parseFloat(nDistance) / 1000;
			if(time < 1){
				return  Math.round((time / 1) * nTime)+'\"';

			}
			else{
				var nTtime = time * nTime;

				var nTimeM  = Math.floor(nTtime / nTime) +'\'' ;
				var nTimeS  = Math.round(nTtime % nTime) +'\"' ;
				return nTimeM + nTimeS;
			}
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
			var time  = ((nTime * nTime) / (nCarSpeed * 1000)) * parseFloat($(this).attr('data-dimension'));

			if(time >= nTime){

				var nTimeM  = Math.floor(time / nTime) +'\'' ;
				var nTimeS  = Math.round(time % nTime) +'\"' ;

				$(this).html(nTimeM + nTimeS);
			}
			else{

				$(this).html(Math.round(time)+'\"');
			}
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
			var time  = (( nTime / nFootSpeed ) * parseFloat($(this).attr('data-dimension')) / 1000);
			if(time < 1){
				time  = Math.round((time / 1) * nTime);
				$(this).html(time+'\"');
			}
			else{
				var nTtime = time * nTime;

				var nTimeM  = Math.floor(nTtime / nTime) +'\'' ;
				var nTimeS  = Math.round(nTtime % nTime) +'\"' ;
				$(this).html(nTimeM + nTimeS);
			}


		});
		nTypeUnit = 3; //seconde car
		
	};
	var agenceExist  = function( aBaseArray , aArrayToCheck ){

		for(var a = 0; a<=nMaxList; a++){

			if($.inArray( aBaseArray , aArrayToCheck[a] ) >= 0){
				return true;

			}   
		}
	};
	var moreBankInList = function( e ){
		e.preventDefault();
		var $more = $('.more');
		var sWhichUnit; 
		if((nMaxList + addMoreBank) <= oData.length){

			for( var i = nMaxList; i<=(nMaxList+addMoreBank)-1; i++){

				if(oData[i].bank){

					if(nTypeUnit === 1 ){
						sWhichUnit = oData[i].distance+'m';
					}
					else if(nTypeUnit === 2){
						sWhichUnit = toOneCar(oData[i].distance);
					}
					else if(nTypeUnit === 3){
						sWhichUnit = toOneFoot(oData[i].distance);

					}

					$more.before('<li class="bank" data-idBank="'+oData[i].bank.id+'"><a data-id="'+i+'" href="javascript:void()" rel="'+oData[i].bank.name+'" title="Voir la fiche de la'+oData[i].bank.name+'"><span class="overBank" style="color:white;background-color:#'+oData[i].bank.color+'">Voir cette bank ('+oData[i].bank.name+')</span><div class="infosBank" data-type="'+oData[i].bank.color+'"><div class="logoBank"><img src="'+oData[i].bank.icon+'" alt="Logo de la bank '+oData[i].bank.name+'"></div><span style="color:#'+oData[i].bank.color+'" class="titleBank">'+oData[i].bank.name+'</span></div><div class="dimension" data-dimension="'+oData[i].distance+'" style="background-color:#'+oData[i].bank.color+'"><span>'+sWhichUnit+'</span></div></a></li>');

					if(!agenceExist(oData[i].bank.id , aAgences)){
						aAgences.push([oData[i].bank.id,oData[i].bank.name]);
					}
				}
			}
			addAgenceSelect();
			drawBankMarker();
			nMaxList += addMoreBank;
			
		}
		else
		{
			$more.remove();
			alert('Il n\' a pas d\'autre distributeur dans la région !');
		}

	};
	var orderByAgence = function(){
		var nIdBank = parseFloat($(this).find('option:selected').val());
		var $listingLi = $('.listing li');
		if(nIdBank === 0){

			$listingLi.slideDown();

		}else{

			$listingLi.not("[data-idBank='"+nIdBank+"']").slideUp();
			$('.listing li[data-idBank="'+nIdBank+'"]').slideDown();

		}
	};
	var updatePosition = function(  ){
		var gMyPosition = new google.maps.LatLng( oMyPosition.latitude , oMyPosition.longitude );
		gMap.panTo( gMyPosition );

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

				if(oResponse.error === false){

					oData = oResponse.data;
					
					displayList( nMaxList );
					addAgenceSelect(  );
					drawBankMarker(  );
					
					
				}
			}
		});
	};
	var drawBankMarker = function(){
		var marker;
		if(!gMarkerBank){
			gMarkerBank = [];
			for(var i = 0; i<=nMaxList-1;i++){
				
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
		}
		else
		{
			for( var i = nMaxList; i<=(nMaxList+addMoreBank)-1; i++){
				
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
		}

	};

	var displayList = function( nMaxList ){
		if((nMaxList + addMoreBank) <= oData.length){
			for( var i = 0; i<=nMaxList-1; i++){
				if(oData[i].bank){
					
					$listBank.append('<li class="bank" data-idBank="'+oData[i].bank.id+'"><a data-id="'+i+'" rel="'+oData[i].bank.name+'" href="javascript:void()" title="Voir la fiche de la'+oData[i].bank.name+'"><span class="overBank" style="color:white;background-color:#'+oData[i].bank.color+'">Voir cette bank ('+oData[i].bank.name+')</span><div class="infosBank" data-type="'+oData[i].bank.color+'"><div class="logoBank"><img src="'+oData[i].bank.icon+'" alt="Logo de la bank '+oData[i].bank.name+'"></div><span style="color:#'+oData[i].bank.color+'" class="titleBank">'+oData[i].bank.name+'</span></div><div class="dimension" data-dimension="'+oData[i].distance+'" style="background-color:#'+oData[i].bank.color+'"><span>'+oData[i].distance+'m</span></div></a></li>');

					if(!agenceExist(oData[i].bank.id , aAgences)){
						aAgences.push([oData[i].bank.id,oData[i].bank.name]);
					}

				}
			}
		}
	};

	$( window ).ready( initialize );

}).call(this,jQuery);