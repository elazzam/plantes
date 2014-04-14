var Plant = require('../models/plant');
module.exports = function (app) {
	//show
	app.get('/plants/:plant', function (req, res) {
		Plant.findById(req.params.plant, function (err, plant) {
			if (err) return console.error(err);
			else res.render('plants/show', {plant: plant, title: plant.name});
		});
	});
	//index
	app.get('/plants', function (req, res) {
		Plant.find(function (err, plants) {
			if (err) return console.error(err);
			res.render('plants/index', {plants: plants, title: 'Liste des plantes'});
		});
	});
	//new
	app.get('/plants/new', function (req, res) {
		res.render('plants/new', {title: 'Nouvelle plante'});
	});
	//create
	app.post('/plants', function (req, res) {
		new Plant({ name: req.body.name }).save(function (err, pl) {
			if (err) return console.error(err);
			console.log(pl + ' saved to db');
		});
		res.redirect('/plants');
	});
	//delete
	app.delete('/plants/:plant', function (req, res) {
		console.log('trynna remove plant with id=' + req.params.plant);
		Plant.findByIdAndRemove(req.params.plant, function (err) { 
			if (err) console.error('failed to remove ' + req.params.plant);
		});
		res.redirect('/plants');
	});
	//edit
	app.get('/plants/:plant/edit', function (req, res, next) {
		Plant.findById(req.params.plant, '_id name desc', function (err, plant) {
			if (err) console.error(err);
			else res.render('plants/edit', {plant:plant, title: 'Modifier une plante'});
		});
	});
	//update
	app.put('/plants/:plant', function (req, res) {
		Plant.findByIdAndUpdate(req.params.plant, {
				name: req.body.name,
				desc: req.body.desc
			}, function (err, plant) {
				if (err) return console.error(err);
				res.redirect('/plants');
			}
		);
	});
};
