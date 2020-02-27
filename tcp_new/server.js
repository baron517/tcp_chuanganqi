var net = require('net');
var request = require('request');
var qs = require('querystring');  

var url="http://test.techdom.cn";

var HOST = '192.168.0.100';
var PORT = 1400;
var moment = require('moment');
moment.locale('zh-cn');


                function tempData(data)
                {

                    console.log(data);
					
					
					var post_data = {  
						data_t:data,
					}
						
					  
					  
					var content = qs.stringify(post_data);  
					
					
					var  options = {
			　　　　　　method: 'post',
						url: url+"/Api/CommonApi/addUpsData",
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


				
	
    var ondata='mac(04.02.35.00.00.01):208.4 140.0 208.4 034 59.9 2.05 35.0 00110000';

	tempData(ondata);	



function parseData(data)
{
	data=data.toString();
	tempData(data);
	
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