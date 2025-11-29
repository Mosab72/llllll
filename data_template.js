// ===================================
// قالب بيانات عقود الاعتماد الأكاديمي
// استخدم هذا القالب لإضافة جميع الـ 445 عقد
// ===================================

/*
  هيكل كل عقد:
  
  {
    id: "معرف فريد",
    program: "اسم البرنامج",
    college: "الكلية",
    university: "الجامعة",
    degree: "الدرجة العلمية",
    department: "الإدارة المختصة",
    status: "حالة العقد",
    progress: "نسبة الإنجاز",
    docReceiveStatus: "حالة استلام الوثائق",
    docReceiveDate: "تاريخ استلام الوثائق",
    docReceiveConditions: "شروط استلام الوثائق",
    updateDocStatus: "حالة الوثائق المحدثة",
    updateDocDate: "تاريخ استلام الوثائق المحدثة",
    updateDocConditions: "شروط الوثائق المحدثة",
    verifyVisitSchedule: "التاريخ المجدول لزيارة التحقق",
    verifyScheduleConditions: "شروط زيارة التحقق",
    reviewerVisitSchedule: "التاريخ المجدول لزيارة المراجعين",
    reviewerScheduleConditions: "شروط زيارة المراجعين",
    startDate: "تاريخ بداية العقد",
    endDate: "تاريخ انتهاء العقد"
  }
*/

const contractsData = [
  // العقد 1
  {
    id: "001",
    program: "ماجستير، الاقتصاد",
    college: "كلية الأنظمة والاقتصاد",
    university: "الجامعة الإسلامية",
    degree: "ماجستير",
    department: "إدارة برامج العلوم الإنسانية والتربوية",
    status: "تحت الإجراء",
    progress: "40%",
    docReceiveStatus: "تم التسليم متأخر",
    docReceiveDate: "01/23/25",
    docReceiveConditions: "تم التسليم متأخر",
    updateDocStatus: "تم التسليم متأخر",
    updateDocDate: "05/15/25",
    updateDocConditions: "تم التسليم متأخر",
    verifyVisitSchedule: "05/15/25",
    verifyScheduleConditions: "تم جدولة الزيارة - متأخر",
    reviewerVisitSchedule: "01/25/26",
    reviewerScheduleConditions: "تم جدولة الزيارة - متأخر",
    startDate: "03/07/24",
    endDate: "03/06/25"
  },
  
  // العقد 2
  {
    id: "002",
    program: "ماجستير، الإعلام والاتصال",
    college: "كلية اللغة العربية والدراسات الإنسانية",
    university: "الجامعة الإسلامية",
    degree: "ماجستير",
    department: "إدارة برامج العلوم الإنسانية والتربوية",
    status: "تحت الإجراء",
    progress: "40%",
    docReceiveStatus: "تم التسليم متأخر",
    docReceiveDate: "01/23/25",
    docReceiveConditions: "تم التسليم متأخر",
    updateDocStatus: "تم التسليم متأخر",
    updateDocDate: "08/31/25",
    updateDocConditions: "تم التسليم متأخر",
    verifyVisitSchedule: "09/04/25",
    verifyScheduleConditions: "تم جدولة الزيارة - متأخر",
    reviewerVisitSchedule: "02/01/26",
    reviewerScheduleConditions: "تم جدولة الزيارة - متأخر",
    startDate: "03/07/24",
    endDate: "03/06/25"
  },
  
  // العقد 3
  {
    id: "003",
    program: "ماجستير، أصول التربية الإسلامية",
    college: "كلية اللغة العربية والدراسات الإنسانية",
    university: "الجامعة الإسلامية",
    degree: "ماجستير",
    department: "إدارة برامج العلوم الإنسانية والتربوية",
    status: "تحت الإجراء",
    progress: "40%",
    docReceiveStatus: "تم التسليم متأخر",
    docReceiveDate: "01/23/25",
    docReceiveConditions: "تم التسليم متأخر",
    updateDocStatus: "تم التسليم متأخر",
    updateDocDate: "04/13/25",
    updateDocConditions: "تم التسليم متأخر",
    verifyVisitSchedule: "04/16/25",
    verifyScheduleConditions: "تم جدولة الزيارة - متأخر",
    reviewerVisitSchedule: "11/30/25",
    reviewerScheduleConditions: "تم جدولة الزيارة - متأخر",
    startDate: "03/07/24",
    endDate: "03/06/25"
  },
  
  // أضف العقود من 4 إلى 445 هنا بنفس البنية
  // ...
  
  // مثال على عقد آخر (العقد 10)
  {
    id: "010",
    program: "ماجستير، العلوم في جودة الرعاية الصحية وسلامة المرضى",
    college: "كلية الصحة العامة",
    university: "جامعة الإمام عبد الرحمن بن فيصل",
    degree: "ماجستير",
    department: "إدارة برامج العلوم الصحية",
    status: "تحت الإجراء",
    progress: "40%",
    docReceiveStatus: "تم التسليم متأخر",
    docReceiveDate: "01/15/25",
    docReceiveConditions: "تم التسليم متأخر",
    updateDocStatus: "تم التسليم متأخر",
    updateDocDate: "06/05/25",
    updateDocConditions: "تم التسليم متأخر",
    verifyVisitSchedule: "04/28/25",
    verifyScheduleConditions: "لم تتم جدولة الزيارة",
    reviewerVisitSchedule: "",
    reviewerScheduleConditions: "",
    startDate: "06/20/24",
    endDate: "01/31/26"
  }
];

// تصدير البيانات للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
  module.exports = contractsData;
}

// معلومات إضافية للنظام
const systemInfo = {
  totalContracts: contractsData.length,
  lastUpdate: "2024-11-29",
  version: "1.0.0",
  dataStructureVersion: "1.0"
};

console.log(`✓ تم تحميل ${contractsData.length} عقد بنجاح`);