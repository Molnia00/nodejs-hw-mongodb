import createHttpError from 'http-errors';
import { notFoundHandler } from "../middlewares/notFoundHandler.js";
import { deleteContById, getAllContacts, getAllContactsByID, makeNewCont, changeContById } from "../services/conFunc.js";

async function getContactController (req, res, next){
    
        const contact = await getAllContacts();
        res.status(200).json({
            status: 200,
            message: "Successfully found contacts!",
            data: contact,
        });
    
}

async function getContByIdControl (req, res, next){
     
       const contactId = req.params.id;
       const contact = await getAllContactsByID(contactId);
 
       if (!contact) {
         throw new createHttpError.NotFound('student not find')
       }
 
         res.status(200).json({
           status: 200,
         message: "Successfully found contact!",
         data: contact
       });
 
     
}

async function deleteContByIdControl (req, res){
     
    const contactId = req.params.id;
       const result = await deleteContById(contactId);
 
    if (result === null) {
         throw new createHttpError.NotFound('student not found')
       }
         res.status(204).json({
           status: 204,
         });

 
     
}


async function makeNewContControl(req, res) { 
    
    const newContacts = await makeNewCont(req.body);
    console.log(newContacts)
    res.status(201).json({
		status: 201,
		message: "Successfully created a contact!",
		data: newContacts,
})
}


async function changeContByIdControl(req, res) {
    const contactId = req.params.id;
    const result = await changeContById(contactId);
    res.status(200).json({
           status: 200,
        message: "Successfully patched a contact!",
         data: result,
    });
    if (result === null) {
        throw new createHttpError.NotFound('student not find')
    }
}

export {
    getContByIdControl,
    getContactController,
    deleteContByIdControl, 
    makeNewContControl,
    changeContByIdControl,
}