var net = require('net');


var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    database : 'pm'
});


connection.connect();

var HOST = '192.168.0.58';
var PORT = 1400;
var moment = require('moment');
moment.locale('zh-cn');

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// 传入net.createServer()的回调函数将作为”connection“事件的处理函数
// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的
net.createServer(function(sock) {

    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('CONNECTED: ' +
        sock.remoteAddress + ':' + sock.remotePort);

    // 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', function(data) {

        // 回发该数据，客户端将收到来自服务端的数据


        if(data.indexOf("connected")==-1)
        {

            if(data.indexOf("\r\n")>-1)
            {
                var list=data.toString().split("\r\n");
                //console.log(list);

                var create_time=moment().format('YYYY-MM-DD HH:mm');
                var time_str=moment().format('mm');
                for(var i=0;i<list.length;i++)
                {
                    var ondata=[];
                    var louceng;
                    var data_t=0;
                    var data_h=0;
                    var data_p=0;
                    var bianhao;
                    var status;
                    if(list[0].indexOf(":")>-1)
                    {
                        louceng=list[0].split(":")[1];
                    }

                    if(list[i].indexOf("N")>-1)
                    {
                        var first=list[i].split("!")[0].trim();
                        bianhao=first.split(".")[0];
                        if(list[i].indexOf("ok")>-1)
                        {
                            status="ok";
                            var second=list[i].split("!")[1];
                            var strList=second.split(":");
                            data_t=strList[1].split("H")[0].trim();
                            data_h=strList[2].split("P")[0].trim();
                            data_p=strList[3].trim();
                        }
                        else
                        {
                            status="error";
                        }

                        ondata.push(data_t,data_h,data_p,create_time,louceng,bianhao,status);

						
                        if(time_str=="30"||time_str=="00")
                        {
						
                            console.log("time_str:"+time_str);

                            charuData(create_time,ondata);
                             console.log(ondata);

                        }

                        tempData(create_time,ondata);
						



                    }

                }

                function charuData(time_param,ondata)
                {

                    var  chaxunSql = 'select * from tb_data where create_time="'+time_param+'"';

                    connection.query(chaxunSql, function (error, results, fields) {

                        console.log(results.length);
                         if(results.length==0)
                         {
                            console.log(ondata);

                            var  addSql = 'INSERT INTO tb_data (data_t,data_h,data_p,create_time,louceng,bianhao,status) VALUES(?,?,?,?,?,?,?)';
                            var  addSqlParams = ondata;

                            connection.query(addSql,addSqlParams,function (err, result) {
                                /* if(err){
                                 console.log('[INSERT ERROR] - ',err.message);
                                 return;
                                 }

                                 console.log('--------------------------INSERT----------------------------');
                                 //console.log('INSERT ID:',result.insertId);
                                 console.log('INSERT ID:',result);
                                 console.log('-----------------------------------------------------------------\n\n');*/
                            });

                         }

                    });


                   


                }


                function tempData(time_param,ondata)
                {

                    console.log(ondata);

                     var  chaxunSql1 = 'select * from tb_temp_data where bianhao="'+ondata[5]+'" and louceng="'+ondata[4]+'"';

                    console.log(chaxunSql1);
                    connection.query(chaxunSql1, function (error, results, fields) {

                        console.log(results.length);
                         if(results.length==0)
                         {
                            

                            var  addSql = 'INSERT INTO tb_temp_data (data_t,data_h,data_p,create_time,louceng,bianhao,status) VALUES(?,?,?,?,?,?,?)';
                            var  addSqlParams = ondata;

                            connection.query(addSql,addSqlParams,function (err, result) {
                                /* if(err){
                                 console.log('[INSERT ERROR] - ',err.message);
                                 return;
                                 }

                                 console.log('--------------------------INSERT----------------------------');
                                 //console.log('INSERT ID:',result.insertId);
                                 console.log('INSERT ID:',result);
                                 console.log('-----------------------------------------------------------------\n\n');*/
                            });

                         }
                         else{

                            var  addSql = 'update tb_temp_data set data_t=?, data_h=?, data_p=?, create_time=?, louceng=?, bianhao=?, status=? where bianhao="'+ondata[5]+'" and louceng="'+ondata[4]+'"';
                            var  addSqlParams = ondata;

                            connection.query(addSql,addSqlParams,function (err, result) {

                                if(err){
                                console.log('[UPDATE ERROR] '+ err.message)
                                }else{
                                    console.log(`------------------------------------UPDATE-------------------`);
                                    console.log(`UPDATE SUCCESS `+ result.affectedRows);        //成功影响了x行  1
                                    console.log(`-------------------------------------------------------------`);
                                }
                            });

                         }

                    });
                }


            }
        }







    });

    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function(data) {
        console.log('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);