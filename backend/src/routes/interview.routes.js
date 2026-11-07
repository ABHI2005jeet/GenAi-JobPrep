import {Router } from "express";
import {authUser} from  "../middlewares/auth.middleware.js";
import * as interviewController from "../controllers/interview.controller.js";
import upload from "../middlewares/file.middleware.js";

const interviewRouter = Router();


interviewRouter.post("/", authUser, upload.single("resume"), interviewController.generateInterViewReportController);

interviewRouter.get("/report/:interviewId", authUser, interviewController.getInterviewReportByIdController);

interviewRouter.get("/", authUser, interviewController.getAllInterviewReportsController);

interviewRouter.post("/resume/pdf/:interviewReportId", authUser, interviewController.generateResumePdfController);

export default interviewRouter;