let empPayRollList;
window.addEventListener('DOMContentLoaded',(event) =>{
    if (site_properties.use_local_storage.match("true")) {
        getEmployeePayRollDataFromStorage();
    }else {
        getEmployeePayRollDataFromServer(); 
    }
});

const getEmployeePayRollDataFromStorage = () =>{
    empPayRollList =  localStorage.getItem('EmployeePayRollList') ? JSON.parse(localStorage.getItem('EmployeePayRollList')) : [];
    processEmployeePayrollDataResponse();
}

const processEmployeePayrollDataResponse = () => {
    document.querySelector('.emp-count').textContent = empPayRollList.length;
    createInnerHTML();
    localStorage.removeItem('.editEmp');
}

const getEmployeePayRollDataFromServer = () => {
    makeServiceCall("GET", site_properties.server_url, true)
        .then(responseText => {
            empPayRollList = JSON.parse(responseText);
            processEmployeePayrollDataResponse();
        })
        .catch(error => {
            console.log("Get error status: " + JSON.stringify(error));
            empPayRollList = [];
            processEmployeePayrollDataResponse();
        });
};

const createInnerHTML = () => {
    const headerHtml = `
    <tr>
        <th></th>
        <th>Name</th>
        <th>Gender</th>
        <th>Department</th>
        <th>Salary</th>
        <th>Start Date</th>
        <th>Actions</th>
    </tr>`;
    if(empPayRollList.length == 0) return;
    let innerHtml = `${headerHtml}`;
    for (const empPayRollData of empPayRollList)
    {
        innerHtml = `${innerHtml}
        <tr>
            <td><img class="profile" src="${empPayRollData._profilePic}" alt="profile pic"></td>
            <td>${empPayRollData._name}</td>
            <td>${empPayRollData._gender}</td>
            <td>${getDepHtml(empPayRollData._department)}</td>
            <td>${empPayRollData._salary}</td>
            <td>${stringyfydate(empPayRollData._startDate)}</td>
            <td>
                <span id="${empPayRollData.id}" class="fa fa-trash" id="1" onclick="remove(this)"></span>
                <span id="${empPayRollData.id}" class="fa fa-pencil" id="2" onclick="update(this)"></span>
            </td>
        </tr>
        `;
    }
    
    document.querySelector('#table-display').innerHTML = innerHtml;
}

const getDepHtml = (deptlist) => {
    let deptHtml = ''
    for (const dept of deptlist) {
        deptHtml = `${deptHtml}<div class="dept-label">${dept}</div>`;
    }
    return deptHtml;
}

const remove = (node) => {
    let empPayRollData = empPayRollList.find(empData => empData.id == node.id);
    if(!empPayRollData) return;
    const index = empPayRollList.map(empData => empData.id).indexOf(empPayRollData.id);
    empPayRollList.splice(index,1);
    if (site_properties.use_local_storage.match("true")) {
        localStorage.setItem('EmployeePayRollList',JSON.stringify(empPayRollList));
        document.querySelector('.emp-count').textContent = empPayRollList.length;
        createInnerHTML();
    }else {
        const deleteURL = site_properties.server_url + empPayRollData.id.toString();
        makeServiceCall("DELETE", deleteURL, true)
        .then(responseText => {
            document.querySelector('.emp-count').textContent = empPayRollList.length;
            createInnerHTML();
        })
        .catch(error => {
            console.log("DELETE Error status: " + JSON.stringify(error));
        });
    }
    
}

const update = (node) => {
    let empPayRollData = empPayRollList.find(empData => empData.id == node.id);
    if(!empPayRollData) return;
    localStorage.setItem('editEmp',JSON.stringify(empPayRollData));
    window.location.replace(site_properties.add_emp_payroll_page);
}