// ===================================
// نظام تحليل عقود الاعتماد الأكاديمي
// JavaScript Main File
// ===================================

// Global Variables
let allContracts = [];
let currentFilters = {
    university: 'all',
    department: 'all',
    progress: 'all',
    degree: 'all'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('تهيئة النظام...');
    
    // Load data
    if (typeof contractsData !== 'undefined') {
        allContracts = contractsData;
        console.log(`تم تحميل ${allContracts.length} عقد`);
        
        // Initialize all components
        initializeTabs();
        initializeFilters();
        loadDashboard();
        loadContractsStatus();
        loadUniversities();
        loadSpecializations();
        loadDepartments();
        loadExpiryData();
        initializeDateSearch();
        initializeModal();
        
        // Update header stats
        updateHeaderStats();
    } else {
        console.error('فشل تحميل البيانات');
        alert('حدث خطأ في تحميل البيانات. يرجى التحقق من ملف data.js');
    }
});

// ===== Tab Navigation =====
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to selected
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// ===== Update Header Stats =====
function updateHeaderStats() {
    const uniqueUniversities = [...new Set(allContracts.map(c => c.university))].length;
    const uniquePrograms = [...new Set(allContracts.map(c => c.program))].length;
    
    document.getElementById('total-universities').textContent = uniqueUniversities;
    document.getElementById('total-programs').textContent = uniquePrograms;
}

// ===== Dashboard =====
function loadDashboard() {
    console.log('تحميل لوحة التحكم...');
    
    // Calculate stats
    const stats = {
        total: allContracts.length,
        completed: allContracts.filter(c => c.progress === '90%').length,
        inProgress: allContracts.filter(c => 
            c.progress && c.progress !== '0%' && c.progress !== '90%'
        ).length,
        delayed: allContracts.filter(c => 
            c.docReceiveStatus === 'تم التسليم متأخر' || 
            c.updateDocStatus === 'تم التسليم متأخر'
        ).length
    };
    
    // Update dashboard stats
    document.getElementById('dash-total-contracts').textContent = stats.total;
    document.getElementById('dash-completed-contracts').textContent = stats.completed;
    document.getElementById('dash-inprogress-contracts').textContent = stats.inProgress;
    document.getElementById('dash-delayed-contracts').textContent = stats.delayed;
    
    // Load charts
    loadDegreeChart();
    loadDepartmentChart();
    loadProgressChart();
}

