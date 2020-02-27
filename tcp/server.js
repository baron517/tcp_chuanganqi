var net = require('net');
var request = require('request');
var qs = require('querystring');  

var url="http://shcs.techdom.cn";

var HOST = '192.168.0.100';
var PORT = 1400;
var moment = require('moment');
moment.locale('zh-cn');


                function tempData(time_param,ondata)
                {

                    console.log(ondata);
					
					
					var post_data = {  
						data_t:ondata[0],
						data_h:ondata[1],
						data_p:ondata[2],
						create_time:ondata[3],
						louceng:ondata[4],
						bianhao:ondata[5],
						status:ondata[6]
					}
						
					  
					  
					var content = qs.stringify(post_data);  
					
					
					var  options = {
			　　　　　　method: 'post',
						url: url+"/Api/CommonApi/addTempData",
						form: content,
						headers: {
						  'Content-Type': 'application/x-www-form-urlencoded'
						}
					  };
					  
					  request(options, function (err, res, body) {
						if (err) {
						  console.log(err)
						}else {
						  console.log(body);
						}
					  })

				
                    
                }


				
	var time_param="2018-09-07 22:30";	
    var ondata=[30.2,56.7,8,"2018-09-07 22:30","01","NO1","ok"];

//tempData(time_param,ondata);	



function parseData(data)
{
	
	if (data.indexOf("connected") == -1) {

                if (data.indexOf("\r\n") > -1) {
                    var list = data.toString().split("\r\n");


                    var create_time = moment().format('YYYY-MM-DD HH:mm');
                    var time_str = moment().format('mm');
                    for (var i = 0; i < list.length; i++) {
                        var ondata = [];
                        var louceng;
                        var data_t = 0;
                        var data_h = 0;
                        var data_p = 0;
                        var bianhao;
                        var status;
                        if (list[0].indexOf(":") > -1) {
                            louceng = list[0].split(":")[1];
                        }

                        if (list[i].indexOf("N") > -1) {
                            var first = list[i].split("!")[0].trim();
                            bianhao = first.split(".")[0];
                            if (list[i].indexOf("ok") > -1) {
                                status = "ok";
                                var second = list[i].split("!")[1];
                                var strList = second.split(":");
                                data_t = strList[1].split("H")[0].trim();
                                data_h = strList[2].split("P")[0].trim();
                                data_p = strList[3].trim();
                            }
                            else {
                                status = "error";
                            }

                            ondata.push(data_t, data_h, data_p, create_time, louceng, bianhao, status);

                            tempData(create_time, ondata);


                        }

                    }


                }
            }
}


process.on('uncaughtException', function (err) {
    console.error('网络异常!');
	
	setTimeout(function()
	{
		init();
		
	},5000);
    

});


function init() {

	console.error(moment().format('YYYY-MM-DD HH:mm:ss')+'重新连接!');

    net.createServer(function (sock) {


        console.log('CONNECTED: ' +
            sock.remoteAddress + ':' + sock.remotePort);

        sock.on('data', function (data) {

			console.log(data);
            parseData(data);


        });

        sock.on('close', function (data) {
            console.log('CLOSED: ' +
                sock.remoteAddress + ' ' + sock.remotePort);
        });
		
		sock.on('error', function (data) {
            console.log("报错");
        });
		

    }).listen(PORT, HOST);

}

init();


console.log('Server listening on ' + HOST +':'+ PORT);