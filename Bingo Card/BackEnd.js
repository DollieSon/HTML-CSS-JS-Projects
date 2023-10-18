let CardTokens = []
let IdNumber = "HEelhJos"
var SuccessState = 0;
$(document).ready(function(){
    $("#Current-Game-ID").text('Current Game Id: ' + IdNumber)
    $("#Get-Card").click(function(){
        $.ajax({
            url:"http://www.hyeumine.com/getcard.php?bcode="+IdNumber,
            method:"POST",
            success:(data)=>{
                console.log(data);
                some = JSON.parse(data);
                console.log(some);
                CreateCard(some);
            }
        });
    });
    $("#Get-Card").click();

    $("#IDButton").click(function(){
        SuccessState = 0;
        let TempIdNumber = $("#GameID").val();
        console.log(IdNumber);
        console.log($("#Current-Game-ID").text());
        // reset Board;
        debugger;
        $.ajax({
            url:"http://www.hyeumine.com/getcard.php?bcode="+TempIdNumber,
            method:"POST",
            success:(data)=>{
                if(data == 0){
                    console.log('Incorrect Game Mode: if not alerted get help!');
                    alert("Incorrect Game Code");
                    debugger;   
                    return -1;
                }else{
                    IdNumber = TempIdNumber;
                    $("#Current-Game-ID").text("Current Game Id: " + IdNumber); //move this
                    $(".Card").remove();
                    console.log("Successfully Reset");
                    CardNums = 0;
                    CardTokens = [];
                    $("#Get-Card").click();
                }
            }
        });
    });

    $("#GameBoard").click(function(e){
        e.preventDefault();
        window.open("http://www.hyeumine.com/bingodashboard.php?bcode="+IdNumber,"_blank");
    });

    $("#Check-Cards").click(function(){
        let Won = 0;
        console.log(CardTokens);
        let Token = "";
        for(let TokInd =0; TokInd < CardTokens.length;TokInd++){
            Token = CardTokens[TokInd];
            $.ajax({
                url:"http://www.hyeumine.com/checkwin.php?playcard_token="+ Token,
                method:"POST",
                success:(data)=>{
                    console.log(Token);
                    console.log(data);
                    if(data == '1'){
                        //alert('Your Card: ' +(TokInd+1) + 'Has Won');
                        $("#CardNum"+(TokInd+1)+" .Head").css({
                            'background-color':'green'
                        });
                    }
                }
            });
        }
        if(Won == 1)alert('Your have won!!!! BINGGOOOO');
    });

    // For Appended Elements
    $('#Cards-Section').on('click','.Card p:not(.Head)',function(){
        console.log(this);
        $(this).css({
            //'color':'red',
            'background-color':'rgb(165, 255, 171)'
        });
    });
});


var CardNums=0;
function CreateCard(Info){
    CardNums++;
    CardTokens.push(Info['playcard_token']);
    $(
        '<div class="Card" id="CardNum'+CardNums+'">'
            +'<div class="B-Sec">'
                +'<p class="Head">B</p>'
                +'<p>'+Info['card']['B'][0]+'</p>'
                +'<p>'+Info['card']['B'][1]+'</p>'
                +'<p>'+Info['card']['B'][2]+'</p>'
                +'<p>'+Info['card']['B'][3]+'</p>'
                +'<p>'+Info['card']['B'][4]+'</p>'
                +
            '</div>'
            +'<div class="I-Sec">'
                +'<p class="Head">I</p>'
                +'<p>'+Info['card']['I'][0]+'</p>'
                +'<p>'+Info['card']['I'][1]+'</p>'
                +'<p>'+Info['card']['I'][2]+'</p>'
                +'<p>'+Info['card']['I'][3]+'</p>'
                +'<p>'+Info['card']['I'][4]+'</p>'
                +
            '</div>'
            +'<div class="N-Sec">'
                +'<p class="Head">N</p>'
                +'<p>'+Info['card']['N'][0]+'</p>'
                +'<p>'+Info['card']['N'][1]+'</p>'
                +'<p>'+Info['card']['N'][2]+'</p>'
                +'<p>'+Info['card']['N'][3]+'</p>'
                +'<p>'+Info['card']['N'][4]+'</p>'
            +
            '</div>'
            +'<div class="G-Sec">'
                +'<p class="Head">G</p>'
                +'<p>'+Info['card']['G'][0]+'</p>'
                +'<p>'+Info['card']['G'][1]+'</p>'
                +'<p>'+Info['card']['G'][2]+'</p>'
                +'<p>'+Info['card']['G'][3]+'</p>'
                +'<p>'+Info['card']['G'][4]+'</p>'
            +
            '</div>'
            +'<div class="O-Sec">'
                +'<p class="Head">O</p>'
                +'<p>'+Info['card']['O'][0]+'</p>'
                +'<p>'+Info['card']['O'][1]+'</p>'
                +'<p>'+Info['card']['O'][2]+'</p>'
                +'<p>'+Info['card']['O'][3]+'</p>'
                +'<p>'+Info['card']['O'][4]+'</p>'
            +
            '</div>'
            +      
        '</div>'
    ).appendTo("#Cards-Section");
    
}
function MarkCard(){
    alert('1');
}