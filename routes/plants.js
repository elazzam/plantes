var Plant = require('../models/plant');
module.exports = function (app) {
	//new
	app.get('/plants/new', function (req, res, next) {
		res.render('plants/new', {title: 'Nouvelle plante'});
	});
	//show
	app.get('/plants/:plant', function (req, res, next) {
		Plant.findById(req.params.plant, function (err, plant) {
			if (err || !plant) next(err);
			else res.render('plants/show', {plant: plant, title: plant.name});
		});
	});
	//index
	app.get('/plants', function (req, res, next) {
		Plant.find().sort('name').exec(function (err, plants) {
			if (err) next(err);
			res.render('plants/index', {plants: plants, title: 'Liste des plantes'});
		});
	});
	//create
	app.post('/plants', function (req, res, next) {
		new Plant({
			name: req.body.name,
			desc: req.body.desc,
			image: req.files.pic.name
		}).save(function (err, pl) {
			if (err) next(err);
			else res.redirect('/plants');
			console.log(pl + ' saved to db');
		});
	});
	//delete
	app.delete('/plants/:plant', function (req, res, next) {
		Plant.findByIdAndRemove(req.params.plant, function (err, pl) { 
			if (err) next(err);
			else {
				console.log('plant removed from db, trying to delete its image file');
				require('fs').unlink('./public/images/' + pl.image, function (uerr) {
					if (uerr) {
						console.error(uerr);
						next(uerr);
					} else {
						console.log('image file deleted');
						res.redirect('/plants');
					}
				});
			}
		});
	});
	//edit
	app.get('/plants/:plant/edit', function (req, res, next) {
		Plant.findById(req.params.plant, '_id name desc', function (err, plant) {
			if (err) next(err);
			else res.render('plants/edit', {plant:plant, title: 'Modifier une plante'});
		});
	});
	//update
	app.put('/plants/:plant', function (req, res, next) {
		var update = req.files.pic.name ? {
				name: req.body.name,
				desc: req.body.desc,
				image: req.files.pic.name
		} : {
				name: req.body.name,
				desc: req.body.desc,
		};
		Plant.findByIdAndUpdate(req.params.plant, update, function (err, plant) {
				if (err) next(err);
				else res.redirect('/plants');
			}
		);
	});
	//sub-resources
	require('./lots.js')(app);
	require('./outs.js')(app);
};
