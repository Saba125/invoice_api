import express from "express"
import usersController from "../controllers/auth/export"
import authMiddleware from "../middlewares/auth"

import roleMiddleware from "../middlewares/permission"
import cityController from "../controllers/city/export"
import stateController from "../controllers/states/export"
import currenciesController from "../controllers/currencies/export"
import clientsController from "../controllers/clients/export"
import invoicesController from "../controllers/invoices/export"
import invSettingsController from "../controllers/invoice_settings/export"

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
// clients
Router.post(
  "/clients/add",
  authMiddleware,
  roleMiddleware(Roles.Admin),
  clientsController.add_client
)
Router.put(
  "/clients/:id",
  authMiddleware,
  roleMiddleware(Roles.Admin),
  clientsController.edit_client
)
Router.delete(
  "/clients/:id",
  authMiddleware,
  roleMiddleware(Roles.Admin),
  clientsController.delete_client
)
Router.post("/clients", authMiddleware, clientsController.get_clients)
Router.get("/clients/:id", authMiddleware, clientsController.get_single_client)

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
Router.delete(
  "/currency/:id",
  authMiddleware,
  roleMiddleware(Roles.Admin),
  currenciesController.delete_currency
)
Router.get("/currency", authMiddleware, currenciesController.get_currencies)
Router.get(
  "/currency/:id",
  authMiddleware,
  currenciesController.get_single_currency
)
// invoices
Router.post("/invoices/add", authMiddleware, invoicesController.add_invoice)
Router.put(
  "/invoices/edit/:id",
  authMiddleware,
  invoicesController.edit_invoice
)
Router.get("/invoices", authMiddleware, invoicesController.get_invoices)
Router.post("/invoices/pay", authMiddleware, invoicesController.pay_invoice)
Router.post(
  "/invoices/preview",
  authMiddleware,
  invoicesController.preview_invoice
)

// invoice settings
Router.post(
  "/invoiceSettings",
  authMiddleware,
  invSettingsController.add_invoice_settings
)
Router.put(
  "/invoiceSettings/:id",
  authMiddleware,
  invSettingsController.edit_invoice_settings
)
Router.get(
  "/invoiceSettings",
  authMiddleware,
  invSettingsController.get_invoice_settings
)
export default Router
