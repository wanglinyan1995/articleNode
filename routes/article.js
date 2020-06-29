var express = require('express');
var router = express.Router();
var model = require('../model');
var multiparty = require('multiparty')
var fs = require('fs')


/* GET users listing. */
router.post('/add', function(req, res, next) { //文章添加/编辑
    var id  = parseInt(req.body.id)
    if(id){
        var page = req.body.page
        var title = req.body.title
        var content = req.body.content
        model.connect(function(db){
            db.collection('article').updateOne({id:id},{$set:{
                title:title,
                content:content
            }},function(err,ret){
                if(err){
                    console.log('修改失败',err)

                }else{
                    res.redirect('/?page='+page)
                }
            })
        })
    }else{
        var data = {
            title:req.body.title,
            content:req.body.content,
            id:Date.now(),
            username:req.session.username
        }
        model.connect(function(db){
            db.collection('article').insertOne(data,function(err,ret){
                if(err){
                    console.log('发布失败',err)
                    res.redirect('/wirte')
                }else{
                    res.redirect('/')
    
                }
            })
        })
    }
    // res.redirect('/add')

});

router.get('/delete',function(req,res,next){        //删除文章
    var id = parseInt(req.query.id)
    var page = req.query.page
    model.connect(function(db){
        db.collection('article').deleteOne({id:id},function(err,ret){
            if(err){
                console.log('删除失败')

            }else{
                console.log('删除成功')
            }
            res.redirect('/?page='+page)

        })
    })
})
router.post('/upload',function(req,res,next){        //上传文件
    var form = new multiparty.Form()

    form.parse(req, function(err, fields, files) {
        // res.writeHead(200, {'content-type': 'text/plain'});
        // res.write('received upload:\n\n');
        // res.end(util.inspect({fields: fields, files: files}));
        var file = files.filedata[0]

        var rs = fs.createReadStream(file.path)
        var newPath = '/uploads/' + file.originalFilename
        var ws = fs.createWriteStream('./public'+newPath)
        rs.pipe(ws)
        ws.on('close',function(){
            console.log('./public'+newPath,'文件上传')
            res.send({err:'',msg:newPath})
        })
      });
})

module.exports = router;
