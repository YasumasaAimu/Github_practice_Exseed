let map;
let markers;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 35.6895, lng: 139.6917}, 
        zoom: 15
    });

    marker = new google.maps.Marker({
        position: {lat: 35.6895, lng: 139.6917},
        map: map,
        draggable: true 
    });

    map.addListener('click', function(event) {
        marker.setPosition(event.latLng);
    });
}






 async function generateCourse() {
    
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        setTimeout(generateCourse, 500); 
        return;
    }

    const distance = parseFloat(document.getElementById('distance').value);

    
    const start_lat = marker.getPosition().lat();
    const start_lng = marker.getPosition().lng();

    try {
       
        const response = await fetch('http://127.0.0.1:5000/generate_course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start_lat: start_lat,
                start_lng: start_lng,
                distance: distance
            })
        });

        const data = await response.json();

       
        const course = data.course;
        const decodedPath = google.maps.geometry.encoding.decodePath(course);

        
        const path = decodedPath.map(
            (point) => new google.maps.LatLng(point.lat, point.lng)
        );

        const polyline = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        polyline.setMap(map);

        const bounds = new google.maps.LatLngBounds();
        path.forEach(point => bounds.extend(point));
        map.fitBounds(bounds);

    } catch (error) {
        console.error('コース生成エラー:', error);
       
        alert(`コース生成エラーが発生しました。外部サイトを使用してください: ${error.message}`);
    }
}

