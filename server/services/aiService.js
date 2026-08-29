const OpenAI = require("openai");

const KNOWLEDGE_BASE = {
  articles: {
    "why-blocked": {
      title: "Why is a Voter Blocked?",
      content: `A voter is blocked when the Central Real-Time Ledger records that a valid vote has already been submitted for this Voter ID at any connected polling booth. In 'One Voter ID — Anywhere Voting', the instant a citizen casts a ballot in one city (e.g. Surat), their central status is locked to 'VOTED'. Any subsequent attempt from another city (e.g. Ahmedabad or Rajkot) is immediately halted to preserve the fundamental principle of 'One Person, One Vote'.`,
      contentGu: `જ્યારે સેન્ટ્રલ રિયલ-ટાઇમ લેજરમાં નોંધાય છે કે આ વોટર આઈડી માટે કોઈપણ મતદાન મથક પરથી પહેલેથી જ મત અપાઈ ચૂક્યો છે, ત્યારે મતદાર બ્લોક થઈ જાય છે. 'વન વોટર આઈડી — ગમે ત્યાંથી મતદાન' સિસ્ટમમાં, નાગરિક એક શહેરમાં (દા.ત. સુરત) મત આપે તે જ ક્ષણે સેન્ટ્રલ સ્ટેટસ 'VOTED' થઈ જાય છે. 'એક વ્યક્તિ, એક મત' ના સિદ્ધાંતનું રક્ષણ કરવા માટે અન્ય કોઈપણ શહેરમાંથી બીજો પ્રયાસ તરત જ અટકાવી દેવામાં આવે છે.`,
      contentHi: `जब सेंट्रल रियल-टाइम लेजर में यह दर्ज होता है कि इस वोटर आईडी के लिए किसी भी पोलिंग बूथ से पहले ही वोट डाला जा चुका है, तो मतदाता को ब्लॉक कर दिया जाता है। 'वन वोटर आईडी — कहीं से भी मतदान' प्रणाली में, नागरिक एक शहर में वोट डालता है उसी क्षण उसका स्टेटस 'VOTED' हो जाता है। 'एक व्यक्ति, एक वोट' के नियम की रक्षा के लिए अन्य किसी भी शहर से दूसरा प्रयास तुरंत रोक दिया जाता है।`
    },
    "token-expired": {
      title: "Token Expired — What to do?",
      content: `Authorization tokens are intentionally short-lived (5-minute countdown window, 04:59) for security reasons. If a citizen does not cast their ballot within 5 minutes, the token expires automatically. The polling officer should re-verify the voter's credential at the staff terminal to generate a fresh 5-minute session token.`,
      contentGu: `સુરક્ષા કારણોસર અધિકૃતતા ટોકન માત્ર ૫ મિનિટ (૦૪:૫૯ કાઉન્ટડાઉન વિન્ડો) માટે જ માન્ય હોય છે. જો નાગરિક ૫ મિનિટમાં મત ન આપે, તો ટોકન આપમેળે સમાપ્ત થઈ જાય છે. પોલિંગ સ્ટાફે સ્ટાફ ટર્મિનલ પર મતદારનું કાર્ડ ફરીથી તપાસીને નવો ૫-મિનિટનો ટોકન જનરેટ કરવો પડશે.`,
      contentHi: `सुरक्षा कारणों से प्राधिकरण टोकन केवल 5 मिनट (04:59 काउंटडाउन) के लिए वैध होता है। यदि नागरिक 5 मिनट के भीतर वोट नहीं डालता है, तो टोकन स्वतः समाप्त हो जाता है। पोलिंग स्टाफ को टर्मिनल पर मतदाता की पुनः जांच करके नया 5-मिनट का टोकन जारी करना होगा।`
    },
    "active-session": {
      title: "Active Session in Progress / Race Condition Block",
      content: `Only ONE active authorization token is permitted per voter statewide. If a voter is already authorized at one terminal, all concurrent attempts at any other terminal or city are denied with 'ACTIVE_SESSION_EXISTS' until the 5-minute session expires or a ballot is cast.`,
      contentGu: `રેસ કન્ડીશન અટકાવવા માટે સમગ્ર રાજ્યમાં એક મતદાર માટે એક સમયે માત્ર ૧ જ સક્રિય અધિકૃતતા ટોકન માન્ય છે. જો કોઈ ટર્મિનલ પર સેશન ચાલુ હોય, તો અન્ય કોઈ પણ શહેર કે બૂથ પરથી પ્રયાસ 'ACTIVE_SESSION_EXISTS' સાથે અટકાવી દેવાય છે.`,
      contentHi: `रेस कंडीशन रोकने के लिए पूरे राज्य में एक मतदाता के लिए एक समय में केवल 1 सक्रिय टोकन की अनुमति है। यदि किसी बूथ पर सत्र सक्रिय है, तो अन्य सभी बूथों पर प्रयास 'ACTIVE_SESSION_EXISTS' के साथ रोक दिया जाता है।`
    },
    "voter-not-found": {
      title: "Voter ID Not Found in Central Registry",
      content: `If a voter ID is not found, verify that the synthetic format is correct (e.g., 'DEMO-V101'). If the ID was entered manually, check for typographical errors. In production, unlisted voters are directed to the Help Desk for electoral roll supplementary check.`,
      contentGu: `જો વોટર આઈડી ન મળે, તો ફોર્મેટ સાચું છે કે નહીં તે તપાસો (દા.ત., 'DEMO-V101'). હેકાથોન ડેમો માટે પ્રીસેટ કાર્ડ્સ જેવા કે DEMO-V101 (રમેશ પટેલ) અથવા DEMO-V102 (પ્રિયા શાહ) નો ઉપયોગ કરો.`,
      contentHi: `यदि वोटर आईडी नहीं मिलती है, तो जांचें कि प्रारूप सही है (उदा. 'DEMO-V101')। डेमो के लिए प्रीसेट कार्ड जैसे DEMO-V101 (रमेश पटेल) का उपयोग करें।`
    },
    "vote-secrecy": {
      title: "Vote Secrecy & Decoupled Data Architecture",
      content: `Our Privacy-by-Design architecture enforces absolute secrecy through two completely decoupled data stores: (1) The Voter Status Ledger, which tracks only whether a person has voted (NOT_VOTED / VOTED), and (2) The Anonymous Vote Vault, which records candidate selections with a cryptographic receipt hash but ZERO voter identifiers, tokens, locations, or staff IDs.`,
      contentGu: `અમારી પ્રાઇવસી-બાય-ડિઝાઇન આર્કિટેક્ચર બે અલગ-અલગ ડેટા સ્ટોર દ્વારા સંપૂર્ણ ગોપનીયતા સુનિશ્ચિત કરે છે: (૧) વોટર સ્ટેટસ લેજર (માત્ર NOT_VOTED / VOTED ટ્રેક કરે છે), અને (૨) અનામી વોટ વૉલ્ટ (જે ઉમેદવારની પસંદગીને ક્રિપ્ટોગ્રાફિક હેશ સાથે સેવ કરે છે પરંતુ તેમાં કોઈ વોટર આઈડી, ટોકન કે લોકેશન સ્ટોર થતું નથી).`,
      contentHi: `हमारी प्राइवेसी-बाय-डिजाइन आर्किटेक्चर दो अलग डेटा स्टोर के माध्यम से पूर्ण गोपनीयता सुनिश्चित करती है: (1) वोटर स्टेटस लेजर (केवल NOT_VOTED / VOTED ट्रैक करता है), और (2) अनाम वोट वॉल्ट (जिसमें कोई वोटर आईडी या टोकन संग्रहीत नहीं होता)।`
    },
    "cross-district-rules": {
      title: "Cross-District Anywhere Voting Rules",
      content: `Registered voters across Gujarat (Ahmedabad, Surat, Rajkot, Vadodara) can cast their ballot at any authorized polling booth in any district. The central system automatically fetches the candidate ballot corresponding to the voter's home constituency, issues a single-use authorization token, and synchronizes status in real-time.`,
      contentGu: `ગુજરાતના કોઈપણ નોંધાયેલા મતદાર (અમદાવાદ, સુરત, રાજકોટ, વડોદરા) કોઈપણ જિલ્લાના અધિકૃત મતદાન મથક પરથી મત આપી શકે છે. સેન્ટ્રલ સિસ્ટમ આપમેળે નાગરિકના મૂળ મતવિસ્તારનું બેલેટ ફેચ કરે છે અને રીયલ-ટાઇમમાં સ્ટેટસ સિંક કરે છે.`,
      contentHi: `गुजरात के कोई भी पंजीकृत मतदाता (अहमदाबाद, सूरत, राजकोट, वडोदरा) किसी भी जिले के मतदान केंद्र से मतदान कर सकते हैं। केंद्रीय प्रणाली स्वचालित रूप से उनके मूल निर्वाचन क्षेत्र का मतपत्र लोड करती है।`
    }
  }
};

