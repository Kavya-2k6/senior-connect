export const seedUsers = [
  {
    _id: "user_senior_1",
    name: "Aravind Sharma",
    email: "aravind.s@college.edu",
    passwordHash: "$2a$10$wN3eR2Z0kS1e4u9uX6G3yO2XN1M8Z.a1b2c3d4e5f6g7h8i9j0k1", // password123
    role: "SENIOR",
    department: "CSE",
    graduationYear: 2025,
    bio: "SDE Intern @ Amazon | Incoming Full-Time SDE. Passionate about Web Dev, System Design & DSA. Happy to guide juniors on resume building and technical interviews!",
    skills: ["React.js", "Node.js", "System Design", "DSA", "Amazon SDE"],
    company: "Amazon",
    linkedinUrl: "https://linkedin.com/in/aravind-sharma",
    githubUrl: "https://github.com/aravind-s",
    availabilitySlots: ["Tuesdays 5 PM - 7 PM", "Saturdays 10 AM - 1 PM"],
    averageRating: 4.9,
    totalSessions: 18,
    karmaPoints: 420,
    isVerified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    _id: "user_senior_2",
    name: "Priya Nair",
    email: "priya.n@college.edu",
    passwordHash: "$2a$10$wN3eR2Z0kS1e4u9uX6G3yO2XN1M8Z.a1b2c3d4e5f6g7h8i9j0k1", // password123
    role: "SENIOR",
    department: "ECE",
    graduationYear: 2025,
    bio: "Admitted to MS in ECE @ Carnegie Mellon University (CMU). GRE 328/340. Helping juniors with SOP writing, LORs, professor cold emails, and research papers.",
    skills: ["GRE Prep", "Higher Studies", "SOP Review", "Embedded Systems", "Research"],
    company: "CMU Admit '25",
    linkedinUrl: "https://linkedin.com/in/priya-nair",
    githubUrl: "https://github.com/priya-n",
    availabilitySlots: ["Wednesdays 6 PM - 8 PM", "Sundays 3 PM - 6 PM"],
    averageRating: 4.8,
    totalSessions: 14,
    karmaPoints: 340,
    isVerified: true,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
  },
  {
    _id: "user_senior_3",
    name: "Rohit Kumar",
    email: "rohit.k@college.edu",
    passwordHash: "$2a$10$wN3eR2Z0kS1e4u9uX6G3yO2XN1M8Z.a1b2c3d4e5f6g7h8i9j0k1", // password123
    role: "SENIOR",
    department: "CSE",
    graduationYear: 2025,
    bio: "CAT 2024 Percentile: 99.42%. Shortlisted for IIM Ahmedabad & Bangalore. Let's conquer Quant and DILR strategy together!",
    skills: ["CAT Prep", "Quant", "DILR", "Interview Prep", "Analytics"],
    company: "IIM Convert",
    linkedinUrl: "https://linkedin.com/in/rohit-k",
    githubUrl: "https://github.com/rohit-k",
    availabilitySlots: ["Fridays 4 PM - 6 PM"],
    averageRating: 5.0,
    totalSessions: 12,
    karmaPoints: 290,
    isVerified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    _id: "user_junior_1",
    name: "Rohan Verma",
    email: "junior@college.edu",
    passwordHash: "$2a$10$wN3eR2Z0kS1e4u9uX6G3yO2XN1M8Z.a1b2c3d4e5f6g7h8i9j0k1", // password123
    role: "JUNIOR",
    department: "CSE",
    graduationYear: 2027,
    bio: "2nd Year CSE Student. Interested in Web Development, Open Source, and SDE Internship prep.",
    skills: ["JavaScript", "HTML/CSS", "Python"],
    averageRating: 0,
    totalSessions: 0,
    karmaPoints: 45,
    isVerified: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    _id: "user_admin_1",
    name: "Campus Admin",
    email: "admin@college.edu",
    passwordHash: "$2a$10$wN3eR2Z0kS1e4u9uX6G3yO2XN1M8Z.a1b2c3d4e5f6g7h8i9j0k1", // password123
    role: "ADMIN",
    department: "CSE",
    graduationYear: 2024,
    bio: "Senior Connect System Moderator and Faculty Coordinator.",
    skills: ["Moderation", "System Admin"],
    isVerified: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  }
];

export const seedMentorships = [
  {
    _id: "m_req_1",
    juniorId: "user_junior_1",
    juniorName: "Rohan Verma",
    juniorEmail: "junior@college.edu",
    mentorId: "user_senior_1",
    mentorName: "Aravind Sharma",
    topic: "Amazon SDE Internship Resume Review & Project Guidance",
    agenda: "I want guidance on structuring my MERN stack project for resume highlight and 45 mins mock interview strategy.",
    preferredSlot: "Saturdays 10 AM - 1 PM",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "ACCEPTED",
    scheduledAt: "2026-08-10T10:00:00.000Z",
    createdAt: "2026-08-04T14:20:00.000Z"
  },
  {
    _id: "m_req_2",
    juniorId: "user_junior_1",
    juniorName: "Rohan Verma",
    juniorEmail: "junior@college.edu",
    mentorId: "user_senior_3",
    mentorName: "Rohit Kumar",
    topic: "CAT Quant 6-Month Study Plan",
    agenda: "Need help balancing semester exams with CAT preparation syllabus and mock test analysis.",
    preferredSlot: "Fridays 4 PM - 6 PM",
    meetingLink: "",
    status: "PENDING",
    scheduledAt: "2026-08-14T16:00:00.000Z",
    createdAt: "2026-08-05T09:15:00.000Z"
  }
];

