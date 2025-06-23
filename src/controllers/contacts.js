import * as fs from 'node:fs/promises'
import multer from "multer";
import path from 'node:path'
import createHttpError from 'http-errors';
import { deleteContById, getAllContacts, getAllContactsByID, makeNewCont, changeContById } from "../services/conFunc.js";
import { parsePaginationParams } from '../utils/pagination.js';
import { parseSortParams } from '../utils/parseSortParams.js';

async function getContactController(req, res, next) {
  console.log(req.user);
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const contact = await getAllContacts({ page, perPage, sortBy, sortOrder, userId: req.user.id});
  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: contact,
  });

}

async function getContByIdControl (req, res, next){
  const contactId = req.params.id;
  const userId = req.user.id;

  const contact = await getAllContactsByID(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
    res.status(200).json({
    status: 200,
    message: "Successfully found contact!",
    data: contact
  });
}

async function deleteContByIdControl (req, res, next){
  const contactId = req.params.id;
  const userId = req.user.id;
  
  const result = await deleteContById(contactId, userId);


  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
}

async function makeNewContControl(req, res) {
  console.log(req.file);
  await fs.rename(req.file.path, path.resolve("src", "uploads", "avatars", req.file.filename));
  const newContacts = await makeNewCont({
    ...req.body,
    userId: req.user.id,
    avatar: req.file.filename
  });

  console.log(newContacts)
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContacts,
  });
}


async function changeContByIdControl(req, res, next) {
  const contactId = req.params.id;
  const userId = req.user.id;
  const payload = req.body;

  const result = await changeContById(contactId, payload, userId);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: result,
  });
}

export {
  getContByIdControl,
  getContactController,
  deleteContByIdControl, 
  makeNewContControl,
  changeContByIdControl,
}