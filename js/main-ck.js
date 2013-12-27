/* HEPL RIA 2013 - Test One
 *
 * JS Document - /js/main.js
 *
 * coded by [Julien Roland]
 * started at 28/10/13
 *//* jshint boss: true, curly: true, eqeqeq: true, eqnull: true, immed: true, latedef: true, newcap: true, noarg: true, browser: true, jquery: true, noempty: true, sub: true, undef: true, unused: true, white: false */(function(e){"use strict";var t,n=new google.maps.LatLng(50,8),r=new google.maps.Marker,i=new google.maps.Marker,s="./img/framework/icon/markerBank.png",o="./img/framework/icon/markerMy.png",u,a,f=e(".listing"),l=e("#agence"),c=e(".listGlobal .dimension"),h=e(".showMap"),p=e(".app"),d=e(".appDistrib"),v=10,m=20,g=60,y=50,b=5,w=1,E=[],S;e(function(){l.on("change",j);f.on("click",".more a",B);c.on("click","a",_);e(".mapInteraction").on("click","a",M);e(".reload").on("click","a",k);h.on("click","a",A);d.on("click","a",O);window.addEventListener("popstate",T)});var x=function(){e(".loading").delay(500).fadeOut("slow");$();history.pushState({selector:".app",old:".appDistrib"},"index","index.html");google.maps.event.addListener(r,"click",N);L()},T=function(e){C(e.state?e.state:"index.html")},N=function(e){console.log(e);console.log("ok")},C=function(t){if(t){var n=e(t.selector),r=e(t.old);r.fadeOut("fast");n.fadeIn("fast")}},k=function(){location.reload()},L=function(){navigator.geolocation?navigator.geolocation.getCurrentPosition(F,q):alert("Impossible de vous localiser !")},A=function(e){e.preventDefault();history.pushState({selector:".appDistrib",old:".app"},e.target.rel,e.target.rel+".html");p.fadeOut("fast");d.fadeIn()},O=function(e){e.preventDefault();history.pushState({selector:".app",old:".appDistrib"},e.target.rel,e.target.rel+".html");d.fadeOut("fast");p.fadeIn()},M=function(e){e.preventDefault();L()},_=function(e){e.preventDefault();var t;t=f.find(".dimension");if(w===1){D(t);c.find("a").css({backgroundImage:"url(./img/framework/icon/walk.png)"})}else if(w===2){H(t);c.find("a").css({backgroundImage:"url(./img/framework/icon/bird.png)"})}else if(w===3){P(t);c.find("a").css({backgroundImage:"url(./img/framework/icon/car.png)"})}},D=function(t){t.each(function(){var t=Math.round(.072*parseFloat(e(this).attr("data-dimension")));e(this).html(t+'"')});w=2},P=function(t){t.each(function(){var t=e(this).attr("data-dimension");e(this).html(t+"m")});w=1},H=function(t){t.each(function(){var t=Math.round(12*parseFloat(e(this).attr("data-dimension"))/1e3);e(this).html(t+"'")});w=3},B=function(t){t.preventDefault();var n=e(".more");if(v+m<=a.length){for(var r=v;r<=v+m-1;r++)if(a[r].bank){n.before('<li data-id="'+a[r].bank.id+'"><a href="javascript:void()" title="Voir la fiche de la"'+a[r].bank.name+'"><span class="overBank" style="color:white;background-color:#'+a[r].bank.color+'">Voir cette bank ('+a[r].bank.name+')</span><div class="infosBank" data-type="'+a[r].bank.color+'"><div class="logoBank"><img src="'+a[r].bank.icon+'" alt="Logo de la bank '+a[r].bank.name+'"></div><span style="color:#'+a[r].bank.color+'" class="titleBank">'+a[r].bank.name+'</span></div><div class="dimension" data-dimension="'+a[r].distance+'" style="background-color:#'+a[r].bank.color+'"><span>'+a[r].distance+"</span></div></a></li>");X(a[r].bank.id,E)||E.push([a[r].bank.id,a[r].bank.name])}W();U();v+=m}else{n.remove();alert("Il n' a pas d'autre distributeur dans la région !")}},j=function(t){var n=parseFloat(e(this).find("option:selected").val()),r=e(".listing li");if(n===0)r.slideDown();else{r.not("[data-id='"+n+"']").slideUp();e('.listing li[data-id="'+n+'"]').slideDown()}},F=function(e){u=e.coords;i.setMap(t);i.setPosition(new google.maps.LatLng(u.latitude,u.longitude));i.setIcon(o);V();R()},I=function(e,t){var n=10;return"http://ccapi.superacid.be/terminals?latitude="+e+"&longitude="+t+"&radius="+n},q=function(e){console.log(e)},R=function(){S=I(u.latitude,u.longitude);e.ajax({url:S,dataType:"json",type:"GET",cache:"true",success:function(e){console.log(e);if(e.error===!1){a=e.data;z(v);W();U()}}})},U=function(){for(var e=0;e<=v;e++)r=new google.maps.Marker({position:new google.maps.LatLng(a[e].latitude,a[e].longitude),map:t,icon:s,title:"Voir le detail de la banque"})},z=function(e){if(e+m<=a.length)for(var t=0;t<=e-1;t++){f.append('<li data-id="'+a[t].bank.id+'"><a href="javascript:void()" title="Voir la fiche de la"'+a[t].bank.name+'"><span class="overBank" style="color:white;background-color:#'+a[t].bank.color+'">Voir cette bank ('+a[t].bank.name+')</span><div class="infosBank" data-type="'+a[t].bank.color+'"><div class="logoBank"><img src="'+a[t].bank.icon+'" alt="Logo de la bank '+a[t].bank.name+'"></div><span style="color:#'+a[t].bank.color+'" class="titleBank">'+a[t].bank.name+'</span></div><div class="dimension" data-dimension="'+a[t].distance+'" style="background-color:#'+a[t].bank.color+'"><span>'+a[t].distance+"</span></div></a></li>");X(a[t].bank.id,E)||E.push([a[t].bank.id,a[t].bank.name])}},W=function(){var e=l.find("option");if(e.size()>1){e.remove();for(var t=0;t<=E.length-1;t++)l.append('<option value="'+E[t][0]+'">'+E[t][1]+"</option>");l.find("option:first-child").before('<option value="0">Toutes</option>')}else{for(var t=0;t<=E.length-1;t++)l.append('<option value="'+E[t][0]+'">'+E[t][1]+"</option>");f.append('<li class="more"><a href="" title="Voir plus de banques"><span class="icon icon-plus-grey"></span><span>Voir plus de distributeurs</span></a></li>')}},X=function(t,n){for(var r=0;r<=v;r++)if(e.inArray(t,n[r])>=0)return!0},V=function(){var e=new google.maps.LatLng(u.latitude,u.longitude);t.panTo(e)},$=function(){t=new google.maps.Map(document.getElementById("gmap"),{center:n,zoom:16,disableDefaultUI:!0,scrollwheel:!1,mapTypeId:google.maps.MapTypeId.ROADMAP})};e(window).ready(x)}).call(this,jQuery);