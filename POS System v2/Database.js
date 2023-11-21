$(document).ready(function(){
    console.log("Ready");
    $(`#AddItem`).click(function(){
        $.ajax({
            url:"http://localhost/something/POS/AddItem.php",
            method:"POST",
            data:{orders:[],Total:1,Given:1,Change:1},
            success:(data)=>{
                console.log(data);
            },error:(error)=>{
                console.log("Error" + JSON.stringify(error))
            }
        });
    });
});