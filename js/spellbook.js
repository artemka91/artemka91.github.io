var SPELLBOOK = {
    name: "Player's handbook",
    file: "../json/Player's handbook.json",
    spells: [],
    drawPage: function (LoR = false, parent = document.body) {
        let template = document.querySelector(".page#template").cloneNode(true)
            template.setAttribute("id", ("page-" + parent.children.length))
        let container = template.children[(--template.children.length)]
        if(LoR) container.style.flexDirection = "row-reverse"
            
            parent.appendChild(template)
        return container.children[(--container.children.length)]
    },
    drawSpell: function (index = 0, parent = document.body) {
        return new Promise(r=>{
            let spell = this.spells[index]
            let template = document.querySelector(".spell#template").cloneNode(true)
            template.setAttribute("id", `spell-${index}`)
            template.children[0].innerHTML = `${spell.name_lang} [${spell.name}]`
            let LoC = template.children[1].innerText.split('|')
            template.children[1].innerHTML = (spell.level == 0 ?
                `${LoC[0]}, `:`${spell.level} ${LoC[1]}, `)+spell.school
            template.children[2].innerHTML += spell.cast_time
            template.children[3].innerHTML += spell.distance
            template.children[4].innerHTML += spell.components
            template.children[5].innerHTML += spell.duration
            template.children[6].innerHTML += spell.classes
            spell.subclasses != "" ? 
                template.children[7].innerHTML += spell.subclasses:
                template.children[7].style.display = "none"
            template.children[8].innerHTML += this.name
            template.children[9].innerHTML = spell.description
            spell.higher_level_desc != "" ?
                template.children[10].innerHTML += spell.higher_level_desc:
                template.children[10].style.display = "none"
            parent.appendChild(template)
            r()
        })
        
    },
    listSpells: function () {console.log(this.spells)}
};
//=============================================================================
window.onload = async function (){
    const responce = await fetch(SPELLBOOK.file);
    SPELLBOOK.spells = await responce.json();
    let nodeSpells = document.getElementById("spells");
    (async function drawSpells() {
        for(let spell of SPELLBOOK.spells){
            let i = SPELLBOOK.spells.indexOf(spell)
            await SPELLBOOK.drawSpell(i, nodeSpells)
        }
        let curr_page = SPELLBOOK.drawPage(true, document.getElementById("pages"))
        let spells = document.getElementById("spells")
        let height_limit = parseFloat(window.getComputedStyle(curr_page).getPropertyValue("max-height"))
        for(let spell_preview of spells.childNodes){
            let spell = spell_preview.cloneNode(true)
            if(spell_preview.offsetHeight < height_limit - curr_page.offsetHeight){
                curr_page.appendChild(spell)
            }else{
                //break page after \f in spell
                if(spell.innerText.indexOf('\f') != -1){
                    let spell_p1 = spell
                    let spell_p2 = spell.cloneNode(true)
                    let spell_p1_text = spell_p1.children[(spell_p1.children.length-2)]
                    spell_p1.children[(spell_p1.children.length-1)].innerHTML = ""
                    spell_p1_text.innerHTML = spell_p1_text.innerHTML.split('\f')[0]
                    curr_page.appendChild(spell_p1)
                    curr_page = SPELLBOOK.drawPage(
                        (document.getElementById("pages").children.length % 2 == 0),
                         document.getElementById("pages"))
                    for(let i=0;i<(spell_p2.children.length-2);i++){
                        spell_p2.children[i].innerHTML = ""
                    }
                    let spell_p2_text = spell_p2.children[(spell_p2.children.length-2)]
                    spell_p2_text.innerHTML = spell_p2_text.innerHTML.split('\f')[1]
                    curr_page.appendChild(spell_p2)
                }else{
                    curr_page = SPELLBOOK.drawPage(
                        (document.getElementById("pages").children.length % 2 == 0),
                         document.getElementById("pages"))
                    curr_page.appendChild(spell)
                }
            }
        }
        //scroll to end
        // document.getElementById(`page-${document.getElementById("pages").children.length-1}`).scrollIntoView();
        // document.getElementById(`page-30`).scrollIntoView();

    })()
};
