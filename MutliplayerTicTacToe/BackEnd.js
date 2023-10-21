const ID_List = []
let Current_Id = null
let Game_ID = null
$(document).ready(function(){
    //Create Account
    $("#Create-Player-Button").on("click",function() {
        return CreateID()
    })

    $("#Create-Game").on("click",function(){
        return CreateGame()
    })

    $("#Join-Game-Button").on("click",function(){
        return JoinGame() 
    })
});

function CreateID(){
    const Fname = $("#First-Name-Input").val();
    const Lname = $("#Last-Name-Input").val();
    if(Fname == "" || Lname == ""){
        alert("Invalid Input");
        return;
    } 
    //console.log("Fname:" + Fname + "Lname:" + Lname);
    $.ajax({
        url:`http://hyeumine.com/newuser.php`,
            method:"POST",
            data:{firstname:Fname,
                lastname:Lname},
            success:(data)=>{
                ID_List.push(JSON.parse(data));
                Current_Id = ID_List[ID_List.length -1].id
                $("#Current-ID").text(`Current ID: ${Current_Id}`);
                $("#Player_Name").text(`Name: ${Fname} ${Lname}`);
                console.log(data);
                console.log(ID_List);
            },
            error:()=>{
                alert("Failed To Create ID");
            }
    }).done(function(){ // Add Start Note
        $.ajax({
            url: `http://hyeumine.com/newnote.php`,
            method:"POST",
            data:{id:Current_Id,note:`[TTT] ${Fname} ${Lname}`},
            success:()=>{
                console.log("Posted First Note");
            },error:()=>{
                alert("Failed To Create First Note");
            }
        }).done(function(){ // Check First Note (Uneeded) only for debugging
            $.ajax({
                url: `http://hyeumine.com/mynotes.php`,
                method:"GET",
                data:{id:Current_Id},
                success:(something)=>{
                    console.log(something);
                },error:()=>{
                    alert("Failed To Get Notes");
                }
            })
        });
    });
    
    
}

function CreateGame(){
    let GameFname = "TTT"
    let GameLname = "Game"
    $.ajax({
        url:`http://hyeumine.com/newuser.php`,
        method:"POST",
        data:{firstname:GameFname,
            lastname:GameLname},
        success:(data)=>{
            Game_ID = JSON.parse(data).id;
            console.log(JSON.parse(data));
            $("#Game-ID-Text").text(`Game ID: ${Game_ID}`);
        },
        error:()=>{
            alert("Failed To Create Game ID");
        }
    }).done(function(){ // Add Start Note
        $.ajax({
            url: `http://hyeumine.com/newnote.php`,
            method:"POST",
            data:{id:Game_ID,note:`[TTT Game] ${ID_List[ID_List.length-1].lastname}`},
            success:()=>{
                console.log("Posted Game First Note");
            },error:()=>{
                alert("Failed To Create First Note");
            }
        })
    });
}

function JoinGame(){
    let Note_History;
    GameVal = parseInt($("#Join-By-ID").val());
    $.ajax({
        url: `http://hyeumine.com/mynotes.php`,
        method:"GET",
        data:{id:GameVal},
        success:(something)=>{
            Note_History = JSON.parse(something).notes;
            console.log(Note_History);
            if(Note_History.length == 1 && Note_History[0][0].substr(0,10) == "[TTT Game]"){
                console.log("Game Detected");
                $.ajax({
                url: `http://hyeumine.com/newnote.php`,
                method:"POST",
                data:{id:GameVal,note:`{"P":"P2","Msg":"Confirm"}`},
                success:()=>{
                    console.log("Confirmation Posted");
                }
                })
            }else{
                alert("Game has Already Started OR Game ID Is INCorrect");
            }
            debugger;
        }
    });
}