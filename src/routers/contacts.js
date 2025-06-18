import express from 'express';
import { getAllContacts, getAllContactsByID } from '../services/conFunc.js';
import { getContactController, getContByIdControl , deleteContByIdControl, makeNewContControl, changeContByIdControl} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
   
const router = express.Router();

const parseExpres = express.json();

router.get('/', (req, res) => {
     res.json({
       message: 'Hello world!',
     });
   });
 
   router.get('/contacts',ctrlWrapper(getContactController) );
     
   router.get('/contacts/:id',ctrlWrapper(getContByIdControl));

router.delete('/contacts/:id', ctrlWrapper(deleteContByIdControl));

router.post('/contacts',parseExpres, ctrlWrapper(makeNewContControl));

router.patch('/contacts/:id',parseExpres,  ctrlWrapper(changeContByIdControl));

export default router;

