const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//get username and room
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

socket.emit('joinRoom',{username,room});
socket.on('message',message=>{
    console.log(message);

    //mesaage front-end -> sever ->front-end alay 
    //tyala ata print karyache console aivaji scrren var
    outputMessage(message);
});

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });

chatForm.addEventListener('submit',(e)=>
{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    //console.log(msg);
    socket.emit('chatMessage',msg);
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
`;
chatMessages.appendChild(div);
}

function outputRoomName(room) {
    roomName.innerText = room;
  }
  
  // Add users to DOM
  function outputUsers(users) {
    userList.innerHTML = `
      ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
  }