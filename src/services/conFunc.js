import { Contact } from "../models/contact.js";

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getAllContactsByID = async (contactId) => {
  const student = await Contact.findById(contactId);
  return student;
};

export const deleteContById = async (contactId) => {
  return Contact.findByIdAndDelete(contactId);
}

export const makeNewCont = async(payload) => {

  return Contact.create(payload);
}

export const changeContById = async (contactId, payload) => {
  return Contact.findByIdAndUpdate(contactId, payload, {new : true});
}