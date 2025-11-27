// بيانات تجريبية للإجازات
const sampleLeaves = [
    {
        id: 1,
        requestNumber: "LM-2024-001",
        date: "2024-01-15",
        duration: "3 أيام",
        type: "مرضية",
        status: "pending",
        diagnosis: "إنفلونزا",
        doctor: "د. أحمد محمد"
    },
    {
        id: 2,
        requestNumber: "LM-2023-125",
        date: "2023-12-10",
        duration: "5 أيام",
        type: "مرضية",
        status: "approved",
        diagnosis: "جراحة بسيطة",
        doctor: "د. فاطمة علي"
    },
    {
        id: 3,
        requestNumber: "LM-2023-098",
        date: "2023-11-05",
        duration: "2 أيام",
        type: "مرضية",
        status: "rejected",
        diagnosis: "كشف طبي",
        doctor: "د. خالد سالم"
    }
];

// بيانات المستخدمين التجريبية
const users = {
    "1001": { password: "1234", name: "أحمد محمد" },
    "1002": { password: "1234", name: "فاطمة علي" }
};

// العناصر الرئيسية
const sections = {
    login: document.getElementById('loginSection'),
    dashboard: document.getElementById('dashboardSection'),
    allLeaves: document.getElementById('allLeavesSection'),
    search: document.getElementById('searchSection')
};

let currentUser = null;

// تسجيل الدخول
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const employeeId = document.getElementById('employeeId').value;
    const password = document.getElementById('password').value;
    
    if (users[employeeId] && users[employeeId].password === password) {
        currentUser = {
            id: employeeId,
            name: users[employeeId].name
        };
        
        showSection('dashboard');
        updateDashboard();
    } else {
        alert('رقم الموظف أو كلمة المرور غير صحيحة');
    }
});

// إظهار قسم معين وإخفاء الآخرين
function showSection(sectionName) {
    Object.keys(sections).forEach(key => {
        sections[key].classList.remove('active');
    });
    sections[sectionName].classList.add('active');
}

// تحديث لوحة التحكم
function updateDashboard() {
    document.getElementById('welcomeMessage').textContent = `مرحباً، ${currentUser.name}`;
    
    // أحدث إجازة
    const latestLeave = sampleLeaves[0];
    document.getElementById('requestNumber').textContent = latestLeave.requestNumber;
    document.getElementById('requestDate').textContent = latestLeave.date;
    document.getElementById('duration').textContent = latestLeave.duration;
    document.getElementById('leaveType').textContent = latestLeave.type;
    
    const statusElement = document.getElementById('currentStatus');
    statusElement.textContent = getStatusText(latestLeave.status);
    statusElement.className = `status ${latestLeave.status}`;
    
    // تحديث قائمة آخر الإجازات
    updateRecentLeaves();
}

// تحديث قائمة الإجازات الحديثة
function updateRecentLeaves() {
    const container = document.getElementById('recentLeavesList');
    container.innerHTML = '';
    
    sampleLeaves.slice(0, 3).forEach(leave => {
        const leaveItem = document.createElement('div');
        leaveItem.className = 'leave-item';
        leaveItem.innerHTML = `
            <strong>${leave.requestNumber}</strong>
            <div>${leave.date} - ${leave.duration}</div>
            <span class="status ${leave.status}">${getStatusText(leave.status)}</span>
        `;
        container.appendChild(leaveItem);
    });
}

// إظهار جميع الإجازات
function showAllLeaves() {
    showSection('allLeaves');
    updateLeavesTable();
}

// تحديث جدول الإجازات
function updateLeavesTable() {
    const tbody = document.getElementById('leavesTableBody');
    tbody.innerHTML = '';
    
    sampleLeaves.forEach(leave => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${leave.requestNumber}</td>
            <td>${leave.date}</td>
            <td>${leave.duration}</td>
            <td>${leave.type}</td>
            <td><span class="status ${leave.status}">${getStatusText(leave.status)}</span></td>
            <td>
                <button onclick="viewLeaveDetails(${leave.id})" class="btn-action">عرض</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// البحث عن إجازة
function searchLeave() {
    showSection('search');
}

// تنفيذ البحث
function performSearch(event) {
    event.preventDefault();
    
    const requestNumber = document.getElementById('searchRequestNumber').value.toLowerCase();
    const searchDate = document.getElementById('searchDate').value;
    
    const results = sampleLeaves.filter(leave => {
        const matchesNumber = !requestNumber || leave.requestNumber.toLowerCase().includes(requestNumber);
        const matchesDate = !searchDate || leave.date === searchDate;
        return matchesNumber && matchesDate;
    });
    
    displaySearchResults(results);
}

// عرض نتائج البحث
function displaySearchResults(results) {
    const container = document.getElementById('searchResults');
    
    if (results.length === 0) {
        container.innerHTML = '<p class="no-results">لا توجد نتائج مطابقة لبحثك</p>';
        return;
    }
    
    container.innerHTML = results.map(leave => `
        <div class="leave-item">
            <h4>${leave.requestNumber}</h4>
            <p><strong>التاريخ:</strong> ${leave.date}</p>
            <p><strong>المدة:</strong> ${leave.duration}</p>
            <p><strong>النوع:</strong> ${leave.type}</p>
            <p><strong>الحالة:</strong> <span class="status ${leave.status}">${getStatusText(leave.status)}</span></p>
            <p><strong>التشخيص:</strong> ${leave.diagnosis}</p>
            <p><strong>الطبيب:</strong> ${leave.doctor}</p>
        </div>
    `).join('');
}

// عرض تفاصيل الإجازة
function viewLeaveDetails(leaveId) {
    const leave = sampleLeaves.find(l => l.id === leaveId);
    if (leave) {
        alert(`
تفاصيل الإجازة:
رقم الطلب: ${leave.requestNumber}
التاريخ: ${leave.date}
المدة: ${leave.duration}
النوع: ${leave.type}
الحالة: ${getStatusText(leave.status)}
التشخيص: ${leave.diagnosis}
الطبيب: ${leave.doctor}
        `);
    }
}

// تحميل التقرير
function downloadReport() {
    alert('سيتم تحميل تقرير الإجازات... (هذه وظيفة تجريبية)');
}

// تسجيل الخروج
function logout() {
    currentUser = null;
    document.getElementById('loginForm').reset();
    showSection('login');
}

// الحصول على نص الحالة
function getStatusText(status) {
    const statusMap = {
        'pending': 'قيد المراجعة',
        'approved': 'معتمدة',
        'rejected': 'مرفوضة'
    };
    return statusMap[status] || status;
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    showSection('login');
});
