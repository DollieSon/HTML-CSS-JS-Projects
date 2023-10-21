$(document).ready(function(){
    let UserList=[];
    let ID;
    $("#Create-User").click(function(){
        $.ajax({
            url:`http://hyeumine.com/newuser.php`,
            method:"POST",
            data:{firstname:$("#FirstName-Input").val(),
                lastname:$("#LastName-Input").val()},
            success:(data)=>{
                UserList.push(JSON.parse(data));
                ID = JSON.parse(data).id;
                $("#ID-Input").val(ID);
                console.log(UserList);
                $("#TempUserList").remove();
                displayUsers(UserList);
            }
        });
    });
    $("#Insert-Note").click(function(){
        console.log("ID:" + ID + typeof(ID));
        $.ajax({
            url: `http://hyeumine.com/newnote.php`,
            method:"POST",
            data:{id:parseInt($("#ID-Input").val()),note:$("#Note-Input").val()},
            success:()=>{
                console.log("Posted");
            }
        });
    });
    $("#See-Notes").click(function(){
        $.ajax({
            url: `http://hyeumine.com/mynotes.php`,
            method:"GET",
            data:{id:parseInt($("#ID-Input").val())},
            success:(something)=>{
                console.log(something);
                NoteList = JSON.parse(something);
                console.log(NoteList);
                $("NoteBox").remove();
                console.log(`ID: ${$("#ID-Input").val()}`);
                $("#ID-By-Note").text(
                    `${$("#ID-Input").val()}'s Notes:`
                );
                displayNotes(NoteList);
            }
        })
    });
    function displayUsers(NoteArr){
        console.log("NoteArr");
        console.log(NoteArr);
        $("#UserList").append(`<div id = "TempUserList"></div>`);
        for(Some of NoteArr){
            console.log(Some);
            $("#TempUserList").append(
                `<div class="card" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">ID:${Some.id}</h5>
                  <p class="card-text">Name:${Some.firstname} ${Some.lastname}.</p>
                </div>
              </div>`
            );
        }
    }
    function displayNotes(NotesList){
        $("#Notes").append(`<div id="NoteBox"></div>`);
        for(Some of NotesList.notes){
            $("#NoteBox").append(
                `<div class="card" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">Date:  ${Some[1]}</h5>
                  <p class="card-text">Note:  ${Some[0]}.</p>
                </div>
              </div>`
            );
        }
    }
});