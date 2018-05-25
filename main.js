// const socket=io("https://webrtcdemo2505.herokuapp.com")
const socket=io("http://localhost:3000")
var peer = new Peer({ key: 'peerjs', host: "skipye.herokuapp.com", secure: true, port: 443 });
peer.on('open',id=>
{
    // $('#mypeer').append(id)
    $('#btnSignUp').click(()=>{
        const username=$("#txtUsername").val();
        socket.emit('userRegister',{username : username,peerId:id})
    })
})

socket.on("listUserOnline",arrUserInfo=>{
    console.log(arrUserInfo);
    
    arrUserInfo.forEach(user => {
        console.log(user);
       
        const {username,peerId}=user
        $("#ulUser").append(`<li id='${peerId}'>${username}</li>`)
       
    });
    socket.on("newUser",user=>{
        console.log(user);
        const {username,peerId}=user
        $("#ulUser").append(`<li id='${peerId}'>${username}</li>`)
    })
})


$("#ulUser").on("click",'li',function(){
    //sự kiện click vào user trong list
    console.log($(this).attr('id'));
    //lấy ra id chính là peerId của người dùng muốn gọi
    const id=$(this).attr('id')
    // mở stream lấy stream
    openStream().then(stream=>{
        //chạy stream của mình trên localStream đây là id của thẻ tag
        playStream("localStream",stream) 
        
        const call=peer.call(id,stream);
        //gọi tới cái id vừa nhận được
        call.on("stream",remoteStream=>{
        // chạy remoteStream
            playStream("remoteStream",remoteStream)
        })
    })
    
})


function openStream(){
    const config={
        audio:true,
        video:true
    }
   return navigator.mediaDevices.getUserMedia(config);
}


function playStream(idVideoTag,stream){
    const video=document.getElementById(idVideoTag);
    video.srcObject=stream;  
    video.play();
}
//lắng nghe sự kiên gọi 
peer.on("call",call=>{
    //Lấy stream data của mình
    openStream().then(stream=>{
        //Trả lời 
        call.answer(stream)
        //Chạy stream của chúng ta trên local
        playStream("localStream",stream)
        //thực hiện trả lời và chạy video remote
        call.on("stream",remoteStream=>{
            playStream("remoteStream",remoteStream)
        })
    })
})
// $("#btnCall").click(()=>{
//     const id=$("#remoteId").val()
//     openStream().then(stream=>{
//         playStream("localStream",stream) 
//         const call=peer.call(id,stream);
//         call.on("stream",remoteStream=>{
//             playStream("remoteStream",remoteStream)
//         })
//     })
// })
