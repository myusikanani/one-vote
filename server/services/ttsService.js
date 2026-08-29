const OpenAI = require("openai");

const GUIDANCE_SCRIPTS = {
  // Step 1: Verification Guide
  step1_verify: {
    en: "Welcome to One Voter ID Anywhere Voting. Please enter your Voter ID or scan your badge to verify central eligibility.",
    gu: "વન વોટર આઈડી — ગમે ત્યાંથી મતદાન પોર્ટલમાં સ્વાગત છે. કૃપા કરીને તમારું વોટર આઈડી દાખલ કરો અથવા બેજ સ્કેન કરો.",
    hi: "वन वोटर आईडी — कहीं से भी मतदान में आपका स्वागत है। कृपया अपनी वोटर आईडी दर्ज करें या बैज स्कैन करें।"
  },
  VERIFY_PROMPT: {
    en: "Welcome to One Voter ID Anywhere Voting. Please enter your Voter ID or scan your badge to verify central eligibility.",
    gu: "વન વોટર આઈડી — ગમે ત્યાંથી મતદાન પોર્ટલમાં સ્વાગત છે. કૃપા કરીને તમારું વોટર આઈડી દાખલ કરો અથવા બેજ સ્કેન કરો.",
    hi: "वन वोटर आईडी — कहीं से भी मतदान में आपका स्वागत है। कृपया अपनी वोटर आईडी दर्ज करें या बैज स्कैन करें।"
  },

  // Step 2 & 3: Token Issued
  step2_token_issued: {
    en: "Voter verified successfully. A 5-minute single-use authorization token is generated. Please proceed to the voting compartment.",
    gu: "મતદાર ચકાસણી સફળ થઈ છે. ૫ મિનિટનો સિંગલ-યુઝ ટોકન જનરેટ થયો છે. કૃપા કરીને મતદાન બૂથ તરફ આગળ વધો.",
    hi: "मतदाता सत्यापन सफल रहा। 5 मिनट का सिंगल-यूज टोकन जारी हुआ है। कृपया मतदान बूथ की ओर बढ़ें।"
  },
  TOKEN_ISSUED: {
    en: "Voter verified successfully. A 5-minute single-use authorization token is generated. Please proceed to the voting compartment.",
    gu: "મતદાર ચકાસણી સફળ થઈ છે. ૫ મિનિટનો સિંગલ-યુઝ ટોકન જનરેટ થયો છે. કૃપા કરીને મતદાન બૂથ તરફ આગળ વધો.",
    hi: "मतदाता सत्यापन सफल रहा। 5 मिनट का सिंगल-यूज टोकन जारी हुआ है। कृपया मतदान बूथ की ओर बढ़ें।"
  },

  // Step 2 Block: Duplicate Attempt
  step3_duplicate_blocked: {
    en: "Security Alert: Duplicate voting attempt blocked. This voter has already cast their ballot at another polling station.",
    gu: "સુરક્ષા ચેતવણી: ડુપ્લિકેટ મતદાનનો પ્રયાસ અટકાવ્યો છે. આ મતદાર અન્ય મતદાન મથકે પહેલેથી જ મતદાન કરી ચૂક્યા છે.",
    hi: "सुरक्षा चेतावनी: दोहरे मतदान का प्रयास रोका गया। यह मतदाता पहले ही किसी अन्य केंद्र पर मतदान कर चुका है।"
  },
  ALREADY_VOTED_BLOCK: {
    en: "Security Alert: Duplicate voting attempt blocked. This voter has already cast their ballot at another polling station.",
    gu: "સુરક્ષા ચેતવણી: ડુપ્લિકેટ મતદાનનો પ્રયાસ અટકાવ્યો છે. આ મતદાર અન્ય મતદાન મથકે પહેલેથી જ મતદાન કરી ચૂક્યા છે.",
    hi: "सुरक्षा चेतावनी: दोहरे मतदान का प्रयास रोका गया। यह मतदाता पहले ही किसी अन्य केंद्र पर मतदान कर चुका है।"
  },

  // Step 4: EVM Ballot Instruction
  step4_ballot_instruction: {
    en: "EVM Ballot Unit is ready. Review candidate symbols, or press the Hear button to listen to audio. Press the blue button to cast your vote.",
    gu: "EVM બેલેટ યુનિટ તૈયાર છે. ઉમેદવારોના પ્રતીકો જુઓ અથવા સાંભળો બટન દબાવો. મત આપવા માટે વાદળી બટન દબાવો.",
    hi: "ईवीएम मतपत्र तैयार है। उम्मीदवार का चुनाव चिन्ह देखें या सुनें बटन दबाएं। वोट देने के लिए नीला बटन दबाएं।"
  },
  VOTE_PROMPT: {
    en: "EVM Ballot Unit is ready. Review candidate symbols, or press the Hear button to listen to audio. Press the blue button to cast your vote.",
    gu: "EVM બેલેટ યુનિટ તૈયાર છે. ઉમેદવારોના પ્રતીકો જુઓ અથવા સાંભળો બટન દબાવો. મત આપવા માટે વાદળી બટન દબાવો.",
    hi: "ईवीएम मतपत्र तैयार है। उम्मीदवार का चुनाव चिन्ह देखें या सुनें बटन दबाएं। वोट देने के लिए नीला बटन दबाएं।"
  },

  // Step 5: Success & Acknowledgement
  step5_vote_success: {
    en: "Your vote has been cast anonymously and recorded in the central ledger. Thank you for voting.",
    gu: "તમારો મત ગુપ્ત રીતે નોંધાઈ ગયો છે અને સેન્ટ્રલ લેજરમાં સફળતાપૂર્વક સંગ્રહિત થયો છે. મતદાન કરવા બદલ આભાર.",
    hi: "आपका वोट गुप्त रूप से दर्ज हो गया है और केंद्रीय लेजर में सुरक्षित है। मतदान के लिए धन्यवाद।"
  },
  VOTE_CONFIRMATION: {
    en: "Your vote has been cast anonymously and recorded in the central ledger. Thank you for voting.",
    gu: "તમારો મત ગુપ્ત રીતે નોંધાઈ ગયો છે અને સેન્ટ્રલ લેજરમાં સફળતાપૂર્વક સંગ્રહિત થયો છે. મતદાન કરવા બદલ આભાર.",
    hi: "आपका वोट गुप्त रूप से दर्ज हो गया है और केंद्रीय लेजर में सुरक्षित है। मतदान के लिए धन्यवाद।"
  }
};

