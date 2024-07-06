const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// find all tags
// be sure to include its associated Product data
router.get('/', async(req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: "products" }],
    });

    if (!tagData) {
      return res.status(404).send("No tags found.");
    }

    return res.status(200).json(tagData);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error: Unable to fetch tags.");
  }
});

// find a single tag by its `id`
// be sure to include its associated Product data
router.get('/:id', async(req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: "products" }],
    });

    if (!tagData) {
      return res.status(404).send("Tag not found.");
    }

    return res.status(200).json(tagData);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error: Unable to fetch tag.");
  }
});

// create a new tag
router.post('/', async(req, res) => {
  try {
    if (!req.body.tag_name) {
      return res.status(400).send("Tag name is required.");
    }

    const tagData = await Tag.create({
      tag_name: req.body.tag_name,
    });
    return res.status(201).json(tagData);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error: Unable to creat tag.")
  }
});

// update a tag's name by its `id` value
router.put('/:id', async(req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).send("Tag not found.");
    }

    await tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    return res.status(200).json(tag);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error: Unable to update tag.");
  }
});

// delete on tag by its `id` value
router.delete('/:id', async(req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).send("Tag not found.");
    }

    await tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({ message: "Tag deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error: Unable to delete tag.");
  }
});

module.exports = router;