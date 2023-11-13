let MenuList = [];
Order = {
    MenuID:[],
    Name: [],
    IndivPrice: [],
    Count: [],
    Total: [],
}
TotalCash = 0;
Change = 0;
$(document).ready(function(){
    $.getJSON(`Menu.json`,function(PureJSON){
        MenuList = PureJSON;
        console.log(MenuList);
    }).done(function(){
        LoadMenuList();
    });

    $(`#Custombtn`).click(function(){
        console.log(`Calculating Custom Val.`);
        Cash = parseInt($(`#Customin`).val());
        console.log(Cash);
        Change = Cash - TotalCash;
        console.log(Change);
        $(`#CustomCost`).text(`Change: ${Change}`);
        $(`#Custombtn`).attr('onclick',`OutputAll(${Change},${Cash})`);

    });

    $(`#Clearbtn`).click(function(){
        ResetAll();
    });

    $(`#ResetOutput`).click(function(){
        $(`#OutputP`).remove();
        $(`#MainBot`).append(`<p id="OutputP">Output:</p>`);
    });

});



function LoadMenuList(){
    ItemCount = 0;
    $(`#MenuContainer`).remove();
    $(`#Left`).append(`
        <div id="MenuContainer"></div>
    `);
    for(item of MenuList){
        $(`#MenuContainer`).append(`
            <div id="MenuCard${ItemCount}" class="menucard card"> </div>
        `);
        (function(ItemCount){
            $(`#MenuCard${ItemCount}`).on('click',function(){
                ListItem(ItemCount);
            });
        })(ItemCount);
        
        console.log(item);
        //debugger;
        MenuSet = item;
        for(info in MenuSet){
            console.log(info);
            $(`#MenuCard${ItemCount}`).append(`
                <p class="${info}">
                    ${item[info]}
                </p>
            `)
        }
        ItemCount++;
    }
}


// [Name,Indiv Price,Count,Total Price]
function ListItem(itemId){
    console.log(itemId);
    toComp =MenuList[itemId].Name;
    orderIndex = Order.Name.indexOf(toComp);
    console.log("Adding Item " + MenuList[itemId].Name);
    if(orderIndex == -1){ // if isnt in array
        Order.MenuID.push(itemId);
        Order.Name.push(MenuList[itemId].Name);
        Order.IndivPrice.push(MenuList[itemId].Price);
        Order.Count.push(1);
        Order.Total.push(MenuList[itemId].Price);
    }else{
        Order.Count[orderIndex]+=1;
        Order.Total[orderIndex]+=MenuList[itemId].Price;
    }   
    reloadOrder();
}

function DecrementItem(itemId){
    console.log(itemId);
    toComp =MenuList[itemId].Name;
    orderIndex = Order.Name.indexOf(toComp);
    console.log("Decrementing Item " + MenuList[itemId].Name);
    Order.Count[orderIndex]-=1;
    if(Order.Count[orderIndex] < 1){
        Order.MenuID.splice(orderIndex,1);
        Order.Name.splice(orderIndex,1);
        Order.IndivPrice.splice(orderIndex,1);
        Order.Count.splice(orderIndex,1);
        Order.Total.splice(orderIndex,1);
    }else{
        Order.Total[orderIndex]-=MenuList[itemId].Price;
    }
    reloadOrder();
}

function RemoveItem(itemId){
    console.log("Item Id : " + itemId);
    toComp = MenuList[itemId].Name;
    orderIndex = Order.Name.indexOf(toComp);
    console.log("Decrementing Item " + MenuList[itemId].Name);
    Order.MenuID.splice(orderIndex,1);
    Order.Name.splice(orderIndex,1);
    Order.IndivPrice.splice(orderIndex,1);
    Order.Count.splice(orderIndex,1);
    Order.Total.splice(orderIndex,1);
    reloadOrder();
}


function reloadOrder(){
    OrderNames = Object.values(MenuList);
    console.log(OrderNames);
    TotalCash = 0;
    $(`#OrderCont`).remove();
    //console.log(Order);
    $(`#OrderBox`).append(`
        <div id="OrderCont"></div>
    `);
    for(let X = 0;X<Order.Name.length;X++){
        //console.log(Order.Name.length);
        $(`#OrderCont`).append(`
            <div id="OrderNo.${X}" class="OrderClass">
            <div class = "OrderName">${Order.Name[X]}</div>
            <div class = "OrderIPrice">${Order.IndivPrice[X]}</div>
            <div class = "OrderCount">${Order.Count[X]}</div>
            <div class = "OrderTotal">${Order.Total[X]}</div>
            <div class = "Orderbtn">
                <button class="MiniBtn" onclick = "DecrementItem(${Order.MenuID[X]})">-</button>
                <button class="MiniBtn" onclick = "ListItem(${Order.MenuID[X]})">+</button>
                <button class="MiniBtn" onclick = "RemoveItem('${Order.MenuID[X]}')">X</button>
            </div>
        `);
        TotalCash+=Order.Total[X];
    }
    UpdateTotal();
    UpdateChange();
}

function UpdateTotal(){
    $(`#Total`).text(`Total: ${TotalCash} Pesos`);
}
function UpdateChange(){
    //console.log("Updating Change...")
    UpdateButton(1000);
    UpdateButton(500);
    UpdateButton(200);
    UpdateButton(100);
    UpdateButton(50);
    UpdateButton(20);
}
function UpdateButton(Base){
    //console.log(Base + "," + TotalCash);
    Change = Base - TotalCash;
    //console.log(Change);
    if(Change < 0){
        //console.log("Hiding");
        $(`#C${Base}`).hide();
    }else{
        //console.log("Showing");
        $(`#C${Base}`).show();
        $(`#C${Base} button`).text(`${Change}`);
        $(`#C${Base} button`).attr('onclick',`OutputAll(${Change},${Base})`);
    }

}

function ResetAll(){
    console.log("Reseting All");
    for(some in Order){
        Order[some]=[];
    }
    TotalCash = 0;
    Change = 0;
    reloadOrder();
}

function OutputAll(TempChange,GivenCash){
    console.log(TempChange);
    MinOrder = "<br> Order{";
    for(let X = 0;X<Order.Name.length;X++){
        MinOrder+= `${Order.Name[X]} x${Order.Count[X]},`;
    }
    MinOrder+=`}<br> Total: ${TotalCash},Given ${GivenCash}, Change,${TempChange} \n`;
    $(`#MainBot p`).append(MinOrder);
}