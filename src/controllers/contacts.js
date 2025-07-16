import * as fs from 'node:fs/promises'
import multer from 'multer'
import path from 'node:path'
import createHttpError from 'http-errors';
import { deleteContById, getAllContacts, getAllContactsByID, makeNewCont, changeContById } from "../services/conFunc.js";
import { parsePaginationParams } from '../utils/pagination.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { uploadCloud } from '../utils/uploadToClaudinary.js';
import {getEnvVar} from '../utils/getEnvVar.js'

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


async function makeNewContControl(req, res, next) {
  try {
    console.log('req.file:', req.file.path); 

    let photoUrl = null; 

    if (req.file) {
      console.log("Файл знайдено, завантажуємо в Cloudinary...");
      photoUrl = await uploadCloud(req.file.path);
    } else {
      console.log("Файл не передано ");
    }

    const newContact = {
      ...req.body, 
      photo: photoUrl,
      userId: req.user._id, 
    };

    const makeNewContacts = await makeNewCont(newContact);

    res.status(201).json({ status: 201, message: 'Successfully created a contact!', data: newContact });

  } catch (error) {
    console.error('Помилка у makeNewContControl:', error);
    next(error);
  }
}




async function changeContByIdControl(req, res, next) {
  const contactId = req.params.id;
  const userId = req.user.id;
  const payload = req.body;

  if (req.file) {
    if (!req.file.path) {
      return next(createHttpError(400, 'Не вдалося обробити файл: відсутній шлях.'));
    }

    try {
      const photoUrl = await uploadCloud(req.file.path);
      payload.photo = photoUrl;
    } catch (error) {
      return next(createHttpError(500, 'Помилка завантаження фото: ' + error.message));
    }
  } else {
      if (payload.photo === null) {
      } else if (!payload.photo) {
      }
  }

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