const TOOLS_DEFINITION = [
  {
    type: "function",
    function: {
      name: "getHelpArticle",
      description: "Retrieve official standard operating procedures (SOP), guidelines, or privacy explanations.",
      parameters: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            enum: ["why-blocked", "token-expired", "active-session", "voter-not-found", "vote-secrecy", "cross-district-rules"],
            description: "The specific topic to look up."
          }
        },
        required: ["topic"]
      }
    }
  }
];

function executeReadOnlyTool(toolName, args = {}) {
  switch (toolName) {
    case "getHelpArticle": {
      const topicKey = args.topic || "why-blocked";
      const article = KNOWLEDGE_BASE.articles[topicKey] || KNOWLEDGE_BASE.articles["why-blocked"];
      return { status: "success", data: article };
    }
    default:
      return { status: "error", message: `Tool ${toolName} is not permitted.` };
  }
}

async function handleStaffChat({ message, conversationHistory = [], language = "gu" }) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_openai_api_key_here") {
    return handleFallbackChat(message, language);
  }

  try {
    const openai = new OpenAI({ apiKey });

    const langInstructions = {
      gu: "Respond strictly and fluently in GUJARATI (ગુજરાતી). Use Gujarati terms for election SOPs.",
      hi: "Respond strictly and fluently in HINDI (हिन्दी). Use Hindi terms for election SOPs.",
      en: "Respond strictly in ENGLISH. Keep tone formal and helpful."
    };

    const targetLangPrompt = langInstructions[language] || langInstructions.gu;

    const messages = [
      {
        role: "system",
        content: `You are the Polling Staff Smart Assistant for 'One Voter ID — Anywhere Voting' Civic Prototype.
STRICT HARD BOUNDARIES:
- You are strictly a READ-ONLY informational assistant.
- You CANNOT modify voter status, you CANNOT override locks, you CANNOT create or override tokens, you CANNOT mark anyone as VOTED, you CANNOT change eligibility, you CANNOT access candidate choices, and you CANNOT access real citizen/government data.
- When describing unusual activity, use advisory recommendations like "Possible unusual verification pattern detected. Supervisor review recommended."
- Privacy architecture is 'Privacy-by-Design / Decoupled Data Architecture' (never claim Zero-Knowledge).
- ${targetLangPrompt}
- Keep answers concise, professional, reassuring, and standard-compliant.`
      },
      ...conversationHistory.slice(-4),
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      tools: TOOLS_DEFINITION,
      tool_choice: "auto",
      temperature: 0.2
    });

    const choice = response.choices[0];
    
    if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
      const toolCall = choice.message.tool_calls[0];
      const functionName = toolCall.function.name;
      let args = {};
      try { args = JSON.parse(toolCall.function.arguments); } catch (e) {}

      const toolResult = executeReadOnlyTool(functionName, args);

      const followUpMessages = [
        ...messages,
        choice.message,
        {
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult)
        }
      ];

      const secondResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: followUpMessages,
        temperature: 0.2
      });

      return {
        reply: secondResponse.choices[0].message.content,
        toolUsed: { name: functionName, args, result: toolResult }
      };
    }

    return { reply: choice.message.content, toolUsed: null };

  } catch (error) {
    console.error("OpenAI Chat error, using trilingual local fallback engine:", error.message);
    return handleFallbackChat(message, language);
  }
}

