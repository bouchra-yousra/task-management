//middleware
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const auth = require("../middleware/auth");

//utils
const spaceModule = require("../logic/space");
const categoryModule = require("../logic/category");

router.get("/", auth, async (req, res) => {
  try {
    const owner = req.user?.id;

    let space = await spaceModule.get(owner);

    if (space?.length == 0) {
      throw {
        statusCode: 204,
        body: "No space",
      };
    }
    // Send 200 - spaces
    res.status(200).json({
      space,
    });
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({
        message: err.body,
      });
    }
  }
});

router.post("/", auth, async (req, res) => {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      throw {
        statusCode: 400,
        body: "Empty request!",
      };
    }

    const owner = req?.user?.id;

    const { error } = verifySpace(req.body);
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { title, color } = req.body;

    const Space = await spaceModule.create({
      title,
      color,
      owner,
    });

    res.status(201).json({
      message: "created successfuly",
      id: Space["_id"],
    });
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({
        message: err.body,
      });
    }
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      throw {
        statusCode: 400,
        body: "Empty request!",
      };
    }

    const owner = req?.user?.id;
    const { id } = req?.params;

    const { error } = verifyExistingSpace({ ...req.body, id });
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { title, color } = req.body;

    const Space = await spaceModule.find(id, owner);

    if (!Space) {
      throw {
        statusCode: 400,
        body: "Space not found",
      };
    }

    await spaceModule.update(id, {
      title,
      color,
    });

    res.status(200).json({
      message: "updated successfuly",
      id: Space["_id"],
    });
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({
        message: err.body,
      });
    }
  }
});

router.delete(":id/", auth, async (req, res) => {
  try {
    const { id } = req?.params;
    const owner = req?.user?.id;
    const { error } = verifyId({
      id,
    });
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const Space = await spaceModule.find(id, owner);

    if (!Space) {
      throw {
        statusCode: 400,
        body: "Space not found",
      };
    }

    await spaceModule.delete(id);

    res.status(200).json({
      message: "deleted successfuly",
      id,
    });
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({
        message: err.body,
      });
    }
  }
});

router.get("/:id/categories", auth, async (req, res) => {
  try {
    const owner = req.user?.id;
    const { id: space } = req?.params;

    let category = await categoryModule.get(space, owner);

    if (category?.length == 0) {
      throw {
        statusCode: 204,
        body: "No category",
      };
    }
    // Send 200 - categorys
    res.status(200).json({
      category,
    });
  } catch (err) {
    console.error(err);
    if (err.statusCode) {
      res.status(err.statusCode).json({
        message: err.body,
      });
    }
  }
});

function verifySpace(data) {
  const schema = Joi.object({
    title: Joi.string().required(),
    color: Joi.string().required(),
  });

  return schema.validate(data);
}
function verifyExistingSpace(data) {
  const schema = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    color: Joi.string().required(),
  });

  return schema.validate(data);
}

function verifyId(data) {
  const schema = Joi.object({
    id: Joi.string().required(),
  });

  return schema.validate(data);
}

module.exports = router;
