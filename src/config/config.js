module.exports = {
    // Bot configuration
    bot: {
        name: "Termux WhatsApp Bot",
        version: "1.0.0",
        prefix: "!",
        owner: process.env.OWNER_NUMBER || "233532871325"
    },
    
    // WhatsApp configuration
    whatsapp: {
        sessionPath: "./data/sessions",
        maxListeners: 50
    },
    
    // Features configuration
    features: {
        antiDelete: process.env.ANTI_DELETE === 'true',
        autoViewStatus: process.env.AUTO_VIEW_STATUS === 'true',
        autoReact: process.env.AUTO_REACT === 'true',
        saveProfilePics: process.env.SAVE_PROFILE_PICS === 'true'
    },
    
    // Server configuration
    server: {
        port: process.env.PORT || 3000,
        enable: process.env.ENABLE_SERVER === 'true'
    }
};
