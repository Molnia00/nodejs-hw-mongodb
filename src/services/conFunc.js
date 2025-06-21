import { Contact } from "../models/contact.js";

export const getAllContacts = async ({ page, perPage,  sortBy, sortOrder }) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  

  const [total, contacts] = await Promise.all([
    Contact.countDocuments(),
    Contact.find().sort({[sortBy]: sortOrder}).skip(skip).limit(perPage),
  ])

  const totalPages = Math.ceil(total / perPage)

  console.log({total, contacts})
  return {
       contacts,
        page,
        perPage,
        total,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage :totalPages > page, 
  }
}



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