// ===== Charts =====
function loadDegreeChart() {
    const degrees = {};
    allContracts.forEach(c => {
        degrees[c.degree] = (degrees[c.degree] || 0) + 1;
    });
    
    const ctx = document.getElementById('degreeChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(degrees),
                datasets: [{
                    data: Object.values(degrees),
                    backgroundColor: [
                        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}

function loadDepartmentChart() {
    const departments = {};
    allContracts.forEach(c => {
        const dept = c.department || 'غير محدد';
        departments[dept] = (departments[dept] || 0) + 1;
    });
    
    const ctx = document.getElementById('departmentChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(departments).map(d => d.split(' ').slice(-2).join(' ')),
                datasets: [{
                    label: 'عدد العقود',
                    data: Object.values(departments),
                    backgroundColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

function loadProgressChart() {
    const progress = { '0%': 0, '5%': 0, '30%': 0, '40%': 0, '90%': 0 };
    allContracts.forEach(c => {
        const p = c.progress || '0%';
        if (progress.hasOwnProperty(p)) {
            progress[p]++;
        }
    });
    
    const ctx = document.getElementById('progressChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(progress),
                datasets: [{
                    label: 'عدد العقود',
                    data: Object.values(progress),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

// ===== Contracts Status =====
function loadContractsStatus() {
    console.log('تحميل حالة العقود...');
    
    const categories = ['0', '5', '30', '40', '90'];
    
    categories.forEach(cat => {
        const filtered = allContracts.filter(c => {
            const progress = (c.progress || '0%').replace('%', '');
            return progress === cat;
        });
        
        const container = document.getElementById(`contracts-${cat}`);
        const countBadge = document.getElementById(`count-${cat}`);
        
        if (countBadge) countBadge.textContent = filtered.length;
        
        if (container) {
            container.innerHTML = filtered.map(contract => 
                createContractCard(contract)
            ).join('');
        }
    });
    
    // Add click handlers for category headers
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('expanded');
        });
    });
    
    // Initialize filters
    const progressFilter = document.getElementById('progress-filter');
    const statusSearch = document.getElementById('status-search');
    
    if (progressFilter) {
        progressFilter.addEventListener('change', filterContractsStatus);
    }
    
    if (statusSearch) {
        statusSearch.addEventListener('input', filterContractsStatus);
    }
}

function filterContractsStatus() {
    const progressValue = document.getElementById('progress-filter').value;
    const searchValue = document.getElementById('status-search').value.toLowerCase();
    
    const categories = ['0', '5', '30', '40', '90'];
    
    categories.forEach(cat => {
        const container = document.getElementById(`contracts-${cat}`);
        const categoryDiv = container.closest('.status-category');
        
        if (progressValue !== 'all' && progressValue !== cat) {
            categoryDiv.style.display = 'none';
            return;
        }
        
        categoryDiv.style.display = 'block';
        
        const filtered = allContracts.filter(c => {
            const progress = (c.progress || '0%').replace('%', '');
            if (progress !== cat) return false;
            
            if (searchValue) {
                const searchableText = `${c.university} ${c.program} ${c.department}`.toLowerCase();
                return searchableText.includes(searchValue);
            }
            
            return true;
        });
        
        container.innerHTML = filtered.map(contract => 
            createContractCard(contract)
        ).join('');
    });
}

// ===== Universities =====
function loadUniversities() {
    console.log('تحميل الجامعات...');
    
    const universitiesMap = {};
    
    allContracts.forEach(contract => {
        const uni = contract.university;
        if (!universitiesMap[uni]) {
            universitiesMap[uni] = {
                name: uni,
                contracts: [],
                departments: new Set(),
                degrees: {}
            };
        }
        
        universitiesMap[uni].contracts.push(contract);
        universitiesMap[uni].departments.add(contract.department);
        
        const degree = contract.degree;
        universitiesMap[uni].degrees[degree] = (universitiesMap[uni].degrees[degree] || 0) + 1;
    });
    
    const universities = Object.values(universitiesMap);
    displayUniversities(universities);
    
    // Initialize sort and search
    const sortSelect = document.getElementById('university-sort');
    const searchInput = document.getElementById('university-search');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => displayUniversities(universities));
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', () => displayUniversities(universities));
    }
}

function displayUniversities(universities) {
    const sortValue = document.getElementById('university-sort')?.value || 'contracts-desc';
    const searchValue = document.getElementById('university-search')?.value.toLowerCase() || '';
    
    // Filter
    let filtered = universities.filter(uni => 
        uni.name.toLowerCase().includes(searchValue)
    );
    
    // Sort
    filtered.sort((a, b) => {
        switch(sortValue) {
            case 'contracts-desc':
                return b.contracts.length - a.contracts.length;
            case 'contracts-asc':
                return a.contracts.length - b.contracts.length;
            case 'name-asc':
                return a.name.localeCompare(b.name, 'ar');
            case 'name-desc':
                return b.name.localeCompare(a.name, 'ar');
            default:
                return 0;
        }
    });
    
    const container = document.getElementById('universities-grid');
    if (container) {
        container.innerHTML = filtered.map(uni => createUniversityCard(uni)).join('');
        
        // Add click handlers
        container.querySelectorAll('.view-contracts-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const uniName = e.target.closest('.university-card').dataset.university;
                showUniversityContracts(uniName);
            });
        });
    }
}

function createUniversityCard(university) {
    return `
        <div class="university-card" data-university="${university.name}">
            <div class="university-header">
                <i class="fas fa-university university-icon"></i>
                <h3 class="university-name">${university.name}</h3>
            </div>
            <div class="university-body">
                <div class="university-stats">
                    <div class="uni-stat">
                        <span class="uni-stat-number">${university.contracts.length}</span>
                        <span class="uni-stat-label">عقد</span>
                    </div>
                    <div class="uni-stat">
                        <span class="uni-stat-number">${university.departments.size}</span>
                        <span class="uni-stat-label">إدارة</span>
                    </div>
                    <div class="uni-stat">
                        <span class="uni-stat-number">${Object.keys(university.degrees).length}</span>
                        <span class="uni-stat-label">درجة علمية</span>
                    </div>
                </div>
            </div>
            <div class="university-footer">
                <button class="view-contracts-btn">
                    <i class="fas fa-eye"></i> عرض العقود
                </button>
            </div>
        </div>
    `;
}

function showUniversityContracts(universityName) {
    const contracts = allContracts.filter(c => c.university === universityName);
    const modal = document.getElementById('contract-modal');
    const detailsDiv = document.getElementById('contract-details');
    
    const html = `
        <div class="contract-details-header">
            <h2><i class="fas fa-university"></i> ${universityName}</h2>
            <p>إجمالي العقود: ${contracts.length}</p>
        </div>
        <div class="details-section">
            <h3><i class="fas fa-list"></i> قائمة العقود</h3>
            ${contracts.map(contract => createContractCard(contract)).join('')}
        </div>
    `;
    
    detailsDiv.innerHTML = html;
    modal.classList.add('active');
}

// ===== Specializations =====
function loadSpecializations() {
    console.log('تحميل التخصصات...');
    
    const categories = {
        engineering: [],
        health: [],
        humanities: [],
        islamic: [],
        scientific: []
    };
    
    allContracts.forEach(contract => {
        const dept = contract.department;
        
        if (dept.includes('الهندسية') || dept.includes('الحاسب')) {
            categories.engineering.push(contract);
        } else if (dept.includes('الصحية')) {
            categories.health.push(contract);
        } else if (dept.includes('الإنسانية') || dept.includes('التربوية')) {
            categories.humanities.push(contract);
        } else if (dept.includes('الإسلامية') || dept.includes('العربية')) {
            categories.islamic.push(contract);
        } else if (dept.includes('العلمية')) {
            categories.scientific.push(contract);
        }
    });
    
    // Update counts
    Object.keys(categories).forEach(key => {
        const countEl = document.getElementById(`count-${key}`);
        if (countEl) countEl.textContent = categories[key].length;
        
        const container = document.getElementById(`spec-${key}`);
        if (container) {
            const programs = groupByProgram(categories[key]);
            container.innerHTML = Object.entries(programs).map(([program, contracts]) => `
                <div class="program-item ${key}" data-program="${program}">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span><strong>${program}</strong></span>
                        <span style="background: rgba(0,0,0,0.1); padding: 4px 12px; border-radius: 12px;">
                            ${contracts.length} عقد
                        </span>
                    </div>
                </div>
            `).join('');
        }
    });
    
    // Add click handlers
    document.querySelectorAll('.spec-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('expanded');
        });
    });
    
    document.querySelectorAll('.program-item').forEach(item => {
        item.addEventListener('click', () => {
            const program = item.dataset.program;
            showProgramContracts(program);
        });
    });
}

