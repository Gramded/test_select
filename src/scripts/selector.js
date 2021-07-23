const customSelect = function customSelect () {
    let selectors = document.querySelectorAll('.js-selector');

    if (!selectors.length) {
        return false
    }

    selectors.forEach( selector => {
        selectorBlocksCreator(selector.dataset['selectortext'], selector, selector.name);
        selector.addEventListener('change', evt => {
            console.log(getSelectedOptionsArr(evt.target, 'value') + " выбранные у select option")
        });
    } )

}

const selectorBlocksCreator = (selectorName = "Имя селектора", selector, place) => {

    let selectOptionsArr = [...selector.options];
    let selectedOptions = [];

    selectOptionsArr.map( option => {
            if (option.selected) {
                selectedOptions.push(option)
            }
        }
    );

    let selectorNameTag = `<p class="selector-name">${selectorName}</p>`;
    let selectorInfoTag = `<p class="selector-selected-list" id="info-tag-${place}" data-parent="${place}" onclick="showOptionsList(event)" title="${selectorInfoCreator(selectedOptions)}">${selectorInfoCreator(selectedOptions, 75)}</p>`;
    let showSelectedOptions = `<button class="selector-show-btn" data-parent="${place}" data-parentrole="main" onclick="showOptionsList(event)">Показать выбранные (<span id="counter-${place}">${selectedOptions.length}</span>)</button>`;
    let optionsList = `<div class="selector-option-list" data-child="${place}" id="list-for-${place}">${selectOptionsArr.map(element => {
        return `<div 
                    class="selector-option-list-item" 
                    data-optionvalue="${element.value}" 
                    data-level="${element.dataset.level ? element.dataset.level : 1}"
                    data-selected="${element.selected ? 'true' : 'false'}"
      
                    style="margin-left: ${element.dataset.level ? element.dataset.level*20+'px' : 0}"> 
                        <div 
                        onclick="fakeSelectClick(event)"
                        style="left: ${element.dataset.level ? element.dataset.level*-20+'px' : 0}" 
                        class="fake-before" data-fakebefore="${place}-${element.value}">
                            ${element.selected ? "&#10003;" : "&#8226;"}
                        </div>
                    <div
                    onclick="closeChild(event)"
                    class="option-list-item-text">     
                    ${element.label}
                    </div>  
                </div>`
    }).join('')}</div>`;


    let selectorBlock =
        `<div id="div-for-${place}" class="selector-selected-options container">
            <div class="select-header">
                ${selectorNameTag} 
                ${showSelectedOptions}
            </div>
            ${selectorInfoTag}
            ${optionsList}
            <div class="select-footer">
            <button class="btn btn-access" onclick="sendSelectedOptions(event)" data-btnto="${place}">Применить</button>
            <button class="btn btn-clean" onclick="clearSelectedOptions(event)" data-btnto="${place}">Очистить</button>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', selectorBlock);



    let fakeSelectArr = document.querySelector(`[id="list-for-${place}"]`);


    //______________Блок при загрузке страницы определяет вложенные селекты и включает их__________
    //
    //
    // for (let i = 0; i < selectedOptions.length; i++) {
    // selectSelectedFromLevels(fakeSelectArr, selectOptionsArr.indexOf(selectedOptions[i]), fakeSelectArr[i].dataset.level)
    // }


    for (let i = 0; i < fakeSelectArr.children.length; i++) {
        selectGrupFromLevels(fakeSelectArr, i, fakeSelectArr.children[i].dataset.level)
    }
};

const selectorInfoCreator = (options, textLength = false) => {
    let textConcat = `${options.reduce((acc, i) => {
        acc = acc + `${i.innerText}` + `${options.indexOf(i) === options.length-1 ? '' : ", "}`;
        
        return acc
    }, '')}`;
    if (textLength) {
        return textConcat.substr(0, parseInt(textLength)) + '...';
    }
    return textConcat
};
//+++++++++++++++++Не удалять++++++++++++++
const selectSelectedFromLevels = (optionsArr, start, higerLevel) => {

    for (let i = start+1; i < optionsArr.length; i++) {
        if (optionsArr[i].dataset.level > higerLevel && optionsArr[i].dataset.selected !== optionsArr[start].dataset.selected) {
            changeSelect(optionsArr[i]);
        } else if (optionsArr[i].dataset.level <= higerLevel) {
            return false
        }
    }
};

const selectGrupFromLevels = (optionsArrList, start, higerLevel) => {
    let optionSelectName = optionsArrList.id.replace('list-for-', '')
    let optionsArr = optionsArrList.children;

    for (let i = start+1; i < optionsArr.length; i++) {
        if (optionsArr[i].dataset.level > higerLevel) {
            optionsArr[start].dataset.parent = `${optionsArr[start].dataset.optionvalue}-${optionSelectName}`;
            createChild(optionsArr[i], optionsArr[start].dataset.optionvalue);
        } else {
            return false
        }
    }
    addClass();
};

function addClass() {
    let arr = [...document.querySelectorAll('.option-list-item-text')];

    arr.forEach(el => {
        if (!el.parentElement.dataset.parent) {el.classList.remove('option-list-item-text')}
    })
}

const createChild = (fakeSelector, parentName) => {
    fakeSelector.dataset.child = `${parentName}-${fakeSelector.parentElement.id.replace('list-for-', '')}`;
}




const getSelectedOptionsArr = (select, keyForOption = false, keyForSelect = false) => {
    let selectOptionsArr = [...select.options];
    let selectedOptions = [];

    selectOptionsArr.map( option => {
            if (option.selected) {
                keyForOption ? selectedOptions.push(option[keyForOption]) : selectedOptions.push(option)
            }
        }
    );

    return keyForSelect ? selectedOptions[keyForSelect] : selectedOptions;
};

const changeCounter = (count, counter) => {
    counter.innerText = count;
}

const changeText = (text, textArea) => {
    textArea.innerText = text;
}
const changeTitle = (text, textArea) => {
    textArea.setAttribute('title', text);
}

function sendSelectedOptions(event) {
    let select = document.querySelector(`[name=${event.target.dataset.btnto}]`)

    let selectedOptArr = getSelectedOptionsArr(select);
    console.log(selectedOptArr)
}

function clearSelectedOptions(event) {
    let select = document.querySelector(`[name=${event.target.dataset.btnto}]`);
    let selectOptionsArr = select.options;
    let fakeSelect = document.getElementById(`list-for-${event.target.dataset.btnto}`);
    let fakeSelectOptionsArr = fakeSelect.children;

    for (let i = 0; i < selectOptionsArr.length; i++) {
        if (selectOptionsArr[i].selected) {selectOptionsArr[i].removeAttribute('selected')};
        if (fakeSelectOptionsArr[i].dataset.selected === 'true') {fakeSelectOptionsArr[i].dataset.selected = 'false'; fakeSelectOptionsArr[i].children[0].innerHTML = "&#8226;"}
    }

}

function closeChild(event) {
    let parentName = event.target.parentElement.dataset.parent;
    event.target.classList.add('close-child');
    addClassChildFun(parentName)
    event.target.removeEventListener('click', closeChild);
    event.target.addEventListener('click', openChild)
}

function openChild(event) {
    let parentName = event.target.parentElement.dataset.parent;
    event.target.classList.remove('close-child');
    removeClassChildFun(parentName)
    event.target.removeEventListener('click', openChild);
    event.target.addEventListener('click', closeChild)
}
function addClassChildFun(parentName) {
    let children = [...document.querySelectorAll(`[data-child="${parentName}"]`)]

    for (let i = 0; i < children.length; i++) {
        children[i].classList.add('close')
        addClassChildFun(children[i].dataset.parent)
    }
}

function removeClassChildFun(parentName) {
    let children = [...document.querySelectorAll(`[data-child="${parentName}"]`)]

    for (let i = 0; i < children.length; i++) {
        children[i].classList.remove('close')
        removeClassChildFun(children[i].dataset.parent)
    }
}

function fakeSelectClick(event) {
    let fakeSelect = event.target;
    let parentForList = event.target.parentElement;
    let parentForListId = parentForList.id.replace('list-for-', '');
    if (parentForListId === "") {
        fakeSelect = event.target.parentElement;
        parentForList = event.target.parentElement;
        parentForListId = parentForList.parentElement.id.replace('list-for-', '')
    }
    let selectForList = document.querySelector(`[name=${parentForListId}]`);
    changeSelect(fakeSelect)
    fireEvent(selectForList,'change');
}

function changeSelect(fakeSelect) {
    let fakeSelectDataset = fakeSelect.dataset;
    let parentForListId = fakeSelect.parentElement.id.replace('list-for-', '');
    let selectForList = document.querySelector(`[name=${parentForListId}]`);
    let fakeBefore = document.querySelector(`[data-fakebefore=${parentForListId}-${fakeSelectDataset.optionvalue}]`);

    if (fakeSelectDataset.selected === "true") {
        fakeSelectDataset.selected = "false"
        fakeBefore.innerHTML = "&#8226;"
    } else {
        fakeSelectDataset.selected = "true"
        fakeBefore.innerHTML = "&#10003;"
    }
    for (let i = 0; i < selectForList.options.length; i++) {
        if (selectForList.options[i].value === fakeSelectDataset.optionvalue) {
            fakeSelectDataset.selected === "true" ? selectForList.options[i].setAttribute('selected', '') : selectForList.options[i].removeAttribute('selected');
            // fireEvent(selectForList,'change');
        }
    }

    let selectedOptionArr = getSelectedOptionsArr(selectForList);
    changeCounter(selectedOptionArr.length, document.getElementById(`counter-${selectForList.getAttribute('name')}`));
    changeText(selectorInfoCreator(selectedOptionArr, 75), document.getElementById(`info-tag-${selectForList.getAttribute('name')}`));
    changeTitle(selectorInfoCreator(selectedOptionArr, false), document.getElementById(`info-tag-${selectForList.getAttribute('name')}`));
    //++++++++++Важная строчка 1+++++++++++++
    selectSelectedFromLevels([...fakeSelect.parentElement.children], [...fakeSelect.parentElement.children].indexOf(fakeSelect), fakeSelectDataset.level)


}

function showOptionsList (event) {
    let parent =  event.target;
    let parentDataSet = parent.dataset;
    if (parentDataSet.parentrole === 'main') {
        parentDataSet.show === 'active' ? parentDataSet.show = 'disable': parentDataSet.show = 'active';
        parentDataSet.show === 'active' ? parent.innerHTML = parent.innerHTML.replace('Показать', 'Скрыть') : parent.innerHTML = parent.innerHTML.replace('Скрыть', 'Показать')
    } else {
        let parents = [...document.querySelectorAll(`[data-parent=${parentDataSet.parent}]`)];
        const mainParent = parents => {
            for (let i = 0; i < parents.length; i++) {
                if (parents[i].dataset.parentrole === 'main') {
                    return parents[i]
                }
            }
        }
       
        parentDataSet = mainParent(parents).dataset;
        parentDataSet.show === 'active' ? parentDataSet.show = 'disable': parentDataSet.show = 'active';
        parentDataSet.show === 'active' ? mainParent(parents).innerHTML = mainParent(parents).innerHTML.replace('Показать', 'Скрыть') : mainParent(parents).innerHTML = mainParent(parents).innerHTML.replace('Скрыть', 'Показать')
    }
    let child = document.querySelector(`[data-child="${parentDataSet.parent}"]`);
    child.classList.toggle('active')
}


function fireEvent(element,event){
    if (document.createEventObject){
        // dispatch for IE
        var evt = document.createEventObject();
        return element.fireEvent('on'+event,evt)
    }
    else{
        // dispatch for firefox + others
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true ); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
    }
}

customSelect();




