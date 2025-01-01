// server.js
const express = require('express');
const fs=require('fs');
const app = express();
const PORT = 8000;
const aliens=require("./aliens.json");
const cors=require('cors');
const bodyParser=require('body-parser');
app.use(cors({
  origin:"*"
}));
app.use(bodyParser.urlencoded({extended:false}))
// define the route
app.get('/',
    (req, res) => {
        res.send(
            `<h1 style="color: green;">
            Hello Gfg!</h1>`
        );
    });
app.get('/api/aliens', (req, res) => {
  const limit = parseInt(req.query.limit)||aliens.length;  // Default to 10 if not provided
  const offset = parseInt(req.query.offset)||0;  // Default to 0 if not provided
if(isNaN(limit) && limit<=0){
  return res.status(400).json({error:"Limit must be a positive number."})
}
if(isNaN(offset) && offset<0){
  return res.status(400).json({error:"Offset must be a non-negative number."})
}

// Send the posts array as a JSON response
return res.json(aliens.slice(offset,offset+limit));
});
app.get('/html/aliens',(req,res)=>{
  const html=`
  <ul>
  ${aliens.map(i=>`<li>${i.name}</li>`).join("")}
  </ul>
  `
  res.send(html);
})
app.get('/api/aliens/:id',(req,res)=>{
  const id=Number(req.params.id);
  const alien=aliens.find(i=> i.id===id)
  return res.json(alien);
})
app.post('/api/aliens',(req,res)=>{
  const data={
    id:req.body.id,
    name:req.body.name,
    image:req.body.image
  }
  aliens.push(data);
  fs.writeFile("./aliens.json",JSON.stringify(aliens));
  return res.json(aliens);
})
app.get('/aliens',async(req,res)=>{
  const text=req.query.name;
  if(text!=undefined){
  const filteredItems = aliens.filter(item => item.name.toLowerCase().includes(text.toLowerCase()));
      // Check if all letters in the item name exist in the provided text
    // Return the filtered items
    res.json(filteredItems);
    }
    else{
      res.json(aliens);
    }
})

app.listen(PORT,
    () => {
        console.log(
            `Server is listening at 
            http://localhost:${PORT}`
        );
    });