const io = require('socket.io')(process.env.PORT || 3000);

const arrUserInfo = [];

io.on('connection', socket => {
    socket.on('userRegister', user => {
        const isExist = arrUserInfo.some(e => e.username === user.username);
        socket.peerId = user.peerId;
        console.log(user)
        if (isExist) return socket.emit('registerErr');
        arrUserInfo.push(user);
        socket.emit('listUserOnline', arrUserInfo);
        socket.broadcast.emit('newUser', user);
    });

    socket.on('disconnect', () => {
        const index = arrUserInfo.findIndex(user => user.peerId === socket.peerId);
        arrUserInfo.splice(index, 1);
        io.emit('userDisconnect', socket.peerId);
    });
});
