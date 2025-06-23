import express from 'express';
import { getContactController, getContByIdControl , deleteContByIdControl, makeNewContControl, changeContByIdControl} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, patchContactSchema } from '../validation/contact.js';
import authRoutes from './auth.js'
import { auth } from '../middlewares/authenticate.js';
const router = express.Router();

const parseExpres = express.json();
router.use('/auth', authRoutes);

router.get('/', (req, res) => {
     res.json({
       message: 'Hello world!',
     });
});
 
router.get('/contacts',auth, ctrlWrapper(getContactController) );
     

router.get('/contacts/:id',auth, isValidId, ctrlWrapper(getContByIdControl));


router.delete('/contacts/:id',auth, isValidId, ctrlWrapper(deleteContByIdControl));



router.post('/contacts',auth,
    parseExpres,
    validateBody(createContactSchema),
    ctrlWrapper(makeNewContControl)
);


router.patch('/contacts/:id', parseExpres,auth,
    validateBody(patchContactSchema),
    isValidId,
    ctrlWrapper(changeContByIdControl)
);


export default router;

