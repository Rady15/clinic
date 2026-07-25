-- إضافة بيانات تجريبية لقسم قبل وبعد
INSERT INTO "BeforeAfterCase" (
  "id", "doctorNameAr", "doctorNameEn", "treatmentAr", "treatmentEn", 
  "categoryAr", "categoryEn", "branchAr", "branchEn", "beforeImage", 
  "afterImage", "dividerPosition", "order", "isActive", "createdAt", "updatedAt"
) VALUES (
  'case1', 'د. أحمد محمد', 'Dr. Ahmed Mohamed', 'زراعة الأسنان', 'Dental Implant', 
  'الأسنان', 'Dentistry', 'الفرع الرئيسي', 'Main Branch', '/placeholder-before.jpg', 
  '/placeholder-after.jpg', 50, 1, true, '2023-01-01', '2023-01-01'
), (
  'case2', 'د. سارة علي', 'Dr. Sara Ali', 'تبييض الأسنان', 'Teeth Whitening', 
  'الأسنان', 'Dentistry', 'الفرع الفرعي', 'Branch 2', '/placeholder-before.jpg', 
  '/placeholder-after.jpg', 50, 2, true, '2023-01-02', '2023-01-02'
), (
  'case3', 'د. خالد حسن', 'Dr. Khalid Hassan', "تركيب الفم", "Dental Crown", 
  "الأسنان", "Dentistry", "الفرع الرئيسي", "Main Branch", '/placeholder-before.jpg', 
  '/placeholder-after.jpg', 50, 3, true, '2023-01-03', '2023-01-03'
);