export const seedResources = [
  {
    _id: "res_1",
    title: "Operating Systems Hand-written Exam Notes (Sem 4)",
    uploaderId: "user_senior_1",
    uploaderName: "Aravind Sharma",
    category: "NOTES",
    department: "CSE",
    semester: 4,
    description: "Complete chapter-wise notes covering CPU Scheduling, Deadlocks, Virtual Memory, and Paging. Includes solved PYQs.",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    tags: ["OS", "Paging", "Deadlocks", "MidSem"],
    upvotes: 42,
    downloadsCount: 156,
    createdAt: "2026-07-20T11:00:00.000Z"
  },
  {
    _id: "res_2",
    title: "Amazon SDE-1 Interview Experience & Top 50 LeetCode Patterns",
    uploaderId: "user_senior_1",
    uploaderName: "Aravind Sharma",
    category: "INTERVIEW_EXP",
    department: "CSE",
    semester: 6,
    description: "Detailed breakdown of all 4 rounds (OA, Tech 1, Tech 2, Bar Raiser) at Amazon. Includes Leadership Principles questions.",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    tags: ["Placements", "Amazon", "DSA", "System Design"],
    upvotes: 89,
    downloadsCount: 310,
    createdAt: "2026-07-28T09:30:00.000Z"
  },
  {
    _id: "res_3",
    title: "GRE Quantitative Reasoning 170/170 Formulas & Tricks Cheat Sheet",
    uploaderId: "user_senior_2",
    uploaderName: "Priya Nair",
    category: "ROADMAP",
    department: "ECE",
    semester: 5,
    description: "Personal formula book that helped me score 328 on GRE. Algebra, Geometry, Data Interpretation shortcut tricks.",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    tags: ["GRE", "Higher Studies", "Quant", "Math"],
    upvotes: 67,
    downloadsCount: 220,
    createdAt: "2026-08-01T15:45:00.000Z"
  }
];

export const seedQuestions = [
  {
    _id: "q_1",
    authorId: "user_junior_1",
    authorName: "Rohan Verma",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    title: "How to prepare for System Design in 3rd year when building college projects?",
    content: "I am building a full-stack MERN application. What are the key system design concepts I should focus on (e.g., Caching, Rate Limiting, Load Balancing) to make it resume-worthy for SDE roles?",
    tags: ["System Design", "MERN", "Placements", "Web Dev"],
    upvotes: 15,
    isSolved: true,
    acceptedAnswerId: "ans_1",
    createdAt: "2026-08-02T10:00:00.000Z",
    answers: [
      {
        _id: "ans_1",
        authorId: "user_senior_1",
        authorName: "Aravind Sharma",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        content: "Focus on 3 main practical aspects:\n1. **Database Indexing & Query Optimization:** Don't just do basic `find()`. Index your MongoDB fields (e.g., user search tags).\n2. **Authentication Security:** Use HttpOnly cookies for JWTs and implement access token refresh patterns.\n3. **Caching Layer:** Introduce Redis or in-memory caching for frequent read endpoints like Mentor Directory.",
        upvotes: 24,
        isAccepted: true,
        createdAt: "2026-08-02T12:30:00.000Z"
      }
    ]
  },
  {
    _id: "q_2",
    authorId: "user_junior_1",
    authorName: "Rohan Verma",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    title: "Is CAT preparation manageable along with 5th semester lab projects and internals?",
    content: "I am feeling overwhelmed managing 4 hours of Quant/DILR practice daily alongside 6 lab reports per week. How did seniors balance this?",
    tags: ["CAT Prep", "Time Management", "Academic Strategy"],
    upvotes: 11,
    isSolved: false,
    acceptedAnswerId: null,
    createdAt: "2026-08-04T16:20:00.000Z",
    answers: [
      {
        _id: "ans_2",
        authorId: "user_senior_3",
        authorName: "Rohit Kumar",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        content: "The key is consistent 1.5 hour morning slots before college starts! Dedicate weekdays strictly to topic tests and save 3-hour Mocks for Sunday mornings. Never defer lab code to late nights.",
        upvotes: 18,
        isAccepted: false,
        createdAt: "2026-08-04T18:10:00.000Z"
      }
    ]
  }
];

export const seedEvents = [
  {
    _id: "evt_1",
    title: "Mastering SDE Interviews: From Resume to Bar Raiser",
    hostId: "user_senior_1",
    hostName: "Aravind Sharma (Amazon SDE)",
    description: "An interactive 90-minute workshop detailing how to format college project entries, answer behavioral questions using the STAR technique, and solve hard LeetCode problems live.",
    eventDate: "2026-08-15T18:00:00.000Z",
    meetingUrl: "https://meet.google.com/xyz-pqrs-tuv",
    registeredUserIds: ["user_junior_1"],
    registeredCount: 48,
    bannerImageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-08-01T10:00:00.000Z"
  },
  {
    _id: "evt_2",
    title: "MS in US Masterclass: SOPs, GRE & Scholarship Strategies",
    hostId: "user_senior_2",
    hostName: "Priya Nair (CMU Admit)",
    description: "Step-by-step roadmap for 3rd and 4th-year students planning to study abroad in Fall 2027. Covers professor outreach, LOR drafting, and university shortlisting.",
    eventDate: "2026-08-20T17:00:00.000Z",
    meetingUrl: "https://meet.google.com/mno-uvwx-yza",
    registeredUserIds: [],
    registeredCount: 32,
    bannerImageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-08-03T14:00:00.000Z"
  }
];
