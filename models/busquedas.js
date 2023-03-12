import fs from 'fs';

//const axios = require('axios');
import axios from 'axios';

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        this.leerDB();
    }

    //Parametros para mi busqueda por http
    get paramsMapbox(){

        return {
            'access_token': process.env.MAPBOX_KEY,
            'language': 'es',
            'limit': 5
        }

    }

    get paramsOpenWeather(){

        return {
            'appid': process.env.OPENWEATHER_KEY,
            'lang': 'es',
            'units': 'metric'
        }

    }

    get historialCapitalizado(){
        //Capitalizar cada palabra
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');

            palabras = palabras.map( palabra =>  palabra[0].toUpperCase() + palabra.substring(1) );                        

            return palabras.join(' ');
        })
        
    }

    async ciudad(lugar = '') {

        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
              });

            const resp = await instance.get();
            
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))

        } catch (error) {
            
            return [];
        }
        
    }

    async climaLugar(lat, lng){

        try {
            
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}`,
                params: this.paramsOpenWeather
              });

            
            const resp = await instance.get();
            const { weather, main} = resp.data
              
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            console.log(error);
        }

    }

    agregarHistorial( lugar = '' ){

        //verificar que no haya lugares duplicados en el historial
        if(this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return;
        }

        this.historial.unshift( lugar.toLocaleLowerCase() );

        //Grabar en DB
        this.guardarDB();

    }

    guardarDB(){

        //Creamos una constante por si tenemos mas propiedades 
        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));

    }

    leerDB(){

        if (!fs.existsSync(this.dbPath))
            return 'No existe el file';

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse(info);

        this.historial = data.historial;
    }
}


export { Busquedas };