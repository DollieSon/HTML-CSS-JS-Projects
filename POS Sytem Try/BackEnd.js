let ReadJSON;

$(document).ready(function(){
    $.getJSON('./Jasons/Menu.json',function(res){
        ReadJSON = res;
        Display();
        console.log("In Func:" + typeof(ReadJSON));
    });
    function Display(){
        $("#Orders").remove();
        console.log(ReadJSON);
        $("#Curr-Menu").append(`<div id ="Orders"></div>`);
        for(let Item of ReadJSON){
            console.log(`Name:${Item.Name},${Item.Price}`);
            $("#Orders").append(
                `<p>Name:${Item.Name},${Item.Price}</p>`
            );
        }
        console.log(typeof(ReadJSON));
    }
    var NewItems=null;
    $("#Add-Item").click(function(){
        ReadJSON.push({"Name":$("#Input-Name").val(),
        "Price":+$("#Input-Price").val()
        });
        Display(); 
    });
     $("#Create-Json").click(function(){
        console.log(ReadJSON);
        let DataBlob = new Blob([JSON.stringify(ReadJSON)],{type: 'application/json'});
        console.log(DataBlob);
        $('#Download-Json').attr('href', URL.createObjectURL(DataBlob));
        $('#Download-Json').css({
            "display":"block"
        });
     });
});

