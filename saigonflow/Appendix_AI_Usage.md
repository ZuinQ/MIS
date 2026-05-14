# Appendix: Generative AI Usage Log
**Project:** SaigonFlow - A Unified Mobility Solution
**Team:** [Tên/MSSV của bạn và đồng đội]

This document serves as our official declaration of Generative AI usage for this MIS Final Project, in accordance with the course's academic integrity policies.

---

## AI Usage Session 1: Code generation for UI Prototype

**The Tool Used:** Gemini Advanced / AI Coding Assistant

**The Full Prompt:**
> "Tôi đang làm project môn MIS về đề tài SaigonFlow, yêu cầu thiết kế hệ thống giao diện cho người dùng (Commuter Super-App) và màn hình quản lý (Fleet Manager Dashboard). 
> 
> Yêu cầu:
> 1. Sử dụng React.js, thiết kế đẹp, màu xanh lá/xanh dương chủ đạo (phong cách bảo vệ môi trường, xe điện).
> 2. Commuter App cần có: Home Map, Booking (chọn lộ trình E-bike/Metro), Digital Wallet và AI Assistant Chatbot.
> 3. Fleet Dashboard cần có: Balanced Scorecard (Hiển thị doanh thu, uptime, CSAT), Live Map hiển thị xe, và Predictive Analytics dự báo hỏng pin hoặc nhu cầu.
> 4. Tất cả phải đạt chuẩn Tier 4 (có tính ROI, chiến lược CRM)."

**The Full Output:**
*(AI generated the full React.js component structure located in the `/src` folder, including `CommuterSuperApp.jsx`, `FleetManagerDashboard.jsx`, and the associated screen components. The code implements responsive layouts, glassmorphism design, and Recharts for the Balanced Scorecard visualization.)*

---

## AI Usage Session 2: Brainstorming Predictive Analytics (Part 3)

**The Tool Used:** ChatGPT (GPT-4)

**The Full Prompt:**
> "Tôi đang đóng vai tư vấn viên MIS. Hãy gợi ý cho tôi một mô hình phân tích dự đoán (Predictive Analytics Challenge) để dự đoán sự cố hỏng pin của xe đạp điện (E-bikes) dựa trên dữ liệu lịch sử như: độ dài chuyến đi, chu kỳ sạc, tuổi thọ xe. Mô hình này giúp tiết kiệm chi phí cho công ty như thế nào (ROI)?"

**The Full Output:**
> "Mô hình đề xuất: Random Forest Classifier hoặc Logistic Regression.
> 
> **Cách thức hoạt động:**
> - Biến mục tiêu (Target Variable): `Battery_Failure_Risk` (0: Bình thường, 1: Có nguy cơ hỏng).
> - Biến đầu vào (Features): Số lần sạc, quãng đường trung bình, biến động nhiệt độ, báo cáo bảo trì.
>
> **Lợi ích tài chính (ROI):**
> 1. Tiết kiệm chi phí thay thế khẩn cấp: Thay vì xe hỏng giữa đường phải điều xe cứu hộ (tốn nhân công + xăng), hệ thống sẽ báo xe cần bảo trì trước khi hỏng.
> 2. Giảm hoàn tiền cho khách (Refunds): Xe hỏng giữa chừng khiến khách đánh giá 1 sao và yêu cầu hoàn tiền (khoảng 25,000₫/chuyến).
> 3. Cải thiện KPI: Tăng thời gian hoạt động của xe (Fleet Uptime) từ 92% lên 98%, qua đó tăng doanh thu hàng ngày.
> 
> Bạn có thể đưa những con số ước tính này vào Balanced Scorecard ở phần Internal Operations và Financial Perspective."

---

*Declaration: All AI tools were used for brainstorming, prototyping structure, and formatting. The final business logic, strategic connections, and dataset analysis were thoroughly reviewed and adapted by our team to meet the specific requirements of the SaigonFlow case study.*
