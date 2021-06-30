const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
var bodyParser=require('body-parser');


var path = require('path');
// var name = ''
var hour = ''
function formatDate() {
  var d = new Date()
  var year = d.getFullYear() 
  var month = d.getMonth()  + 1 
  var day = d.getDate() 
  hour = d.getHours() 
  var min = d.getMinutes() 
  var sec = d.getSeconds() 
  var str = year+'-'+month+'-'+day+' '+hour+'-'+min+'-'+sec
  console.log(str)
  return str
}
var str = ''
var date = []
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      str = formatDate()
      date = str.split(' ')
      cb(null, `uploads/${hour}`)
  },
  filename: (req, file, cb) => {
    // const { originalname, mimetype } = file
    // var type = mimetype.split('/')
    // if (type[0] === 'image') {
    //   name = `${date[0]}-${date[1]}-${uuid()}.${type[1]}`
    // } else if (type[0] === 'video') {
    //   name = `${date[0]}-${date[1]}-${uuid()}.${type[1]}`
    // }
    // if (type[1].indexOf('.sheet') !== -1) {
    //   type[1] = 'vnd.openxmlformats-officedocument.spreadsheetml.xlsx'
    // } else if (type[1].indexOf('.document') !== -1) {
    //   type[1] = 'vnd.openxmlformats-officedocument.wordprocessingml.docx'
    // } else if (type[1].indexOf('.presentation') !== -1) {
    //   type[1] = 'vnd.openxmlformats-officedocument.presentationml.pptx'
    // }
    const { fieldname } = file
    let filename = fieldname.split('.')
    var name = `${uuid()}-${filename[0]+'.'+filename[1].toLowerCase()}`
    // var name = `${date[0]}-${date[1]}-${uuid()}.${type[1].toLowerCase()}`
    // var name = `${date[0]}-${date[1]}-${uuid()}-${originalname}.mp4`
    // cb(null, `${uuid()}-${originalname}.mp4`)
    cb(null, name)
  }
})
const upload = multer({ storage: storage})

const app = express()
app.use(upload.any())
app.use(express.static('uploads'))
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header("X-Powered-By",' 3.2.1')
  // res.header("Content-Type", "application/json;charset=utf-8");
  next();
  });


app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.post('/ff', (req, res) => {
  res.json({ status: 'haha'})
  console.log('How are you')
})

app.post('/upload', upload.single('image'), (req, res) => {
  console.log(upload.single('image'))
  return res.json({status: 'OK', result: req.file});
});
app.post('/upload/data', (req, res) => {
  console.log(req.body)
  console.log(req.files[0])
  return res.json({status: 'OK', result: req.files[0]});
});
app.get('/uploads/:date/:url', (req, res) => {
  console.log(req)
  let date = req.params.date
  let url = req.params.url
  res.sendFile( __dirname + `/uploads/${date}/${url}` );
  console.log("Request for " + req.url + " received.");
})
app.post('/file', (req, res) => {
  console.log(req.body)
  return res.json({status: 'OK', result: req.file});
});
app.listen(3002, () => console.log('App is listening...'))