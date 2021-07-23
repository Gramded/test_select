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
                    onclick="closeChild(event)"
                    style="margin-left: ${element.dataset.level ? element.dataset.level*20+'px' : 0}"> 
                        <div 
                        onclick="fakeSelectClick(event)"
                        style="left: ${element.dataset.level ? element.dataset.level*-20+'px' : 0}" 
                        class="fake-before" data-fakebefore="${place}-${element.value}">
                            ${element.selected ? "&#10003;" : "&#8226;"}
                        </div> 
                    ${element.label} 
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
        </div>`;

    document.body.insertAdjacentHTML('beforeend', selectorBlock);

    let fakeSelectArr = document.querySelector(`[id="list-for-${place}"]`).children;

    for (let i = 0; i < fakeSelectArr.length; i++) {
        selectGrupFromLevels(fakeSelectArr, i, fakeSelectArr[i].dataset.level)
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

const selectGroupFromLevels = (optionsArr, start, higerLevel) => {

    for (let i = start+1; i < optionsArr.length; i++) {
        if (optionsArr[i].dataset.level > higerLevel && optionsArr[i].dataset.selected !== optionsArr[start].dataset.selected) {
            chengeSelect(optionsArr[i]);
        } else if (optionsArr[i].dataset.level <= higerLevel) {
            return false
        }
    }
//    мне попадает массив аргументов и я прохожусь от того, что вызвал вниз, включая все, у которых лвл ниже
};

const selectGrupFromLevels = (optionsArr, start, higerLevel) => {

    for (let i = start+1; i < optionsArr.length; i++) {
        if (optionsArr[i].dataset.level > higerLevel) {
            optionsArr[start].dataset.parent = optionsArr[start].dataset.optionvalue;
            createChild(optionsArr[i], optionsArr[start].dataset.optionvalue);
        } else {
            return false
        }
    }
//    мне попадает массив аргументов и я прохожусь от того, что вызвал вниз, включая все, у которых лвл ниже
};


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

const chengeCounter = (count, counter) => {
    counter.innerText = count;
}

const chengeText = (text, textArea) => {
    textArea.innerText = text;
}

const createChild = (fakeSelector, parentName) => {
    fakeSelector.dataset.child = parentName;
}

function closeChild(event) {
    let parentName = event.target.dataset.parent;
    addClassChildFun(parentName)
    event.target.removeEventListener('click', closeChild);
    event.target.addEventListener('click', openChild)
}

function openChild(event) {
    let parentName = event.target.dataset.parent;
    removeClassChildFun(parentName)
    event.target.removeEventListener('click', openChild);
    event.target.addEventListener('click', closeChild)
}
function addClassChildFun(parentName) {
    let children = [...document.querySelectorAll(`[data-child="${parentName}"]`)]

    if (!children.length) {
        return false
    }

    for (let i = 0; i < children.length; i++) {
        children[i].classList.add('close')
        children[i].dataset.parent ? addClassChildFun(children[i].dataset.parent) : false
    }
}
function removeClassChildFun(parentName) {
    let children = [...document.querySelectorAll(`[data-child="${parentName}"]`)]

    if (!children.length) {
        return false
    }

    for (let i = 0; i < children.length; i++) {
        children[i].classList.remove('close')
        children[i].dataset.parent ? removeClassChildFun(children[i].dataset.parent) : false
    }
}

function fakeSelectClick(event) {
    let parentForListId = event.target.parentElement.id.replace('list-for-', '');
    let selectForList = document.querySelector(`[name=${parentForListId}]`);
    chengeSelect(event.target)
    fireEvent(selectForList,'change');
}

function chengeSelect(fakeSelect) {
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
    chengeCounter(selectedOptionArr.length, document.getElementById(`counter-${selectForList.getAttribute('name')}`));
    chengeText(selectorInfoCreator(selectedOptionArr, 75), document.getElementById(`info-tag-${selectForList.getAttribute('name')}`));

    selectGroupFromLevels([...fakeSelect.parentElement.children], [...fakeSelect.parentElement.children].indexOf(fakeSelect), fakeSelectDataset.level)


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
        console.log(mainParent(parents))
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


