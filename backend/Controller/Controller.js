const cartmodel=require('../Models/CartModel')
const addressmodel=require('../Models/Addressmodel')
const usermodel=require('../Models/Usermodel')
const ordermodel=require('../Models/OrderModel')
const Chat = require('../Models/ChatModel');
const productmodel=require('../Models/ProductModel')

// Get all messages for a specific user
const getUniqueChats = async (req, res) => {
  try {
    const chats = await Chat.aggregate([
      {
        $group: {
          _id: '$userId', // Group by userId
          name: { $first: '$username' }, // Pick the first name in the group
          phoneno: { $first: '$phoneno' },
        },
      },
    ]);
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats' });
  }
};

// Get all messages for a specific user
const getMessages = async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await Chat.find({ userId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

// Send a new message
const sendMessage = async (req, res) => {
  const { userId, message, sender, username } = req.body;

  try {
    const newMessage = new Chat({
      userId,
      message,
      sender,
      username,
    });
    await newMessage.save();
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
};



const register=async(req,res)=>{
  const {email}=req.body
  const findexists=await usermodel.find({email})
  if(findexists==''){
    const data=await usermodel.create(req.body)
    res.json({userdetail:data})

  }
  else{
    res.json({message:'failed'})

  }
 
 
}

const login=async(req,res)=>{
  const {email,password}=req.body
  const data=await usermodel.findOne({email,password})
  if(data=='' || !data){
    res.json({message:'failed'})
  
  }
  else{
    res.json({userdetail:data})
    
  }

  

  
}


















const createcart=async(req,res)=>{
         
      const {name}=req.body
      const {uid}=req.body
      const findid=await cartmodel.find({uid,name})
      if(findid==''){
        const data=await cartmodel.create(req.body)
        res.json(data)
       
      }
      else{
        res.json({message:'f'})
       
      }
  
       

}


const getcart=async(req,res)=>{

  const id=req.params.id
  const sid=String(id)

    const data=await cartmodel.find({
       uid:sid
    })
    if(!data || data==''){
      res.json({message:'f'})
    }
    else{
      res.json(data)
   
    }
   
}

const deletecart=async(req,res)=>{
   const id=req.params.id
   const pid=req.params.pid
   const findproduct=await cartmodel.find({
     uid:id
   })
   if(findproduct){
    const data=await cartmodel.findByIdAndDelete({_id:pid})
    res.json({message:'s'})
    console.log('df')
   }


}

const address=async(req,res)=>{

  const data=await addressmodel.create(req.body)
  res.json({addressdata:data,message:'s'})

}

const getaddress = async (req, res) => {
  const { id } = req.params;
  try {
    const addresses = await addressmodel.find({ uid: id });
    if (!addresses || addresses.length === 0) {
      res.json({ message: 'f' });
    } else {
      res.json({ message: 's', addresses });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching addresses' });
  }
};

const updateaddress=async(req,res)=>{
  const id=req.params.id
  const name=req.params.name
  const phone=req.params.phoneno
  const area=req.params.area
  const pincode=req.params.pincode
  const landmark=req.params.landmark
  const datar=await addressmodel.findOneAndUpdate({uid:id},{
    name:name,phoneno:phone,area:area,landmark:landmark,pincode:pincode
  })
  res.json(datar)
  console.log(datar)
}
const cartafterorder=async(req,res)=>{
  const id=req.params.id
  const dcart=await cartmodel.deleteMany({uid:id})
  res.json({message:'s'})

 


}
const createorder = async (req, res) => {
  const { ord, paymentType, selectedAddressId } = req.body; // Capture selectedAddressId

  const userId = ord[0].uid;
  try {
    const userAddress = await addressmodel.findOne({ _id: selectedAddressId, uid: userId });

    if (!userAddress) {
      return res.status(400).json({ message: 'Selected address not found' });
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);

    for (let product of ord) {
      const newOrder = {
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
        uid: product.uid,
        address: userAddress,  // Use selected address
        date: deliveryDate,
        paymentType // Include paymentType in each order
      };

      await ordermodel.create(newOrder);
    }

    res.json({ m: 's' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getallorders = async (req, res) => {
  try {
    const orders = await ordermodel.find().sort({updatedAt:-1});
    if (orders == '' || !orders) {
      res.json({ message: 'f' });
    } else {
      res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};
const getorder=async(req,res)=>{
  const id=req.params.id
  const data=await ordermodel.find({uid:id})
  if(data=='' || !data){
    res.json({message:'f'})
  }
  else{ 
    res.json({data:data,message:'s'})

  }
 


}
const deleteorder=async(req,res)=>{
  const id=req.params.id
  const pid=req.params.pid
  const findord=await ordermodel.find({uid:id})
  if(findord){
    const delord=await ordermodel.findByIdAndDelete({_id:pid})
    res.json({messsage:'s'})
    console.log(delord)
  }
  else{
    res.json({message:'f'})
  }

}
const mp=async(req,res)=>{
  const {name}=req.body
  const data=await productmodel.findOne({name:name})
  res.json({data:data})

}


module.exports={mp,getUniqueChats,getMessages,sendMessage,register,login,createcart,getcart,deletecart,address,getaddress,updateaddress,cartafterorder,createorder,getorder,deleteorder,getallorders}
