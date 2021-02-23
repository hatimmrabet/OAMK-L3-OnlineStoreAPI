const fs = require('fs');
const express = require('express');
const has = require('has-value');
const router = express.Router();
const itemsSchema = require('./schemas/itemsSchema.json'); 
const Ajv = require('ajv').default;
const items = require('../services/items');
const passport = require('passport');


//  Return all items information
router.get('/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        let userItems = items.getAllItemsByUserID(req.user.id);
        res.status(200);
        res.json(userItems);
});

router.get('/:itemID',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        let item = items.getItemByID(req.params.itemID);
        if(item === undefined)   //item not found
        {
            res.status(404);
            res.send("itemID not found");
        }
        else
        {
            res.status(200);
            res.json(item);
        }
});

function validateJSONHeaders(req, res, next)
{
    if(req.get('Content-Type') === 'application/json')
    {
        next();
    }
    else
    {
        const err = new Error('Bad Request - Missing Headers');
        err.status = 400;
        next(err);
    }
}
/* Middleware to validate new user creation */
function validateItemSchema(req, res, next)
{
    const ajv = new Ajv();
    const validate = ajv.compile(itemsSchema);
    const isValid = validate(req.body);
    // console.log(req.body);
    // console.log('isValid', isValid);
    // console.log(validate.errors);
    if(isValid == false) {
      res.status(400);
      res.send(validate.errors.map(e => e.message));
    }
    next();
}

router.post('/',
    passport.authenticate('jwt', { session: false }),
    [ validateJSONHeaders, validateItemSchema ],
    (req, res) => {
        newItem = items.addItem(req.body, req.user);
        res.status(201);
        res.json({
            id: newItem.id,
            created: newItem.created
        });
});

router.put('/:itemID',
    passport.authenticate('jwt', { session: false }),
    [ validateJSONHeaders, validateItemSchema],
    (req, res) => {
        let item = items.getItemByID(req.params.itemID);
        if(item === undefined)   //item not found
        {
            res.status(404);
            res.send("itemID not found");
        }
        else if(item.sellerID != req.user.id)    //try to modify an item that not his item
        {
            res.status(403);
            res.send("You can't modify this Item, You are not the seller of this Item");
        }
        else
        {
            modifiedItem = items.modifyItem(req.body,item);
            res.status(200);
            res.json({
                id: modifiedItem.id,
                created: modifiedItem.created,
                modified: modifiedItem.modified
            });
        }
});

router.post('/:ItemID/images',
    passport.authenticate('jwt', { session: false }),
    function (req, res) {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {    // A Multer error occurred when uploading.
                res.status(400);
                if(err.code == "LIMIT_UNEXPECTED_FILE")
                {
                    res.json({error : "You can't add more than 4 images",err})
                }
                else
                {
                    res.json(err);
                }
                return
            }
            else if (err)     // An unknown error occurred when uploading.
            {   
                res.json(err);
                return
            }            
            item = items.getItemByID(req.params.ItemID);
            if(item === undefined)   //item not found
            {
                req.files.forEach(i => {
                    fs.unlinkSync(i.path);
                });
                res.status(404);
                res.send("itemID not found");
            }
            else if(item.sellerID != req.user.id)    //try to add pictures to an item that not his item
            {
                req.files.forEach(i => {
                    fs.unlinkSync(i.path);
                });
                res.status(403);
                res.send("You can't add images to this Item, You are not the seller of this Item");
            }
            else if(item.images.length + req.files.length > 4 )
            {
                req.files.forEach(i => {
                    fs.unlinkSync(i.path);
                });
                res.status(400).send("You can't add more than 4 images");
            }
            else
            {
                let newFilePath;
                req.files.forEach(f => {
                    newFilePath = './uploads/' + f.filename + f.originalname;
                    item.images.push({
                        path: newFilePath,
                        created: new Date().toISOString()
                    });
                    fs.renameSync(f.path, newFilePath);
                })
                res.status(201);
                res.json({
                    id: item.id,
                    images: item.images,
                    created: item.created
                });
            }
        })
});

router.put('/:ItemID/images',
    passport.authenticate('jwt', { session: false }),
    function (req, res) {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {    // A Multer error occurred when uploading.
                res.status(400);
                if(err.code == "LIMIT_UNEXPECTED_FILE")
                {
                    res.json({error : "You can't add more than 4 images",err})
                }
                else
                {
                    res.json(err);
                }
                return
            }
            else if (err)   // An unknown error occurred when uploading.
            {   
                res.json(err);
                return
            }
            let item = items.getItemByID(req.params.ItemID);
            if(item === undefined)   //item not found
            {
                req.files.forEach(i => {
                    fs.unlinkSync(i.path);
                });
                res.status(404);
                res.send("itemID not found");
            }
            else if(item.sellerID != req.user.id)    //try to modify an item that not his item
            {
                req.files.forEach(i => {
                    fs.unlinkSync(i.path);
                });
                res.status(403);
                res.send("You can't modify this Item, You are not the seller of this Item");
            }
            else if(item.images.length == 0)
            {
                req.files.forEach(i => {
                    fs.unlinkSync(i.path);
                });
                res.status(400);
                res.send("Not modified, you don't have images to modify, You should add images first")
            }
            else
            {
                //delete old pictures
                item.images.forEach(i => {
                    fs.unlinkSync(i.path);
                });
                item.images = [];
                req.files.forEach(f => {
                    newFilePath = './uploads/' + f.filename + f.originalname;
                    item.images.push({
                        path: newFilePath,
                        created: new Date().toISOString()
                    });
                    fs.renameSync(f.path, newFilePath);
                })
                item.modified = new Date().toISOString();
                res.status(200);
                res.json({
                    id: item.id,
                    images: item.images,
                    modified: item.modified 
                });
            }
        })
});

router.delete('/:itemID',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        let item = items.getItemByID(req.params.itemID);
        if(item === undefined)   //item not found
        {
            res.status(404);
            res.send("itemID not found");
        }
        else if(item.sellerID != req.user.id)    //try to modify an item that not your's
        {
            res.status(403);
            res.send("You can't delete this Item, You are not the seller of this Item");
        }
        else
        {
            item.images.forEach(i => {
                fs.unlinkSync(i.path);
            });
            items.deleteItem(req.params.itemID);
            res.status(200);
            res.send("Deleted");
        }
});

/* Public routes */
router.get('/search-by/category/:categorieName',
    (req, res) => {
        let result = items.getAllByCat(req.params.categorieName);
        res.status(200);
        res.json(result);
});

router.get('/search-by/location/:contryCode/:city',
    (req, res) => {
        if(req.params.contryCode.length != 2)
        {
            res.status(400);
            res.send("Incorrect parametre ("+req.params.contryCode+")");
        }
        else
        {
            let result = items.getAllByLocation(req.params.contryCode, req.params.city);
            res.status(200);
            res.json(result);
        }
});

router.get('/search-by/date/:startDate/:endDate',
    (req, res) => {
        let result = items.getAllByDate(req.params.startDate, req.params.endDate);
        res.status(200);
        res.json(result);
});

module.exports = router;

/*  Template for validation
{
    "title": "Phone S10+",
    "description": "new phone without problems",
    "category": "phones",
    "city": "Tetouan",
    "contryCode": "MA",
    "price": 650.15,
    "delivery": "Shipping"
}
*/