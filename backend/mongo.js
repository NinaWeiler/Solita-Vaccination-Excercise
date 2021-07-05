const mongodb = require('mongodb');
const data = require('../../vaccine-exercise-2021/resources/Zerpfy.json')
const data2 = require('../../vaccine-exercise-2021/resources/SolarBuddhica.json')
const data3 = require('../../vaccine-exercise-2021/resources/Antiqua.json')
const vaccinations = require('../../vaccine-exercise-2021/resources/vaccinations.json')
//const data = require('./test.json')
const config = require('./utils/config')

//const dataCommas = data.map(d => d + ',')
//console.log('dataCommas')

//const dataCommas = data.join(',')

//console.log('data', dataCommas)
//const url = 'mongodb://localhost/orders'


async function run() {
	var client;
	try {
		client = await mongodb.MongoClient.connect(config.MONGODB_URI, {useNewUrlParser: true});
		console.log("connected...");
	} catch(err) {
		console.error(err);
		return;
	}
	client.db('Vaccine-data').collection('vaccinations').insertMany(vaccinations)
		.then(console.log("imported successfully..."))
		.catch(err => console.error(err));
}
//dataCommas()
run() 