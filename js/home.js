let empPayRollList;
window.addEventListener('DOMContentLoaded',(event) =>{
    empPayRollList = getEmployeePayRollDataFromStorage();
    document.querySelector('.emp-count').textContent = empPayRollList.length;
    createInnerHTML();
    localStorage.removeItem('editEmp');
});

const getEmployeePayRollDataFromStorage = () =>{
    return localStorage.getItem('EmployeePayRollList') ? JSON.parse(localStorage.getItem('EmployeePayRollList')) : [];
}

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
                <span id="${empPayRollData._id}" class="fa fa-trash" id="1" onclick="remove(this)"></span>
                <span id="${empPayRollData._id}" class="fa fa-pencil" id="2" onclick="update(this)"></span>
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
    let empPayRollData = empPayRollList.find(empData => empData._id == node.id);
    if(!empPayRollData) return;
    const index = empPayRollList.map(empData => empData._id).indexOf(empPayRollData._id);
    empPayRollList.splice(index,1);
    localStorage.setItem('EmployeePayRollList',JSON.stringify(empPayRollList));
    document.querySelector('.emp-count').textContent = empPayRollList.length;
    createInnerHTML();
}

const update = (node) => {
    let empPayRollData = empPayRollList.find(empData => empData._id == node.id);
    if(!empPayRollData) return;
    localStorage.setItem('editEmp',JSON.stringify(empPayRollData));
    window.location.replace(site_properties.add_emp_payroll_page);
}