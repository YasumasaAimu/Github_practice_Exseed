from flask import Flask, render_template, request, jsonify # type: ignore
import googlemaps # type: ignore

import math

app = Flask(__name__)



GOOGLE_MAPS_API_KEY = "YOURKEY"  
gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)

@app.route('/')
def index():
    return render_template('index.html', api_key=GOOGLE_MAPS_API_KEY)

@app.route('/generate_course', methods=['POST'])
def generate_course():
    try:
        data = request.get_json()
        start_lat = data['start_lat']
        start_lng = data['start_lng']
        distance = data['distance']

        
        waypoints = []
        num_points = 4  
        radius = distance / (2 * math.pi)  

        for i in range(num_points):
            angle = 2 * math.pi * i / num_points  
            lat = start_lat + radius * math.cos(angle) / 111111 
            lng = start_lng + radius * math.sin(angle) / (111111 * math.cos(start_lat))  
            waypoints.append({'lat': lat, 'lng': lng})

        # Google Maps Directions APIを使ってコースを生成
        directions_result = gmaps.directions(
            origin=(start_lat, start_lng),
            destination=(start_lat, start_lng),  
            waypoints=waypoints,  
            mode="walking",  
            avoid=["highways", "tolls", "ferries"]  
        )

       
        course = directions_result[0]['overview_polyline']['points']

       
        return jsonify({'course': course})

    except Exception as e:
        print(f"エラーが発生しました: {e}")
        return jsonify({'error': str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)