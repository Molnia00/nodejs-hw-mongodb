import { Contact } from "../models/contact.js";

export const getAllContacts = async ({ page, perPage,  sortBy, sortOrder, userId}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  
  const studentQuery = Contact.find();
  
  studentQuery.where('userId').equals(userId)


  const [total, data] = await Promise.all([
    Contact.countDocuments(),
    studentQuery.sort({[sortBy]: sortOrder}).skip(skip).limit(perPage),
  ])

  

  const totalPages = Math.ceil(total / perPage)

  console.log({total, data})
  return {
       data,
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