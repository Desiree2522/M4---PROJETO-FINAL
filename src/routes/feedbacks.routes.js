import express from "express";
import {
  getAllFeedbacks,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedbacks.controller.js";

const routerFeedback = express.Router();

routerFeedback.get("/", getAllFeedbacks);
routerFeedback.post("/", createFeedback);
routerFeedback.put("/:id", updateFeedback);
routerFeedback.delete("/:id", deleteFeedback);

export default routerFeedback;

