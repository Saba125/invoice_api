import express from "express"
import usersController from "../controllers/auth/export"
import authMiddleware from "../middlewares/auth"

import upload from "../config/multer"
import roleMiddleware from "../middlewares/permission"
import cityController from "../controllers/city/export"
import stateController from "../controllers/states/export"
import currenciesController from "../controllers/currencies/export"

export enum Roles {
  Admin = "admin",
  Client = "client",
}

const Router = express.Router()
// users
Router.post("/auth/register", usersController.register)
Router.post("/auth/login", usersController.login)
Router.post("/auth/verifyEmail", usersController.verifyEmail)
Router.get("/auth/aboutMe", authMiddleware, usersController.aboutMe)
// city
Router.post(
  "/city/add",
  authMiddleware,
  roleMiddleware(Roles.Admin),
  cityController.add_city
)
Router.put(
  "/city/:id",
  authMiddleware,
  roleMiddleware(Roles.Admin),
  cityController.edit_city
)
Router.get("/city/:id", authMiddleware, cityController.get_single_city)
Router.delete(
  "/city",
  authMiddleware,
  roleMiddleware(Roles.Admin),
  cityController.delete_city
)
Router.post("/city", authMiddleware, cityController.get_cities)
// states
Router.get("/state", authMiddleware, stateController.get_states)
Router.post(
  "/state/add",
  authMiddleware,
  roleMiddleware(Roles.Admin),
  stateController.add_state
)
Router.put(
  "/state/:id",
  authMiddleware,
  roleMiddleware(Roles.Admin),
  stateController.edit_state
)
Router.delete(
  "/state",
  authMiddleware,
  roleMiddleware(Roles.Admin),
  stateController.delete_state
)
Router.get("/state/:id", authMiddleware, stateController.get_single_state)
// currencies
Router.post("/currency", authMiddleware, currenciesController.add_currency)
Router.put(
  "/currency/:id",
  authMiddleware,
  roleMiddleware(Roles.Admin),
  currenciesController.edit_currency
)

export default Router
