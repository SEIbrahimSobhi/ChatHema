// الحصول على العناصر المطلوبة من الـ DOM
const typing_form = document.querySelector(".typing_form");
const chat_list = document.querySelector(".chat_list");

// تعريف مفاتيح API و URL الخاص بالطلب
const API_Key = "AIzaSyB-_SpF5-yAFq0FAIMNtikXC3d1PI2frXM";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_Key}`;

// دالة إظهار تأثير الكتابة
const showTypingEffect = (text, textElement) => {
    const words = text.split(" ");
    let currenWordIndex = 0;

    // البدء في الكتابة كلمة كلمة
    const typingInterval = setInterval(() => {
        textElement.innerText += (currenWordIndex === 0 ? "" : " ") + words[currenWordIndex++];
        if (currenWordIndex === words.length) {
            clearInterval(typingInterval); // إيقاف الكتابة عند اكتمال النص
        }
        window.scrollTo(0, chat_list.scrollHeight); // تمرير تلقائي للأسفل
    }, 50); // تسريع الكتابة بتقليل الزمن إلى 50 مللي ثانية
}

// دالة نسخ الرسالة إلى الحافظة
const copyMessage = (copy_Btn) => {
    const messageText = copy_Btn.parentElement.querySelector(".text").innerText;
    navigator.clipboard.writeText(messageText); // نسخ النص
    copy_Btn.innerText = "done"; // تغيير أيقونة النسخ إلى 'done'

    // إعادة الأيقونة بعد فترة زمنية
    setTimeout(() => copy_Btn.innerText = "content_copy", 1000);
}

// دالة إظهار الرسالة أثناء التحميل
const showLoading = () => {
    const html = `
    <div class="message">
        <div class="message_content">
            <img src="Hema2.png" alt="">
            <p class="text"></p>
            <div class="loading_indicoator">
                <div class="loading_Bar"></div>
                <div class="loading_Bar"></div>
                <div class="loading_Bar"></div>
            </div>
        </div>
        <span onClick="copyMessage(this)" class="material-symbols-outlined">
            content_copy
        </span>
    `;

    const div = document.createElement("div");
    div.classList.add("message", "incoming", "loading");
    div.innerHTML = html;
    chat_list.appendChild(div);

    return div; // إرجاع العنصر لتحريره لاحقًا
}

// دالة توليد الرد عبر API
const genrateAPIResponse = async (div) => {
    const textElement = div.querySelector(".text");

    try {
        // إرسال طلب إلى API للحصول على الرد
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: userMessage }]
                }]
            })
        });

        // معالجة الرد من API
        const data = await response.json();
        const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
        console.log(apiResponse);

        // إذا كان الرد هو "أنا نموذج لغوي كبير، تم تدريبي بواسطة جوجل."
        if (apiResponse === "أنا نموذج لغوي كبير، تم تدريبي بواسطة جوجل.") {
            const customResponse = "أنا مساعد الشخصي وتم تصميمي بواسطة إبراهيم صبحي";
            // إظهار تأثير الكتابة للرد المخصص
            showTypingEffect(customResponse, textElement);
        } else {
            // إظهار تأثير الكتابة للرد من API
            showTypingEffect(apiResponse, textElement);
        }

    } catch (error) {
        console.error("Error fetching API response:", error);
    } finally {
        div.classList.remove("loading"); // إزالة حالة التحميل
    }
}

// دالة التعامل مع الرسائل الصادرة
const handleOutGoingChat = () => {
    userMessage = document.querySelector(".typing_input").value; // الحصول على الرسالة من المدخل
    console.log(userMessage);

    if (!userMessage) return; // تجاهل الرسائل الفارغة

    const html = `
    <div class="message_content">
        <img src="ChatHema1.png" alt="">
        <p class="text"></p>
    </div>
    `;

    const div = document.createElement("div");
    div.classList.add("message", "outgoing");
    div.innerHTML = html;
    div.querySelector(".text").innerHTML = userMessage; // إضافة الرسالة الصادرة
    chat_list.appendChild(div);

    typing_form.reset(); // إعادة تعيين النموذج بعد الإرسال
    window.scrollTo(0, chat_list.scrollHeight); // تمرير الصفحة للأسفل

    // عرض شريط التحميل
    const loadingDiv = showLoading();

    // استدعاء دالة إظهار الرد من API بعد نصف ثانية
    setTimeout(() => genrateAPIResponse(loadingDiv), 500);
}

// إضافة مستمع للحدث عند إرسال النموذج
typing_form.addEventListener("submit", (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة عند الإرسال
    handleOutGoingChat(); // التعامل مع الرسالة الصادرة
});
