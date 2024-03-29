let isUpdate = false;
let employeePayRollObj = {};

window.addEventListener('DOMContentLoaded',(event) => {
    const name = document.querySelector('#name');
    name.addEventListener('input',function(){
        if (!name.value || name.value == null || name.value == "" || name.value.length == 0) {
            setTextValue('.text-error',"");
            return;
        }
        try {
            checkName(name.value);
            setTextValue('.text-error',"");
        } catch (e) {
            setTextValue('.text-error',e);
        }
    });

    const date = document.querySelector('#date');
    if(date){
        date.addEventListener('input',function() {
            let startDate = getInputValueById('#day') + getInputValueById('#month') + 
                getInputValueById('#year');
            try {
                checkStartDate(new Date(Date.parse(startDate)));
                setTextValue('.date-error',"");
            } catch (e) {
                setTextValue('.date-error',e);
            }
        });
    }

    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-output');
    output.textContent = salary.value;
    salary.addEventListener('input',function(){
        output.textContent = salary.value;
    });

    checkForUpdate();
});

const save = (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
        setEmployeePayRollObject();
        if (site_properties.use_local_storage.match("true")) {
            createAndUpdateStorage();
            resetForm();
            window.location.replace(site_properties.home_page);
        } else{
            createOrUpdateEmployeePayroll();
        }
        
    } catch (e) {
        return;
    }
}

const createOrUpdateEmployeePayroll = () => {
    let postURL = site_properties.server_url;
    let methodCall = "POST";
    if (isUpdate) {
        methodCall = "PUT";
        postURL = postURL + employeePayRollObj.id.toString();
    }
    makeServiceCall(methodCall, postURL, true, employeePayRollObj)
        .then(responseText => {
            resetForm();
            window.location.replace(site_properties.home_page);
        })
        .catch(error => {
            throw error;
        });
}

const setEmployeePayRollObject = () => {
    if (!isUpdate && site_properties.use_local_storage.match("true")) {
        employeePayRollObj.id = createNewEmployeeId();
    }

    employeePayRollObj._name = getInputValueById('#name');
    employeePayRollObj._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayRollObj._gender = getSelectedValues('[name=gender]').pop();
    employeePayRollObj._department = getSelectedValues('[name=department]');
    employeePayRollObj._salary = getInputValueById('#salary');
    employeePayRollObj._note = getInputValueById('#note');
    let date = getInputValueById('#day') + " " + getInputValueById('#month') + 
                " " + getInputValueById('#year');
    employeePayRollObj._startDate = date;
}

const createEmployeePayroll = () => {
    let employeePayRollData = new EmployeePayRollData();
    try {
        employeePayRollData.name = getInputValueById('#name');
    } catch (e) {
        setTextValue('.text-error',e);
        throw e;
    }
    employeePayRollData.id = new Date().getTime();
    employeePayRollData.profilePic = getSelectedValues('[name=profile]').pop();
    employeePayRollData.gender = getSelectedValues('[name=gender]').pop();
    employeePayRollData.department = getSelectedValues('[name=department]');
    employeePayRollData.salary = getInputValueById('#salary');
    employeePayRollData.note = getInputValueById('#note');
    let date = getInputValueById('#day') + " " + getInputValueById('#month') + " " + getInputValueById('#year');
    employeePayRollData.startDate = new Date(date);
    alert(employeePayRollData.toString());
    return employeePayRollData;
}

const createNewEmployeeId = () =>{
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID",empID);
    return empID;
}

const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let selItems = [];
    allItems.forEach(item => {
        if(item.checked) selItems.push(item.value);
    });
    return selItems;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

function createAndUpdateStorage() {
    let employeePayRollList = JSON.parse(localStorage.getItem("EmployeePayRollList"));

    if (employeePayRollList) {
        let empPayRollData = employeePayRollList.
                                    find(empData => empData.id == employeePayRollObj.id);
        if (!empPayRollData) {
            employeePayRollList.push(employeePayRollObj);
        } else {
            const index = employeePayRollList
                            .map(empData => empData.id)
                                .indexOf(empPayRollData.id);
            employeePayRollList.splice(index,1,employeePayRollObj);
        }
    } else {
        employeePayRollList = [employeePayRollObj];
    }
    alert(employeePayRollList.toString());
    localStorage.setItem("EmployeePayRollList",JSON.stringify(employeePayRollList));
}

const resetForm = () => {
    setValue('#name','');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary','');
    setValue('#note','');
    setSelectedIndex('#day',0);
    setSelectedIndex('#month',0);
    setSelectedIndex('#year',0);
}

const setSelectedIndex = (id, index) => {
    const element = document.querySelector(id);
    element.selectedIndex = index;
}

const unsetSelectedValues = (propertyValue) =>{
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked  = false;
    });
}

const setTextValue = (id,value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}

const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value  = value;
}

const checkForUpdate = () => {
    const employeePayRollJSON = localStorage.getItem('editEmp');
    isUpdate = employeePayRollJSON ? true : false;
    if(!isUpdate) return;
    employeePayRollObj = JSON.parse(employeePayRollJSON);
    setForm();
}

const setForm = () => {
    setValue('#name', employeePayRollObj._name);
    setSelectedValues('[name=profile]',employeePayRollObj._profilePic);
    setSelectedValues('[name=gender]',employeePayRollObj._gender);
    setSelectedValues('[name=department]',employeePayRollObj._department);
    setValue('#salary',employeePayRollObj._salary);
    setTextValue('.salary-output',employeePayRollObj._salary);
    setValue('#note',employeePayRollObj._note);
    let date = stringyfydate(employeePayRollObj._startDate).split(" ");
    setValue('#day',date[0]);
    setValue('#month',date[1]);
    setValue('#year',date[2]);
}

const setSelectedValues = (propertyValue, value) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach( item => {
        if(Array.isArray(value)){
            if(value.includes(item.value)){
                item.checked = true;
            }
        }else if(item.value === value){
            item.checked = true;
        }
    });
}