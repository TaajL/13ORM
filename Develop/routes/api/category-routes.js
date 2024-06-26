const router = require('express').Router();
const { where } = require('sequelize');
const { Category, Product, Tag } = require('../../models');
const { json } = require('body-parser');
const { error } = require('console');
// The `/api/categories` endpoint


// find all categories
router.get('/', async(req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product, as: 'products' }]
    });
    return res.status(200).json(categoryData);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Service Error: api/category get route");
  }
  // be sure to include its associated Products
});

// find one category by its `id` value
router.get('/:id', async(req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }]
    });
    return res.status(200).json(categoryData);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Service Error: Unable to retrieve category.");
  }

  // be sure to include its associated Products
});

// create a new category
router.post('/', async(req, res) => {
  try {
    const [affectedRows, affectedCategories] = await Category.update({
      category_name: req.body.category_name,
       },
       {
      where: {
        id: req.params.id, 
      },
    },
  );
  if (affectedRows === 0) {
    return res.status(404).send("Category not found.");
    } 
    return res.status(200),json(affectedCategories[0]);
  } catch (error) {
    return res.status(500).send("Internal Service Error: Unable to update category");
  }
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    if (!req.body.category_name) {
      return res.status(400).send("Category name is required.");
    }

    const [affectedRows, affectedCategories] = await Category.update(
      {
        category_name: req.body.category_name,
      },
      {
        where: {
          id: req.params.id,
        },
        returning: true, // Return the updated category
      }
    );

    if (affectedRows === 0) {
      return res.status(404).send("Category not found.");
    }

    return res.status(200).json(affectedCategories[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error: Unable to update category.");
  }
});

// delete a category by its `id` value
router.delete('/:id', async(req, res) => {
  try {
    const categoryData = await Category.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!categoryData) {
      return res.status(404).send("Category not found.");
    }

    await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json(categoryData);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error: Unable to delete category.");
  }

});

module.exports = router;