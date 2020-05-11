const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

router.get('/', (req, res) => {
	db.select('*');
	db
		.from('posts')
		.then((post) => {
			res.status(200).json({ data: posts });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: error.message });
		});
});

router.get('/:id', (req, res) => {
	db('posts')
		.where({ id: req.params.id })
		.first()
		.then((post) => {
			if (post) {
				res.status(200).json({ data: post });
			} else {
				res.status(404).json({ message: 'No posts by that ID' });
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: error.message });
		});
});

router.post('/', (req, res) => {
	const post = req.body;
	if (isValidPost(post)) {
		db('posts')
			.insert(post, 'id')
			.then((ids) => {
				res.status(201).json({ data: ids });
			})
			.catch((error) => {
				console.log(error);
				res.status(500).json({ message: error.message });
			});
	} else {
		res.status(400).json({ message: 'please provide title and contents for the post' });
	}
});

router.put('/:id', (req, res) => {
	const changes = req.body;

	db('post')
		.where({ id: req.params.id })
		.update(changes)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({ data: count });
			} else {
				res.status(404).json({ message: 'record not found by that Id' });
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(400);
		});
});

router.delete('/:id', (req, res) => {});

function isValidPost(post) {
	return Boolean(post.title && post.contents);
}

module.exports = router;
