const express=require('express')
const controller=require('../Controller/Controller')
const router=express.Router()

router.post('/register',controller.register)
router.post('/login',controller.login)
router.post('/cart',controller.createcart)
router.get('/getcart/:id',controller.getcart)
router.delete('/deletecart/:id/:pid',controller.deletecart)
router.post('/address',controller.address)
router.get('/getaddress/:id',controller.getaddress)
router.put('/updateaddress/:id/:name/:phoneno/:area/:pincode/:landmark',controller.updateaddress)
router.delete('/dcart/:id',controller.cartafterorder)
router.post('/order',controller.createorder)
router.get('/getorder/:id',controller.getorder)
router.get('/getallorders',controller.getallorders)
router.post('/mp/',controller.mp)
router.get('/getUniqueChats', controller.getUniqueChats);
router.get('/getMessages/:userId', controller.getMessages);
router.post('/sendMessage', controller.sendMessage);
router.delete('/deleteorder/:id/:pid',controller.deleteorder)


module.exports=router