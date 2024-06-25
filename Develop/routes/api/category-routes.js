const router = require('express').Router();
const { Category, Product, Tag } = require('../../models');

// The `/api/categories` endpoint
router.get('/', async(req, res) => {

  // find all categories

  // be sure to include its associated Products
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product, as: 'products' }]
    });
    return res.status(200).json(categoryData);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Service Error api/category get route");
  }
  
  // be sure to include its associated Products
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;