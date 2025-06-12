import { Contact } from "../models/contact.js";

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getAllContactsByID = async (contactId) => {
  const student = await Contact.findById(contactId);
  return student;
};