async function generateSpeech({ text, scriptKey, language = "gu", speed = 1.0 }) {
  let textToSpeak = text;
  if (scriptKey && GUIDANCE_SCRIPTS[scriptKey]) {
    textToSpeak = GUIDANCE_SCRIPTS[scriptKey][language] || GUIDANCE_SCRIPTS[scriptKey].gu || GUIDANCE_SCRIPTS[scriptKey].en;
  }

  if (!textToSpeak) {
    textToSpeak = language === "gu" 
      ? "વન વોટર આઈડી — ગમે ત્યાંથી મતદાન." 
      : language === "hi"
        ? "वन वोटर आईडी — कहीं से भी मतदान."
        : "One Voter ID — Anywhere Voting.";
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_openai_api_key_here") {
    return {
      isAudioStream: false,
      text: textToSpeak,
      language,
      speed,
      fallbackMode: "BROWSER_SPEECH_SYNTHESIS"
    };
  }

  try {
    const openai = new OpenAI({ apiKey });
    const voice = language === "gu" || language === "hi" ? "nova" : "alloy";

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice,
      input: textToSpeak,
      speed: Number(speed) || 1.0,
      response_format: "mp3"
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    const audioBase64 = buffer.toString("base64");

    return {
      isAudioStream: true,
      audioBase64,
      text: textToSpeak,
      language,
      speed
    };
  } catch (error) {
    console.error("OpenAI TTS error, using browser synthesis fallback:", error.message);
    return {
      isAudioStream: false,
      text: textToSpeak,
      language,
      speed,
      fallbackMode: "BROWSER_SPEECH_SYNTHESIS"
    };
  }
}

module.exports = {
  generateSpeech,
  GUIDANCE_SCRIPTS
};
