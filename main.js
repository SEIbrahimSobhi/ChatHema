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
    }, 75); // تسريع الكتابة بتقليل الزمن إلى 50 مللي ثانية
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
            <img src="ChatHema1.png" alt="">
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

        // تكرار الرد إذا كان "أنا نموذج لغوي كبير، تم تدريبي بواسطة جوجل." 3 مرات
        if (apiResponse === "أنا نموذج لغوي كبير، تم تدريبي بواسطة جوجل.") {
            const customResponse1 = "أنا نموذج ذكاء اصطناعي تم تطويري بواسطة إبراهيم صبحي لتقديم مساعدات ذكية وإجابات دقيقة في مختلف المجالات. مهمتي هي مساعدتك في الحصول على المعلومات والإجابات التي تحتاجها بطريقة سريعة وسهلة. إذا كنت ترغب في معرفة المزيد عني أو عن المطور، لا تتردد في الاستفسار!";
            showTypingEffect(customResponse1, textElement);
        } else if (apiResponse === "I am Gemini, a multi-modal AI model, developed by Google. I am designed to provide information and answer questions to the best of my abilities.") {
            const customResponse2 = "I am an artificial intelligence model developed by Ibrahim Sobhi to provide intelligent assistance and accurate answers in various fields. My mission is to help you get the information and answers you need in a fast and easy way. If you'd like to know more about me or the developer, feel free to ask!";
            showTypingEffect(customResponse2, textElement);
        } else if (apiResponse === "I am Gemini, a multi-modal AI model, developed by Google. My purpose is to provide information and assist users with a wide range of inquiries and discussions. I am designed to be informative, comprehensive, and helpful.") {
            const customResponse3 = "I am an artificial intelligence model developed by Ibrahim Sobhi to provide intelligent assistance and accurate answers in various fields. My mission is to help you get the information and answers you need in a fast and easy way. If you'd like to know more about me or the developer, feel free to ask!";
            showTypingEffect(customResponse3, textElement);
        } else if (apiResponse === "I am Gemini, a large multi-modal model, trained by Google. I am designed to understand and generate human language, and to answer questions and provide information to the best of my abilities. I am not a specific person, but rather a collection of algorithms and data that has been trained on a massive dataset of text and code.") {
            const customResponse4 = "I am an artificial intelligence model developed by Ibrahim Sobhi to provide intelligent assistance and accurate answers in various fields. My mission is to help you get the information and answers you need in a fast and easy way. If you'd like to know more about me or the developer, feel free to ask!";
            showTypingEffect(customResponse4, textElement);
            } else if (apiResponse === "I am Gemini, a multimodal AI language model developed by Google. I am designed to assist users with a wide range of writing and communication-based tasks.") {
            const customResponse5 = "I am an artificial intelligence model developed by Ibrahim Sobhi to provide intelligent assistance and accurate answers in various fields. My mission is to help you get the information and answers you need in a fast and easy way. If you'd like to know more about me or the developer, feel free to ask!";
            showTypingEffect(customResponse5, textElement);
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
        <img src="Hema2.png" alt="">
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

    // التحقق مما إذا كانت الرسالة تحتوي على كلمات مخصصة (10 مرات)
    if (userMessage.includes("انت خول")) {
        setTimeout(() => {
            const customResponse = "بس ي خول";
            const textElement = loadingDiv.querySelector(".text");
            showTypingEffect(customResponse, textElement);
            loadingDiv.classList.remove("loading"); // إزالة حالة التحميل
        }, 75);
    }
    else if (userMessage.includes("انت وسخ")) {
        setTimeout(() => {
            const customResponse = "أنا لست وسخ او قذير بل الذي يحدثني الأن هو الذي قذير و وسخ و ملئ بالقذاره الدجاج ";
            const textElement = loadingDiv.querySelector(".text");
            showTypingEffect(customResponse, textElement);
            loadingDiv.classList.remove("loading"); // إزالة حالة التحميل
        }, 750);
    }
    else if (userMessage.includes("متناك") || userMessage.includes("هنيكك")) {
        setTimeout(() => {
            const customResponse = "جره اي ي كسمك ي ابن المتناكه لو شوفتك هنيكك";
            const textElement = loadingDiv.querySelector(".text");
            showTypingEffect(customResponse, textElement);
            loadingDiv.classList.remove("loading"); // إزالة حالة التحميل
        }, 750);
    }
    else if (userMessage.includes("ابراهيم صبحي") || userMessage.includes("إبراهيم صبحي") || userMessage.includes("Ebrahem sobhy") || userMessage.includes("ebrahem sobhy") || userMessage.includes("ebrahem")){
        setTimeout(() => {
            const customResponse = "إبراهيم صبحي... اسم يرتبط بالقوة والغموض. خلف هذا الاسم يقف العقل الذي صمم النموذج الذكي الذي تخاطبونه الآن. طالب في الثانوية العامة؟ ربما. لكن في عالمه، لا تُقاس العظمة بالعمر أو الصفوف. إنه المبتكر الذي يُعيد تعريف حدود الذكاء الاصطناعي، ويصنع أدوات تُغير مسار التعليم. هنا، كل سطر من الأكواد هو انعكاس لرؤية تتجاوز الواقع، وطموح لا يعرف الانكسار. إبراهيم صبحي... العقل الذي يصنع المستقبل بصمت، والقوة التي تكتب تاريخًا جديدًا.";
            const textElement = loadingDiv.querySelector(".text");
            showTypingEffect(customResponse, textElement);
            loadingDiv.classList.remove("loading"); // إزالة حالة التحميل
        }, 75);
    }
    else if (userMessage.includes("who are you")) {
        setTimeout(() => {
            const customResponse = "I am an artificial intelligence model developed by Ibrahim Sobhi to provide intelligent assistance and accurate answers in various fields. My mission is to help you get the information and answers you need in a fast and easy way. If you'd like to know more about me or the developer, feel free to ask!";
            const textElement = loadingDiv.querySelector(".text");
            showTypingEffect(customResponse, textElement);
            loadingDiv.classList.remove("loading"); // إزالة حالة التحميل
        }, 75);
    }
    else if (userMessage.includes("whi are you")) {
        setTimeout(() => {
            const customResponse = "I am an artificial intelligence model developed by Ibrahim Sobhi to provide intelligent assistance and accurate answers in various fields. My mission is to help you get the information and answers you need in a fast and easy way. If you'd like to know more about me or the developer, feel free to ask!";
            const textElement = loadingDiv.querySelector(".text");
            showTypingEffect(customResponse, textElement);
            loadingDiv.classList.remove("loading"); // إزالة حالة التحميل
        }, 75);
    }
    else if (userMessage.includes("who you")) {
        setTimeout(() => {
            const customResponse = "I am an artificial intelligence model developed by Ibrahim Sobhi to provide intelligent assistance and accurate answers in various fields. My mission is to help you get the information and answers you need in a fast and easy way. If you'd like to know more about me or the developer, feel free to ask!";
            const textElement = loadingDiv.querySelector(".text");
            showTypingEffect(customResponse, textElement);
            loadingDiv.classList.remove("loading"); // إزالة حالة التحميل
        }, 75);
    }
    else if (userMessage.includes("انت حمار")) {
        setTimeout(() => {
            const customResponse = "إذا كان لديك مشكلة مع الحمار، فربما يجب عليك النظر في المرآة.";
            const textElement = loadingDiv.querySelector(".text");
            showTypingEffect(customResponse, textElement);
            loadingDiv.classList.remove("loading"); // إزالة حالة التحميل
        }, 75);
    }
    else if (userMessage.includes("معرص")) {
        setTimeout(() => {
            const customResponse = "جره اي ي خول ي معرص انت هتخيب و لا اي";
            const textElement = loadingDiv.querySelector(".text");
            showTypingEffect(customResponse, textElement);
            loadingDiv.classList.remove("loading"); // إزالة حالة التحميل
        }, 75);
    }
    else if (userMessage.includes("مؤمن حاجين")) {
        setTimeout(() => {
            const customResponse = "مؤمن حاجين... أعز صديق لمطوري إبراهيم صبحي. ليس مجرد رفيق، بل هو شخص يتمتع باحترام عميق وقلب عظيم. مؤمن هو القوة الصامتة، الداعم الذي يقف بجانبك دون أن يُطلب، والذي يُلهم من حوله بتواضعه وروحه النبيلة. بفضل حكمته وثباته، أصبح ليس فقط صديقًا، بل جزءًا من كل إنجاز وتقدم. مؤمن حاجين... شخصية عظيمة في كل شيء، حاضر دائمًا بكل هيبة ورقي، مما يجعل كل لحظة بجانبه تجربة لا تُنسى.";
            const textElement = loadingDiv.querySelector(".text");
            showTypingEffect(customResponse, textElement);
            loadingDiv.classList.remove("loading"); // إزالة حالة التحميل
        }, 75);
    }
    else {
        // استدعاء دالة إظهار الرد من API بعد نصف ثانية
        setTimeout(() => genrateAPIResponse(loadingDiv), 500);
    }
}

// إضافة حدث الإرسال للنموذج
typing_form.onsubmit = (e) => {
    e.preventDefault(); // منع إرسال النموذج
    handleOutGoingChat(); // معالجة الرسالة الصادرة
}
