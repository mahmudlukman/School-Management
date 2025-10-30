import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  getAllCertificates,
  getCertificate,
  getCertificateByNumber,
  getStudentCertificates,
  issueCertificate,
  revokeCertificate,
} from "../controllers/certificate.controller";

const certificateRouter = express.Router();

certificateRouter.post(
  "/issue-certificate",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  issueCertificate
);

certificateRouter.get("/certificates", isAuthenticated, getAllCertificates);

certificateRouter.get("/certificate/:id", isAuthenticated, getCertificate);

certificateRouter.get(
  "/certificates-by-number/:certificateNumber",
  isAuthenticated,
  getCertificateByNumber
);

certificateRouter.put(
  "/revoke-certificate/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  revokeCertificate
);

certificateRouter.get(
  "/student-certificates/:studentId",
  isAuthenticated,
  getStudentCertificates
);

export default certificateRouter;
