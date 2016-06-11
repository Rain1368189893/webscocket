var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req, res){
	res.sendFile(__dirname + '/index.html');
});

//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;

io.on('connection',function(socket){
	console.log('a user connected');
	
	//监听新用户加入
	scoket.on('login',function(obj){
		//将新加入用户的唯一标识当做socket的名称
		socket.name = obj.userId;
		
		//检查在线列表，如果不在里面就加入
		if(!onlineUsers.hasOwnProperty(obj.userId)){
			onlineUsers[obj.userId] = obj.userName;
			//在线人数+1
			onlineCount++;
		}
		
		//向所有客户端广播用户加入
		io.emit('login',{onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
		console.log(obj.userName + '加入了聊天室')
	});
	
	//监听用户退出
	scoket.on('disconnect',function(){
		//将退出的用户从在线列表中删除
		if(!onlineUsers.hasOwnProperty(socket.name)){
			var obj = {userId:socket.name, userName:onlineUsers[scoket.name]};
			//删除
			delete onlineUsers[scoket.name];
			//在线人数-1
			onlineCount--;
			
			//向所有客户端广播用户退出
			io.emit('logout',{onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
			console.log(obj.userName + '退出了聊天室');
		}
	});
	
	//监听用户发布聊天内容
	scoket.on('message',function(obj){
		//向所有客户端广播发布的消息
		io.emit('message',obj);
		console.log(obj.userName+'说：' + obj.content)
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
