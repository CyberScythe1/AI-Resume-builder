export interface ResumeData {
    templateId?: string;
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        website: string;
        summary: string;
    };
    experience: {
        title: string;
        company: string;
        date: string;
        description: string;
    }[];
    education: {
        degree: string;
        school: string;
        date: string;
        info: string;
    }[];
    projects: {
        name: string;
        link: string;
        description: string;
    }[];
    languages: {
        language: string;
        fluency: string;
    }[];
    skills: string[];
}
