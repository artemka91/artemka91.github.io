var SPELLBOOK = {
    "name":"Player's handbook",
    "file":"../json/Player's handbook.json",
    "spells":{},
    "spell_nodes":[],             
    "page_nodes":[]             
};
//=============================================================================
window.onload = async function fetchBook(){
    const responce = await fetch(SPELLBOOK.file);
    SPELLBOOK.spells = await responce.json();
    // console.log(Object.keys(SPELLBOOK.spells));
    SPELLBOOK.spell_nodes = await formatSpells(SPELLBOOK);



    let spell_nodes = await drawSpells(SPELLBOOK);


    
    let page_max_height = Math.ceil(parseFloat(cssProperty(document.
        querySelector(".page#template > div.a5_cont \
        > div.a5_canvas"),"max-height")));

    console.log(page_max_height);







    //SPELLBOOK.page_nodes = await drawPages(Math.ceil(spell_nodes.offsetHeight/page_max_height)+1);

    //var curr_page_index = 0;
    //var curr_page = SPELLBOOK.page_nodes[curr_page_index];
    //PRINT LINE BY LINE
    // while(SPELLBOOK.spell_nodes.length > 0){
        //if(await checkHeight(SPELLBOOK.spell_nodes[0], curr_page, page_max_height)){
        // document.body.appendChild(SPELLBOOK.spell_nodes.shift());
        // }else{
        //     curr_page_index++;
        //     curr_page = SPELLBOOK.page_nodes[curr_page_index];
        // }
    // }


    //PRINT WITH WORD WRAP [BUGGED]
    // while(SPELLBOOK.spell_nodes.length > 0){
    //     if(await checkHeight(SPELLBOOK.spell_nodes[0], curr_page, page_max_height)){
    //         curr_page.appendChild(SPELLBOOK.spell_nodes.shift());
    //     }else{
    //         let line_height = Math.floor(parseFloat(cssProperty(
    //             SPELLBOOK.spell_nodes[0],"line-height")));
    //         let free_space = page_max_height - Math.floor(curr_page.offsetHeight);
    //         if(line_height > free_space){
    //             curr_page_index++;
    //             curr_page = SPELLBOOK.page_nodes[curr_page_index];
    //         }
    //         else{
    //             let dest_node = SPELLBOOK.spell_nodes[0].cloneNode(true);
    //             let text_p1 = SPELLBOOK.spell_nodes[0].innerHTML.split(' ');
    //             let text_p2 = [];
    //             let curr_height = Math.floor(parseFloat(cssProperty(
    //                 SPELLBOOK.spell_nodes[0],"height")));
    //              while(curr_height > line_height*Math.floor(free_space/line_height)){
    //                 text_p2.unshift(text_p1.pop());
    //                 SPELLBOOK.spell_nodes[0].innerHTML = text_p1.join(" ");
    //                 curr_height = Math.floor(parseFloat(cssProperty(
    //                     SPELLBOOK.spell_nodes[0],"height")));
    //             }
    //             dest_node.innerHTML = text_p2.join(" ");
    //             SPELLBOOK.page_nodes[curr_page_index+1].appendChild(dest_node);
    //         }
    //     }
    // };



    // document.getElementById("30").scrollIntoView();
};
//=============================================================================
const checkHeight =(node, page, limit)=> {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            let result = node.offsetHeight + 
                Math.floor(page.offsetHeight) < limit;
            resolve(result);
        },0);
    });
}

const cssProperty =(node,prop)=> {
    return window.getComputedStyle(node).getPropertyValue(prop);
}

const drawSpells =(spellbook)=> {
    return new Promise(r=>{
        let spells_node = document.querySelector("#spells");
        for (let node of spellbook.spell_nodes){
            spells_node.appendChild(node)
        };
        setTimeout(()=>{r(spells_node)},0);
    });
}

const formatSpells =(spellbook)=> {
    return new Promise(r=>{
        let spells = Object.entries(spellbook.spells);
        var arr = [];
        const formatSpell =(spell)=>{
            let name_tag = document.querySelector(".spell#template > .name").cloneNode(true);
                name_tag.innerHTML = `${spell[1].name} [${Object.values(spell)[0]}]`;
                arr.push(name_tag);
            let level_tag = document.querySelector(".spell#template > .level").cloneNode(true);
            let level_or_cantrip = level_tag.innerText.split('|');
                level_tag.innerHTML = (spell[1].level == 0 ? 
                    `${level_or_cantrip[0]}, `:
                    `${spell[1].level} ${level_or_cantrip[1]}, `)+
                    `${spell[1].school}`;
                    arr.push(level_tag);
            let cast_time_tag = document.querySelector(".spell#template > .cast_time").cloneNode(true);
                cast_time_tag.innerHTML += spell[1].cast_time;
                arr.push(cast_time_tag);
            let distance_tag = document.querySelector(".spell#template > .distance").cloneNode(true);
                distance_tag.innerHTML += spell[1].distance;
                arr.push(distance_tag);
            let components_tag = document.querySelector(".spell#template > .components").cloneNode(true);
                components_tag.innerHTML += spell[1].components;
                arr.push(components_tag);
            let duration_tag = document.querySelector(".spell#template > .duration").cloneNode(true);
                duration_tag.innerHTML += spell[1].duration;
                arr.push(duration_tag);
            let classes_tag = document.querySelector(".spell#template > .classes").cloneNode(true);
                classes_tag.innerHTML += spell[1].classes;
                arr.push(classes_tag);
            if(spell[1].archetypes!=""){
                let archetypes_tag = document.querySelector(".spell#template > .archetypes").cloneNode(true);
                    archetypes_tag.innerHTML += spell[1].archetypes;
                    arr.push(archetypes_tag);
                }
            let source_tag = document.querySelector(".spell#template > .source").cloneNode(true);
                source_tag.innerHTML += spellbook.name;
                arr.push(source_tag);
            let description_tag = document.querySelector(".spell#template > .description").cloneNode(true);
                description_tag.innerHTML = spell[1].description;
            if(spell[1].higher_level_desc==""){
                description_tag.style.marginBottom = "5mm";
                arr.push(description_tag);
            }else{
                let higher_level_desc_tag = document.querySelector(".spell#template > .higher_level_desc").cloneNode(true);
                    higher_level_desc_tag.innerHTML += spell[1].higher_level_desc;
                    arr.push(description_tag);
                    arr.push(higher_level_desc_tag);
            }
        }
        for(let s of spells){formatSpell(s)};
        r(arr);
    });
}

const drawPages =(quantity)=> {
    return new Promise(r=>{
        let arr = [];
        let pages_node = document.getElementById("pages");
        for(let n=0;n<quantity;n++){
            let page_node = document.
                querySelector(".page#template").cloneNode(true);
            page_node.setAttribute("id",`${n}`);
            pages_node.appendChild(page_node);
            let a5_cont = document.
                querySelectorAll('div#pages > div.page > div.a5_cont')[n];
            n % 2 != 0 ?
                a5_cont.style.flexDirection = "row-reverse":
                a5_cont.style.flexDirection = "row";
            let a5_canvas = document.
                querySelectorAll('div#pages > div.page > \
                div.a5_cont > div.a5_canvas')[n];
            arr.push(a5_canvas);
        }
        setTimeout(()=>{r(arr)},0);
    });
}