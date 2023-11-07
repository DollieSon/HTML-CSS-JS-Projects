let Pages = 0;

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
        return PostText();
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
    postinfo = info.post;
    if(postinfo[0] == "<"){
        postinfo = "Blocked";
    }
    $(`#${base}`).append(`
        <div id = "${info.id}" class = "PostBlock"></div>    
    `);
    $(`#${info.id}`).append(`
    <p>${postinfo}</p>
    <p>User: ${info.user}   Date: ${info.date}    ID: ${info.id}</p>
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

function PostText(){
    PostTextinfo =  $("#Post_Area").val();
    $.ajax({
        url:`http://hyeumine.com/forumNewPost.php`,
        method:"Post",
        data:{id:UserData.id,post:PostTextinfo},
        success:(data)=>{
            console.log(data);
        }
    });
}

function DeletePost(){
    PostText = toString($("#Post_Area").val());
    $.ajax({
        url:`http://hyeumine.com/ forumDeletePost.php`,
        method:"Post",
        data:{id:1},
        success:(data)=>{
            console.log(data);
        }
    });
}

let UserList = {
};


function sanitizeString(input) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/ /g,'-' ).replace(/\./g,'-' );
}

function ParseUsername(postList){
    if(!(Object.keys(UserList).includes(postList.user))){
        UserList[sanitizeString(postList.user).slice(0,20)] = '-1';
    }
}

function LoadUsers(){
    sanitized = "";
    $("#AllUsers").remove();
    $("#UserList").append(`<form id="AllUsers"></form>`);
    for(user of Object.keys(UserList)){
        sanitized = user;
        $(`#AllUsers`).append(`
            <div id="div${sanitized}"><input type="checkbox" id="cb_${sanitized}"></div>
        `);
        $(`#div`+sanitized).append(`
            <label for="cb_${sanitized}">${sanitized}</label>
        `);
    }
}
