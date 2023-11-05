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

});

function GetPosts(pagenum){
    $.ajax({
        url:`http://hyeumine.com/forumGetPosts.php`,
        method:"Get",
        data:{page:pagenum},
        success:(data)=>{
            console.log(data);
            Forum_Posts  =  JSON.parse(data);
            $("#Posts").remove();
            $("#Posts-Container").append(`<div id="Posts"></div>`);
            for(Indv of Forum_Posts){
                //console.log(Indv);
                test = DetectScipts(Indv);
                createCards(test,"Posts");
            }
            console.log(Forum_Posts);
        }
    });
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
    <p>${info.user} -- ${info.date}</p>
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