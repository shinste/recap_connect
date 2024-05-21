
const Response = (participantNames) => {
    const responses = [
        "Wow, that sounds like an amazing experience!",
        "That's awesome! It sounds like you had a lot of fun.",
        "Sounds like you had a blast! What was the best part?",
        "That's impressive! You must be proud of yourself.",
        "Incredible! Your achievements are inspiring.",
        "Nice work! Keep up the great effort.",
        "Fantastic! You're making great progress.",
        "Great job! It's wonderful to hear about your accomplishments.",
        "You're on fire! Keep up the momentum.",
        "That's amazing! You're doing fantastic work.",
        "Keep up the good work! Your efforts are paying off.",
        "Superb job! Your dedication is commendable.",
        "You're doing great things! Keep aiming high.",
        "You're crushing it! Keep up the excellent work.",
        "Outstanding! Your achievements speak volumes.",
        "Spectacular! Your hard work is shining through.",
        "Brilliant! You're making a real difference.",
        "Impressive stuff! Your progress is remarkable.",
        "Remarkable work! Your determination is admirable.",
        "You're unstoppable! Keep up the incredible work."
    ];
    return [responses[Math.floor(Math.random() * responses.length)], participantNames[Math.floor(Math.random() * participantNames.length)]];

}

export default Response;