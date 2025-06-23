import { Contact } from "../models/contact.js";

export const getAllContacts = async ({ page, perPage,  sortBy, sortOrder, userId}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  
  const queryConditions = { userId: userId };
  
  console.log('getAllContacts (service): Отриманий userId =', userId); 
  console.log('getAllContacts (service): Сформовані queryConditions =', queryConditions);


  const [total, data] = await Promise.all([
    Contact.countDocuments(queryConditions),
    Contact.find(queryConditions) 
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(total / perPage);

  console.log('getAllContacts (service): total =', total);Add commentMore actions
  console.log('getAllContacts (service): data.length =', data.length);
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



export const getAllContactsByID = async (contactId, userId) => {
  const student = await Contact.findOne({ _id: contactId, userId: userId });
  return student;
};

export const deleteContById = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId: userId });
};

export const makeNewCont = async(payload) => {

  return Contact.create(payload);
}

export const changeContById = async (contactId, payload, userId) => {
  return Contact.findOneAndUpdate(
    { _id: contactId, userId: userId },
    payload, 
    { new: true, runValidators: true }
  );
};