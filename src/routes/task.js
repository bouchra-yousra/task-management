//middleware
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const auth = require("../middleware/auth");

//utils
const taskModule = require("../logic/task");

router.get("/:id", auth, async (req, res) => {
  try {
    const owner = req?.user?.id;
    const { id } = req?.params;

    const { error } = verifyId({ id });
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const Task = await taskModule.find(id, owner);

    if (!Task) {
      throw {
        statusCode: 400,
        body: "Task not found",
      };
    }

    res.status(200).json({
      ...Task["_doc"],
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

    const { error } = verifyTask(req.body);
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }

    const { value, category, deadLine } = req.body;

    const Task = await taskModule.create({
      value,
      category,
      deadLine,
      owner,
    });

    res.status(201).json({
      message: "created successfuly",
      id: Task["_id"],
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

    const { error } = verifyExistingTask({ ...req.body, id });
    if (error) {
      throw {
        statusCode: 400,
        body: error.details[0].message,
      };
    }
    const { value, category, deadLine, isDone } = req.body;

    const Task = await taskModule.find(id, owner);

    if (!Task) {
      throw {
        statusCode: 400,
        body: "Task not found",
      };
    }

    await taskModule.update(id, {
      value,
      category,
      deadLine,
      isDone,
    });

    res.status(200).json({
      message: "updated successfuly",
      id: Task["_id"],
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

    const Task = await taskModule.find(id, owner);

    if (!Task) {
      throw {
        statusCode: 400,
        body: "Task not found",
      };
    }

    await taskModule.delete(id);

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

function verifyTask(data) {
  const schema = Joi.object({
    value: Joi.string().required(),
    category: Joi.string().required(),
    deadLine: Joi.date().required(),
  });

  return schema.validate(data);
}

function verifyExistingTask(data) {
  const schema = Joi.object({
    id: Joi.string().required(),
    value: Joi.string().required(),
    category: Joi.string().required(),
    deadLine: Joi.date().required(),
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
