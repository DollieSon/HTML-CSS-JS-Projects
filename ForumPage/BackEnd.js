let Pages = 0;
let List_Users;
let UserList = {};
$(document).ready(function(){
    $("#Get_Posts").click(function(){
        console.log("Sending");
        return GetPosts(1);
    });

    $("#Create_User").click(function() {
        return CreateUser();
    });

    $("#Login").click(function(){
        return Login();
    });

    $("#Send_Post").click(function(){
        PostText(1);
        PostText(2);
        PostText(3);
    });

    $("#Delete_Post").click(function(){
        return DeletePost();
    });

    $(`#Get_Page_New`).click(function(){
        result = -1;
        Pages++;
        result = GetPosts(Pages);
        while(result == -1){
        };
        if(result == 1){    
            $(`#New_Pages`).append(`
            <button onclick = "GetPosts(${Pages})">Page ${Pages}</button>
        `   );
        }
    });

    $(`#collect_data`).click(function(){
        downloadList(UserList);
    });

    $(`#Post_All`).click(function(){
        PostToall(UserList);
    });
    $(`#infposts`).click(function(){
        InfinatePosts();
    });
    $(`#LoadUsers`).click(function(){
        $.getJSON(`Users.json`,function(PureJSON){
            UserList = PureJSON;
            LoadUsers();
        }).done(function(){
            console.log("Done");
            LoadUsers();
        });
    });
    
    $(`#GetFrom`).click(function(){
        GetMainPost();
    });
});

let Forum_Posts = [];

function GetPosts(pagenum){
    $.ajax({
        url:`http://hyeumine.com/forumGetPosts.php`,
        method:"Get",
        data:{page:pagenum},
        success:(data)=>{
            console.log(data);
            $("#Posts").remove();
            $("#Posts-Container").append(`<div id="Posts"></div>`);
            Forum_Posts = JSON.parse(data);
            if(Forum_Posts.length == 0){
                alert("No Pages Left");
                return 0;
            }
            for(Indv of Forum_Posts){
                //console.log(Indv);
                ParseUsername(Indv);
                test = DetectScipts(Indv);
                createCards(test,"Posts");
            }
            console.log(Forum_Posts);
            LoadUsers();
            Waiting = 1;
        }
    });
    return 1;
}

function GetMainPost(){
    $.ajax({
        url:`http://hyeumine.com/forumGetPosts.php`,
        method:"Get",
        success:(data)=>{
            console.log(data);
            Forum_Posts = JSON.parse(data);
            for(Indv of Forum_Posts){
                //console.log(Indv);
                ParseUsername(Indv);
            }
            console.log(Forum_Posts);
            LoadUsers();
            Waiting = 1;
        }
    });
    return 1;
}

function DetectScipts(info){
    postinfo = JSON.parse(JSON.stringify(info));
    for(some in info){
        if(typeof(info[some] == String)){
            if(info[some][0] == "<"){
                postinfo[some] = "Blocked";
                alert("Script Detected: "+ some);
                console.log(info);
            }
        }
    }
    return postinfo;
}


function createCards(info,base){
    $(`#${base}`).append(`
        <div id = "${sanitizeString(info.id)}" class = "PostBlock"></div>    
    `);
    $(`#${info.id}`).append(`
    <p>${sanitizeString(info.post)}</p>
    <p>User: ${sanitizeString(info.user)}   Date: ${sanitizeString(info.date)}    ID: ${sanitizeString(info.id)}</p>
    `);

}

let UserData;
let Error = {
    Login:0
};
function CreateUser(){
     $.ajax({
        url:`http://hyeumine.com/forumCreateUser.php`,
        method:"Post",
        data:{
            username:$("#uname").val(),
        },
        success:(data)=>{
            UserData = JSON.parse(data);
            console.log(UserData);
            console.log(data);
        }
    });
    UserData
}

