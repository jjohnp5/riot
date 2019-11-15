var j = jQuery.noConflict();
j(document).ready(function () {
    j.ajaxSetup({
        cache: false
    });
    var hiddenData = j('.hidden-match-data');
    var moreBtn = j('.more');
    var matchesContainer = j('.matches-container')
    getItemImages();
    getChampImages();
    getSummonerSpells();
    var hiddenHeight = hiddenData.height;
    hiddenData.hide();



    function getSummonerSpells() {
        j.ajax("/api/spells")
            .done(function (result) {
                allTables = j('.spell')
                keys = Object.keys(result.data);
                for(var i = 0; i < allTables.length; i++){
                    for(var k = 0; k < keys.length; k++){
                        if(result.data[keys[k]].key === allTables[i].dataset.spell){
                            imgTag = `<img class="img-fluid" src="http://ddragon.leagueoflegends.com/cdn/9.22.1/img/spell/${result.data[keys[k]].image.full}" alt="spell"
                                    ><div class="popup"><h4>${result.data[keys[k]].name}</h4>${result.data[keys[k]].description}</div>`;
                            allTables[i].innerHTML = imgTag;
                            tippy(allTables[i], {
                                html: el => el.querySelector('.popup'),
                                position: 'bottom',
                                theme: 'badass',
                                animation: 'none',
                                duration: [200, 0],
                                flipDuration: 0,
                                performance: true
                            });


                        }

                    }
                }
                console.log(result);
            });
    }

    function getChampImages(){
        j.ajax("/api/champs")
            .done(function (result) {
                allTables = j('.champ')
                keys = Object.keys(result.data);
                for(var i = 0; i < allTables.length; i++){
                    for(var k = 0; k < keys.length; k++){
                        if(result.data[keys[k]].key === allTables[i].dataset.champ){
                            imgTag = `<img class="img-fluid" src="http://ddragon.leagueoflegends.com/cdn/9.22.1/img/champion/${result.data[keys[k]].image.full}" alt="spell">
                                <div class="popup"><h4>${result.data[keys[k]].id}</h4>
                                "${result.data[keys[k]].title}"
                                <p>ROLE: ${result.data[keys[k]].tags.join("/")}</p></div>`;
                            allTables[i].innerHTML = imgTag;
                            tippy(allTables[i], {
                                html: el => el.querySelector('.popup'),
                                position: 'bottom',
                                theme: 'badass',
                                arrow: true,
                                animation: 'none',
                                duration: [200, 0],
                                performance: true
                            });
                        }

                    }
                }
                console.log(result);
            });
    }
    function getItemImages(){
        j.ajax("/api/items")
            .done(function (result) {
                allTables = j('.item')
                keys = Object.keys(result.data);
                for(var i = 0; i < allTables.length; i++){
                    if(allTables[i].dataset.item === "0"){
                        imgTag = `<img class="img-fluid" src="http://ddragon.leagueoflegends.com/cdn/9.22.1/img/item/3637.png" alt="spell">`
                        allTables[i].innerHTML = imgTag;
                    }
                    for(var k = 0; k < keys.length; k++){

                        if(keys[k] === allTables[i].dataset.item){
                            imgTag = `<img class="img-fluid" src="http://ddragon.leagueoflegends.com/cdn/9.22.1/img/item/${result.data[keys[k]].image.full}" alt="spell">
                                    <div class="popup"><h4>${result.data[keys[k]].name}</h4>${result.data[keys[k]].description}</div>`;
                            allTables[i].innerHTML = imgTag;
                            tippy(allTables[i], {
                                html: el => el.querySelector('.popup'),
                                position: 'bottom',
                                theme: 'badassitems',
                                animation: 'none',
                                duration: [200, 0],
                                performance: true
                            });
                        }

                    }
                }
                console.log(result);
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
                    setTimeout(matchesContainer.css('minHeight', '200%'), 100);
                }else{
                    moreData.slideUp(500);
                    this.textContent = "+";
                    hiddenData[index].dataset.minimized = "true";
                    setTimeout(matchesContainer.css('minHeight', '130%'), 100);
                }

            }else {
                moreData.slideUp();
                hiddenData[index].dataset.minimized = "true";
            }

        })
    })
});