function groupByProgram(contracts) {
    const programs = {};
    contracts.forEach(contract => {
        const program = contract.program;
        if (!programs[program]) {
            programs[program] = [];
        }
        programs[program].push(contract);
    });
    return programs;
}

function showProgramContracts(programName) {
    const contracts = allContracts.filter(c => c.program === programName);
    const modal = document.getElementById('contract-modal');
    const detailsDiv = document.getElementById('contract-details');
    
    const html = `
        <div class="contract-details-header">
            <h2><i class="fas fa-graduation-cap"></i> ${programName}</h2>
            <p>عدد العقود: ${contracts.length}</p>
        </div>
        <div class="details-section">
            <h3><i class="fas fa-list"></i> العقود</h3>
            ${contracts.map(contract => createContractCard(contract)).join('')}
        </div>
    `;
    
    detailsDiv.innerHTML = html;
    modal.classList.add('active');
}

// ===== Departments =====
function loadDepartments() {
    console.log('تحميل الإدارات...');
    
    const departments = {
        'إدارة برامج العلوم الإنسانية والتربوية': 'humanities',
        'إدارة برامج العلوم الهندسية وعلوم الحاسب': 'engineering',
        'إدارة برامج العلوم الصحية': 'health',
        'إدارة برامج العلوم الإسلامية والعربية': 'islamic',
        'إدارة برامج التخصصات العلمية': 'scientific'
    };
    
    Object.entries(departments).forEach(([deptName, key]) => {
        const contracts = allContracts.filter(c => c.department === deptName);
        
        const countEl = document.getElementById(`dept-${key}-count`);
        if (countEl) countEl.textContent = contracts.length;
        
        const btn = document.querySelector(`[data-dept="${deptName}"]`);
        if (btn) {
            btn.addEventListener('click', () => {
                const container = document.getElementById(`dept-${key}-contracts`);
                container.classList.toggle('visible');
                
                if (container.classList.contains('visible')) {
                    container.innerHTML = contracts.map(c => createContractCard(c)).join('');
                    btn.innerHTML = '<i class="fas fa-eye-slash"></i> إخفاء العقود';
                } else {
                    btn.innerHTML = '<i class="fas fa-eye"></i> عرض العقود';
                }
            });
        }
    });
}

