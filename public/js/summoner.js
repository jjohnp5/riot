var j = jQuery.noConflict();
j(document).ready(function () {
    j.ajaxSetup({
        cache: false
    });
    var hiddenData = j('.hidden-match-data');
    var moreBtn = j('.more');
    getItemImages();
    getChampImages();
    getSummonerSpells();
    hiddenData.hide();

    function getSummonerSpells() {
        j.ajax("/summoner/spells")
            .done(function (result) {
                allTables = j('.spell')
                keys = Object.keys(result.data);
                for(var i = 0; i < allTables.length; i++){
                    for(var k = 0; k < keys.length; k++){
                        if(result.data[keys[k]].key === allTables[i].dataset.spell){
                            imgTag = `<img class="img-fluid" src="http://ddragon.leagueoflegends.com/cdn/7.18.1/img/spell/${result.data[keys[k]].image.full}" alt="spell">`
                            allTables[i].innerHTML = imgTag;
                        }

                    }
                }
            });
    }
    function getChampImages(){
        j.ajax("/summoner/champs")
            .done(function (result) {
                allTables = j('.champ')
                keys = Object.keys(result.data);
                for(var i = 0; i < allTables.length; i++){
                    for(var k = 0; k < keys.length; k++){
                        if(result.data[keys[k]].key === allTables[i].dataset.champ){
                            imgTag = `<img class="img-fluid" src="http://ddragon.leagueoflegends.com/cdn/7.18.1/img/champion/${result.data[keys[k]].image.full}" alt="spell">`
                            allTables[i].innerHTML = imgTag;
                        }

                    }
                }
            });
    }
    function getItemImages(){
        j.ajax("/summoner/items")
            .done(function (result) {
                allTables = j('.item')
                keys = Object.keys(result.data);
                for(var i = 0; i < allTables.length; i++){
                    if(allTables[i].dataset.item === "0"){
                        imgTag = `<img class="img-fluid" src="http://ddragon.leagueoflegends.com/cdn/7.18.1/img/item/3637.png" alt="spell">`
                        allTables[i].innerHTML = imgTag;
                    }
                    for(var k = 0; k < keys.length; k++){

                        if(keys[k] === allTables[i].dataset.item){
                            imgTag = `<img class="img-fluid" src="http://ddragon.leagueoflegends.com/cdn/7.18.1/img/item/${result.data[keys[k]].image.full}" alt="spell">`
                            allTables[i].innerHTML = imgTag;
                        }

                    }
                }
            });
    }
    moreBtn.click(function(){
        moreBtn.each(index =>{
            moreBtn[index].textContent = "+";
            console.log(moreBtn[index].dataset.minimized);
        })
        hiddenData.each(index => {
            moreData = j(hiddenData[index]);

            if(hiddenData[index].dataset.divid === this.dataset.btn){
                moreData.addClass(this.classList[1]);
                if(hiddenData[index].dataset.minimized === "true"){
                    moreData.slideDown(500);
                    this.textContent = "-";
                    hiddenData[index].dataset.minimized = "false";
                }else{
                    moreData.slideUp();
                    this.textContent = "+";
                    hiddenData[index].dataset.minimized = "true";
                }

            }else {
                moreData.slideUp();
                hiddenData[index].dataset.minimized = "true";
            }

        })
    })
});