function handleFallbackChat(message, language = "gu") {
  const lower = (message || "").toLowerCase();

  // Why blocked
  if (lower.includes("block") || lower.includes("already voted") || lower.includes("duplicate") || lower.includes("બ્લોક") || lower.includes("પહેલેથી") || lower.includes("ब्लॉक") || lower.includes("पहले ही")) {
    const res = executeReadOnlyTool("getHelpArticle", { topic: "why-blocked" });
    if (language === "gu") {
      return {
        reply: `🔒 **આ મતદાર કેમ બ્લોક છે?**\n\n${res.data.contentGu}\n\n*પોલિંગ ઓફિસર માટે પગલાં*: મતદારને અગાઉના મતદાનનો સમય અને શહેર જણાવો. જો નાગરિક ઓળખ ચોરીનો દાવો કરે, તો ECI નિયમ 49P / ફોર્મ 17B (ટેન્ડર્ડ બેલેટ) ની પ્રક્રિયા શરૂ કરો. સિસ્ટમ ડિજિટલ ટોકન ફરીથી આપશે નહીં.`,
        toolUsed: { name: "getHelpArticle", args: { topic: "why-blocked" }, result: res }
      };
    } else if (language === "hi") {
      return {
        reply: `🔒 **यह मतदाता क्यों ब्लॉक है?**\n\n${res.data.contentHi}\n\n*पीठासीन अधिकारी के लिए निर्देश*: मतदाता को पहले के मतदान का समय और स्थान बताएं। यदि पहचान चोरी का दावा हो, तो ECI नियम 49P / फॉर्म 17B (निविदा मतपत्र) शुरू करें।`,
        toolUsed: { name: "getHelpArticle", args: { topic: "why-blocked" }, result: res }
      };
    } else {
      return {
        reply: `🔒 **Why is this voter blocked?**\n\n${res.data.content}\n\n*Action for Presiding Officer*: Inform citizen of previous recorded vote. If identity theft is claimed, initiate Form 17B (Tendered Ballot).`,
        toolUsed: { name: "getHelpArticle", args: { topic: "why-blocked" }, result: res }
      };
    }
  }

  // Simultaneous / Race Condition
  if (lower.includes("race") || lower.includes("simultaneous") || lower.includes("active session") || lower.includes("સમાંતર") || lower.includes("સેશન") || lower.includes("समानांतर")) {
    const res = executeReadOnlyTool("getHelpArticle", { topic: "active-session" });
    if (language === "gu") {
      return {
        reply: `⚡ **સમાંતર સેશન રક્ષણ (Anti-Race Condition)**\n\n${res.data.contentGu}\n\n*સુરક્ષા પ્રોટોકોલ*: જો કોઈ મતદારનું ટોકન અન્ય બૂથ પર સક્રિય હોય, તો ડબલ વોટિંગ અટકાવવા માટે જ્યાં સુધી સેશન પૂરું ન થાય ત્યાં સુધી બીજો ટોકન બનશે નહીં.`,
        toolUsed: { name: "getHelpArticle", args: { topic: "active-session" }, result: res }
      };
    } else if (language === "hi") {
      return {
        reply: `⚡ **समानांतर सत्र सुरक्षा (Anti-Race Condition)**\n\n${res.data.contentHi}\n\n*सुरक्षा प्रोटोकॉल*: जब तक सक्रिय 5-मिनट सत्र समाप्त नहीं होता, अन्य किसी भी केंद्र से टोकन जारी नहीं किया जा सकता।`,
        toolUsed: { name: "getHelpArticle", args: { topic: "active-session" }, result: res }
      };
    } else {
      return {
        reply: `⚡ **Simultaneous Session Protection**\n\n${res.data.content}\n\n*Security Protocol*: Only ONE active token is allowed statewide at any time.`,
        toolUsed: { name: "getHelpArticle", args: { topic: "active-session" }, result: res }
      };
    }
  }

  // Token Expired
  if (lower.includes("expire") || lower.includes("token") || lower.includes("5 min") || lower.includes("ટોકન") || lower.includes("સમાપ્ત") || lower.includes("टोकन")) {
    const res = executeReadOnlyTool("getHelpArticle", { topic: "token-expired" });
    if (language === "gu") {
      return {
        reply: `⏱️ **ટોકન સમયસમાપ્તિ માર્ગદર્શિકા**\n\n${res.data.contentGu}\n\n*પોલિંગ ઓફિસર માટે પગલાં*: સ્ટાફ ટર્મિનલ પર નાગરિકનું આઈડી ફરીથી વેરિફાય કરો જેથી નવો ૫-મિનિટનો સિંગલ-યુઝ ટોકન જનરેટ થાય.`,
        toolUsed: { name: "getHelpArticle", args: { topic: "token-expired" }, result: res }
      };
    } else if (language === "hi") {
      return {
        reply: `⏱️ **टोकन समाप्ति दिशानिर्देश**\n\n${res.data.contentHi}\n\n*पीठासीन अधिकारी के लिए निर्देश*: स्टाफ टर्मिनल पर पुनः सत्यापन करके नया 5-मिनट टोकन जारी करें।`,
        toolUsed: { name: "getHelpArticle", args: { topic: "token-expired" }, result: res }
      };
    } else {
      return {
        reply: `⏱️ **Token Expiration Guidance**\n\n${res.data.content}\n\n*Action for Presiding Officer*: Re-scan voter at terminal to issue a fresh 5-minute session token.`,
        toolUsed: { name: "getHelpArticle", args: { topic: "token-expired" }, result: res }
      };
    }
  }

  // Privacy & Secrecy
  if (lower.includes("secrecy") || lower.includes("privacy") || lower.includes("decoupling") || lower.includes("ગોપનીય") || lower.includes("પ્રાઇવસી") || lower.includes("गोपनीय")) {
    const res = executeReadOnlyTool("getHelpArticle", { topic: "vote-secrecy" });
    if (language === "gu") {
      return {
        reply: `🛡️ **પ્રાઇવસી-બાય-ડિઝાઇન અને ડીકપલ્ડ આર્કિટેક્ચર**\n\n${res.data.contentGu}\n\n*મહત્વની ગેરંટી*: સેન્ટ્રલ સ્ટેટસ લેજર અને અનામી વોટ વૉલ્ટ સંપૂર્ણપણે અલગ છે. તમારા વોટર આઈડી સાથે ઉમેદવારની પસંદગી ક્યારેય સ્ટોર થતી નથી.`,
        toolUsed: { name: "getHelpArticle", args: { topic: "vote-secrecy" }, result: res }
      };
    } else if (language === "hi") {
      return {
        reply: `🛡️ **प्राइवेसी-बाय-डिजाइन और डिकपल्ड आर्किटेक्चर**\n\n${res.data.contentHi}\n\n*गारंटी*: मतदाता पहचान और उम्मीदवार चयन कभी एक साथ नहीं जुड़ते।`,
        toolUsed: { name: "getHelpArticle", args: { topic: "vote-secrecy" }, result: res }
      };
    } else {
      return {
        reply: `🛡️ **Privacy-by-Design & Decoupled Data Architecture**\n\n${res.data.content}\n\n*Key Guarantee*: Zero link exists between voter ID and candidate choice.`,
        toolUsed: { name: "getHelpArticle", args: { topic: "vote-secrecy" }, result: res }
      };
    }
  }

  // Default Guidance
  const defaultArticle = executeReadOnlyTool("getHelpArticle", { topic: "cross-district-rules" });
  if (language === "gu") {
    return {
      reply: `📋 **વન વોટર આઈડી — સ્ટાફ સહાયક**\n\n${defaultArticle.data.contentGu}\n\nતમે નીચેના વિષયો વિશે પૂછી શકો છો:\n• મતદાર કેમ બ્લોક છે?\n• ટોકન સમાપ્ત થાય તો શું કરવું?\n• મતદાન ગોપનીયતા કેવી રીતે જળવાય છે?\n• સમાંતર સેશન રક્ષણ શું છે?`,
      toolUsed: { name: "getHelpArticle", args: { topic: "cross-district-rules" }, result: defaultArticle }
    };
  } else if (language === "hi") {
    return {
      reply: `📋 **वन वोटर आईडी — स्टाफ सहायक**\n\n${defaultArticle.data.contentHi}\n\nआप निम्न विषयों के बारे में पूछ सकते हैं:\n• मतदाता क्यों ब्लॉक है?\n• टोकन समाप्त हो जाए तो क्या करें?\n• मतदान गोपनीयता कैसे काम करती है?\n• समानांतर सत्र सुरक्षा क्या है?`,
      toolUsed: { name: "getHelpArticle", args: { topic: "cross-district-rules" }, result: defaultArticle }
    };
  } else {
    return {
      reply: `📋 **One Voter ID — Polling Staff Assistant**\n\n${defaultArticle.data.content}\n\nYou can ask about:\n• Why is a voter blocked?\n• Token expiration rules\n• Vote secrecy decoupling\n• Simultaneous session protection`,
      toolUsed: { name: "getHelpArticle", args: { topic: "cross-district-rules" }, result: defaultArticle }
    };
  }
}

module.exports = {
  handleStaffChat,
  executeReadOnlyTool
};