function Login(){
    $.ajax({
        url:`http://hyeumine.com/forumLogin.php`,
        method:"Post",
        data:{username:$("#uname").val()},
        success:(data)=>{
            res = JSON.parse(data);
            if(!res.success){
                alert("Log-In Unsucessfull");
                Error.Login = 1;
                return;
            }
            if(UserData != null){
                if(UserData.id != res.user.id && UserData.username == res.user.username){
                    alert("Logged in to a different acc");
                    Error.Login = 2;
                    return;
                }
            }
            console.log("Login-Successfull");
            console.log(res);
            UserData = res.user;
        }
    });
    console.log("AJAX DONE -------");
}

function PostText(num){
    PostTextinfo =  $("#Post_Area").val();
    $.ajax({
        url:`http://hyeumine.com/forumNewPost.php`,
        method:"Post",
        data:{id:parseInt(num),post:PostTextinfo},
        success:(data)=>{
            console.log(data);
        }
    });
}

function AntiBotPost(num){
    PostTextinfo =  $("#Post_Area").val();
    $.ajax({
        url:`http://hyeumine.com/forumNewPost.php`,
        method:"Post",
        data:{id:parseInt(num),post:randomString(10)},
        success:(data)=>{
            console.log(data);
        }
    });
}


function PostTextParse(num,x,z){
    PostTextinfo =  $("#Post_Area").val();
    console.log(num);
    $.ajax({
        url:`http://hyeumine.com/forumNewPost.php`,
        method:"Post",
        data:{id:parseInt(num),post:PostTextinfo},
        success:(data)=>{
            console.log(data);
            if(x == z){
                alert("All Done");
            }
        }
    });
}

function DeletePost(){
    PostTextx = toString($("#Post_Area").val());
    $.ajax({
        url:`http://hyeumine.com/ forumDeletePost.php`,
        method:"Post",
        data:{id:1},
        success:(data)=>{
            console.log(data);
        }
    });
}



function sanitizeString(input) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/,/g, '&#44;').replace(/\./g, '.').replace(/@/g, 'q').replace(/ /g, '&nbsp;');
}
function sanitizeString2(input) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/,/g, '&#44;').replace(/\./g, '.').replace(/@/g, 'q').replace(/ /g, '-');
}
function ParseUsername(postList){
    if(!(Object.keys(UserList).includes(postList.user))){
        UserList[postList.user] = postList.uid;
    }
}

function LoadUsers(){
    sanitized = "";
    $("#AllUsers").remove();
    $("#UserList").append(`<form id="AllUsers"></form>`);
    for(user of Object.keys(UserList)){
        console.log(user);
        sanitized = sanitizeString2(user);
        $(`#AllUsers`).append(`
            <div id="${UserList[user]}"><input type="checkbox" id="cb_${sanitized}"></div>
        `);
        $(`#${UserList[user]}`).append(`
            <label for="cb_${sanitized}">${sanitized}</label>
        `);
    }
}

function downloadList(theObject){
    console.log(theObject);
    MyBlob = new Blob([JSON.stringify(theObject)],{type:"application/json"});
    linkelem = document.createElement(`a`);
    linkelem.href = URL.createObjectURL(MyBlob);
    linkelem.download = `UserList.json`;
    $('#Download-Data').append(linkelem);
    linkelem.click();
}

function PostToall(mylist){
    timeoutTime = 0;
    console.log(mylist);
    console.log(mylist.asd);
    for(some in mylist){
        setTimeout(delayedFunc(some,mylist),7500 * (timeoutTime++));
    }
}

function delayedFunc(index,Ulist){
    console.log(index);
    PostTextParse(Ulist[index],1,1);
}

let Waiting =-1;
function InfinatePosts(){
    bound_reps = 1000;
    x = 1;
    reps = 0;
    function RepeatFunction(){
        Uvals = Object.values(UserList).map(Number);
        while(Uvals.includes(x)){
            console.log(`${x} already Exists`);
            x++;
        }
        console.log(x);
        reps++;
        AntiBotPost(x++);
        console.log(reps);
        if(reps >= bound_reps){
            clearInterval(MyID);
            downloadList();
            alert("Scrapping Done");
        }if(reps%10 == 0){
            GetMainPost();
        }if(reps%100 == 0){
            downloadList();
        }
    }
    MyID = setInterval(RepeatFunction,3000);
}

function randomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }