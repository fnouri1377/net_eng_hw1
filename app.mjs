import express from 'express'
import turf from '@turf/turf'

const app = express()
const port = process.env.PORT || 3000
app.use(express.json());

var all_poly_list = [];
var result_poly_json = {
    "polygons": []
};

app.get('/', (req, res) => {
    res.send("Hello :) This is my first homework!")
})

app.get('/gis/testpoint', (req, res) => {
    var {lat, long} = req.query;
    var pt = turf.point([lat, long]);
    all_poly_list.forEach(poly => {
        if (turf.booleanPointInPolygon(pt, poly)) {
            result_poly_json.polygons.push(poly.properties.name);
        }
    });
    res.send(result_poly_json);
});

app.put('/gis/addpolygon', (req, res) => {
    var {type} = req.body;
    if (type === "Feature") {
        all_poly_list.push(turf.multiPolygon([req.body.geometry.coordinates], req.body.properties));
    }
    else if (type === "FeatureCollection") {
        req.body.features.forEach(poly => {
            all_poly_list.push(turf.multiPolygon([poly.geometry.coordinates], poly.properties));
        });
    }
    res.send(all_poly_list);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));