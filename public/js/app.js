var mapLoaded = false;
function initMap() {
    mapLoaded = true;
}
var IPS = ['68.109.164.88', '192.110.160.24', '24.56.31.0', '68.178.213.203', '68.2.16.30', '72.222.216.248', '69.53.221.39', '148.167.98.0'];
angular.module('AZTransferGeo', [])
  .controller('MainController', function( $scope, $http, $interval) {
    var map;
    var bounds;
    var stop;
    var cnt = 0;
    $scope.message = "Loading map, please wait ...";
    $scope.enGetMap = true;
    $scope.enGetData = true;
    $scope.enAutoFit = true;
    $scope.enLoading = true;
    stop = $interval(function() {
            if(mapLoaded){
                $interval.cancel(stop);
                stop = undefined;
                $scope.message = "Map loaded, please click 'Get Map' button";
                $scope.enGetMap = false;
            }
            cnt++;
            if(cnt>100){
                $scope.message = "Map loading error, please check internet connection and refresh the page";
                cnt = 0;
            }
          }, 100);

    $scope.getMap = function(){
        if(mapLoaded){
            $scope.enGetData = false;
            var coords = {latitude: 33.3699389, longitude: -111.88716840000001};
            map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: coords.latitude, lng: coords.longitude},
                    scrollwheel: false,
                    zoom: 10
                  });
        }
    };

    $scope.getData = function(){
        $scope.enAutoFit = false;
        bounds = new google.maps.LatLngBounds();
        IPS.forEach(function(item){
            var url = "http://ipinfo.io/" + item + "/geo"
            $http.get(url).then(function(response){
                var geoLoc = response.data;
                var title = geoLoc.ip + ', ' + geoLoc.city + ', ' + geoLoc.region + ', ' + geoLoc.country + ', ' + geoLoc.postal;
                var loc = geoLoc.loc.split(',');
                var myLatLng = {lat: Number(loc[0]), lng: Number(loc[1])};
                var marker = new google.maps.Marker({
                  position: myLatLng,
                  map: map,
                  title: title
                });
                var contentString = "<div>" + title + "     with more information</div>";
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                bounds.extend(marker.position);
                marker.addListener('click', function() {
                infowindow.open(map, marker);
                });
            },function(error){});
        })
    };
        
    $scope.autoFit = function(){
         map.fitBounds(bounds);
    };
  });