// ===== Date Search =====
function initializeDateSearch() {
    const searchBtn = document.getElementById('search-date-btn');
    const datePicker = document.getElementById('date-picker');
    
    if (searchBtn && datePicker) {
        searchBtn.addEventListener('click', () => {
            const selectedDate = datePicker.value;
            if (selectedDate) {
                searchByDate(selectedDate);
            }
        });
    }
    
    // Quick date buttons
    document.querySelectorAll('.quick-date-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const dateType = btn.dataset.date;
            const date = getQuickDate(dateType);
            if (date) {
                datePicker.value = date;
                searchByDate(date);
            }
        });
    });
}

function getQuickDate(type) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch(type) {
        case 'today':
            return formatDate(today);
        case 'week':
            const week = new Date(today);
            week.setDate(week.getDate() + 7);
            return formatDate(week);
        case 'month':
            const month = new Date(today);
            month.setMonth(month.getMonth() + 1);
            return formatDate(month);
        default:
            return null;
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function searchByDate(dateString) {
    const resultsContainer = document.getElementById('date-results');
    
    // Find contracts matching date in any date field
    const matches = allContracts.filter(contract => {
        const dates = [
            contract.docReceiveDate,
            contract.updateDocDate,
            contract.verifyVisitSchedule,
            contract.reviewerVisitSchedule,
            contract.startDate,
            contract.endDate
        ];
        
        return dates.some(d => d && d.includes(dateString.split('-').reverse().join('/')));
    });
    
    if (matches.length > 0) {
        resultsContainer.innerHTML = `
            <div class="page-header">
                <h3><i class="fas fa-calendar-check"></i> النتائج: ${matches.length} عقد</h3>
                <p>التاريخ: ${dateString}</p>
            </div>
            ${matches.map(c => createContractCard(c)).join('')}
        `;
    } else {
        resultsContainer.innerHTML = `
            <div class="page-header">
                <h3><i class="fas fa-info-circle"></i> لا توجد عقود في هذا التاريخ</h3>
            </div>
        `;
    }
}

// ===== Expiry Data =====
function loadExpiryData() {
    console.log('تحميل بيانات انتهاء العقود...');
    
    const categories = {
        '2024': [],
        '2025-h1': [],
        '2025-h2': [],
        '2026': []
    };
    
    allContracts.forEach(contract => {
        const endDate = parseArabicDate(contract.endDate);
        if (!endDate) return;
        
        const year = endDate.getFullYear();
        const month = endDate.getMonth() + 1;
        
        if (year <= 2024) {
            categories['2024'].push(contract);
        } else if (year === 2025 && month <= 6) {
            categories['2025-h1'].push(contract);
        } else if (year === 2025 && month > 6) {
            categories['2025-h2'].push(contract);
        } else if (year >= 2026) {
            categories['2026'].push(contract);
        }
    });
    
    // Update counts and display
    Object.entries(categories).forEach(([key, contracts]) => {
        const countEl = document.getElementById(`expiry-${key}`);
        if (countEl) countEl.textContent = contracts.length;
        
        const container = document.getElementById(`contracts-expiry-${key}`);
        if (container) {
            container.innerHTML = contracts
                .sort((a, b) => {
                    const dateA = parseArabicDate(a.endDate);
                    const dateB = parseArabicDate(b.endDate);
                    return dateA - dateB;
                })
                .map(c => createContractCard(c))
                .join('');
        }
    });
    
    // Add click handlers
    document.querySelectorAll('.expiry-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('expanded');
        });
    });
}

function parseArabicDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    
    const month = parseInt(parts[0]);
    const day = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    
    return new Date(year, month - 1, day);
}

// ===== Contract Card =====
function createContractCard(contract) {
    const isDelayed = contract.docReceiveStatus === 'تم التسليم متأخر' || 
                     contract.updateDocStatus === 'تم التسليم متأخر';
    
    return `
        <div class="contract-card" onclick="showContractDetails('${contract.id}')">
            <div class="contract-title">
                ${contract.program} - ${contract.degree}
            </div>
            <div class="contract-meta">
                <div class="meta-item">
                    <i class="fas fa-university"></i>
                    <span>${contract.university}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-tasks"></i>
                    <span>${contract.progress || '0%'}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>${contract.startDate} - ${contract.endDate}</span>
                </div>
                ${isDelayed ? '<span class="contract-status status-delayed">متأخر</span>' : ''}
            </div>
        </div>
    `;
}

// ===== Modal Functions =====
function initializeModal() {
    const modal = document.getElementById('contract-modal');
    const closeBtn = modal.querySelector('.modal-close');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function showContractDetails(contractId) {
    const contract = allContracts.find(c => c.id === contractId);
    if (!contract) return;
    
    const modal = document.getElementById('contract-modal');
    const detailsDiv = document.getElementById('contract-details');
    
    const html = `
        <div class="contract-details-header">
            <h2>${contract.program}</h2>
            <p>${contract.university} - ${contract.degree}</p>
        </div>
        
        <div class="details-section">
            <h3><i class="fas fa-info-circle"></i> معلومات أساسية</h3>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">الجامعة / الكلية</span>
                    <span class="detail-value">${contract.university}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">التخصص</span>
                    <span class="detail-value">${contract.program}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">الدرجة العلمية</span>
                    <span class="detail-value">${contract.degree}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">الإدارة المختصة</span>
                    <span class="detail-value">${contract.department}</span>
                </div>
            </div>
        </div>
        
        <div class="details-section">
            <h3><i class="fas fa-calendar-alt"></i> تواريخ العقد</h3>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">بداية سريان العقد</span>
                    <span class="detail-value">${contract.startDate}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">انتهاء سريان العقد</span>
                    <span class="detail-value">${contract.endDate}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">حالة العقد</span>
                    <span class="detail-value">${contract.status}</span>
                </div>
            </div>
        </div>
        
        <div class="details-section">
            <h3><i class="fas fa-tasks"></i> حالة الإنجاز</h3>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">نسبة الإنجاز</span>
                    <span class="detail-value">${contract.progress || '0%'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">حالة استلام الوثائق</span>
                    <span class="detail-value">${contract.docReceiveStatus}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">تاريخ استلام الوثائق</span>
                    <span class="detail-value">${contract.docReceiveDate || 'لم يتم التسليم'}</span>
                </div>
            </div>
        </div>
        
        <div class="details-section">
            <h3><i class="fas fa-calendar-check"></i> جدولة الزيارات</h3>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">التاريخ المجدول لزيارة التحقق</span>
                    <span class="detail-value">${contract.verifyVisitSchedule || 'لم يتم جدولة الزيارة'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">التاريخ المجدول لزيارة المراجعين</span>
                    <span class="detail-value">${contract.reviewerVisitSchedule || 'لم يتم جدولة الزيارة'}</span>
                </div>
            </div>
        </div>
    `;
    
    detailsDiv.innerHTML = html;
    modal.classList.add('active');
}

// ===== Initialize Filters =====
function initializeFilters() {
    // This will be expanded based on specific filter needs
    console.log('تهيئة المرشحات...');
}

// ===== Utility Functions =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for use in other scripts
window.showContractDetails = showContractDetails;
window.showUniversityContracts = showUniversityContracts;
window.showProgramContracts = showProgramContracts;