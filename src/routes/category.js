//middleware
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const auth = require("../middleware/auth");

//utils
const categoryModule = require("../logic/category");
const taskModule = require("../logic/task");

router.get("/", auth, async (req, res) => {
  try {
    const owner = req.user?.id;
    const { space } = req?.body;

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

router.post("/", auth, async (req, res) => {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      throw {
        statusCode: 400,
        body: "Empty request!",
      };
    }

    const owner = req?.user?.id;

    const { error } = verifyCategory(req.body);
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { title, space } = req.body;

    const category = await categoryModule.create({
      title,
      space,
      owner,
    });

    res.status(201).json({
      message: "created successfuly",
      id: category["_id"],
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

    const { error } = verifyExistingCategory({ ...req.body, id });
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { title, space } = req.body;

    const category = await categoryModule.find(id, owner);

    if (!category) {
      throw {
        statusCode: 400,
        body: "category not found",
      };
    }

    await categoryModule.update(id, {
      title,
      space,
    });

    res.status(200).json({
      message: "updated successfuly",
      id: category["_id"],
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

router.delete("/:id", auth, async (req, res) => {
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

    const category = await categoryModule.find(id, owner);

    if (!category) {
      throw {
        statusCode: 400,
        body: "category not found",
      };
    }

    await categoryModule.delete(id);

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

router.get("/:id/tasks", auth, async (req, res) => {
  try {
    const owner = req.user?.id;

    const { id: category } = req?.params;

    if ([undefined, null].includes(category)) {
      throw {
        statusCode: 400,
        body: "Category is missing",
      };
    }

    let tasks = await taskModule.get(category, owner);

    if (tasks?.length == 0) {
      throw {
        statusCode: 204,
        body: "No tasks",
      };
    }
    // Send 200 - tasks
    res.status(200).json({
      tasks,
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

function verifyCategory(data) {
  const schema = Joi.object({
    title: Joi.string().required(),
    space: Joi.string().required(),
  });

  return schema.validate(data);
}
function verifyExistingCategory(data) {
  const schema = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    space: Joi.string().required(),
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
