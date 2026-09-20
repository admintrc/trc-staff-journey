export interface HandbookSection {
  id: string;
  title: string;
  part: 'A' | 'B';
  chapter: number;
  content: string;
  sections: string[];
  keywords: string[];
}

export const handbookContent: HandbookSection[] = [
  {
    id: 'a1',
    title: 'Before you were hired',
    part: 'A',
    chapter: 1,
    content: `
# A1. Before You Were Hired

TRC goes through a structured process to hire the right people:

## How We Find You
- We advertise on job boards and professional networks
- We review applications and shortlist candidates
- We conduct interviews and reference checks
- We make job offers to successful candidates

## Pre-Employment Requirements
All new staff must complete:
- Police clearance check
- Working with Children Check (WWCC)
- Healthcare worker registration
- Professional indemnity insurance (where applicable)
- Occupational health screening

## Your Offer Letter
Your offer letter will include:
- Position and reporting line
- Start date
- Salary and benefits
- Work schedule
- Conditions of employment
    `,
    sections: ['How We Find You', 'Pre-Employment Requirements', 'Your Offer Letter'],
    keywords: ['hiring', 'interview', 'offer', 'job', 'application'],
  },
  {
    id: 'a2',
    title: 'Finding the right person',
    part: 'A',
    chapter: 2,
    content: `
# A2. Finding the Right Person

Our interview process is designed to find the best fit for TRC.

## Interview Stages
1. Phone screening (15-20 mins)
2. First interview (45-60 mins)
3. Second interview (60-90 mins)
4. Reference checks
5. Offer

## What We Look For
- Clinical expertise and qualifications
- Customer service skills
- Team work
- Problem-solving ability
- Alignment with TRC values

## Equal Opportunities
TRC is an equal opportunities employer. We do not discriminate based on:
- Age, gender, or disability
- Race, religion, or nationality
- Sexual orientation
- Any other protected characteristic
    `,
    sections: ['Interview Stages', 'What We Look For', 'Equal Opportunities'],
    keywords: ['interview', 'selection', 'assessment', 'criteria'],
  },
  {
    id: 'b1',
    title: 'We decide we need someone (Managers)',
    part: 'B',
    chapter: 1,
    content: `
# B1. We Decide We Need Someone (Manager Guide)

## Workforce Planning
When you identify a staffing need:

1. **Complete Workforce Request Form (C1)**
   - Role and responsibilities
   - Qualifications required
   - Full-time or part-time
   - Start date needed
   - Budget approved

2. **Budget Approval**
   - Get Director approval
   - Confirm salary band
   - Calculate costs

3. **Role Description**
   - Clear job title
   - Key responsibilities
   - Reporting structure
   - Required qualifications

## Timeline
- Allow 4-6 weeks for recruitment
- Budget 2-3 weeks for shortlisting
- Allow 1-2 weeks for interviews
    `,
    sections: ['Workforce Planning', 'Budget Approval', 'Role Description', 'Timeline'],
    keywords: ['recruitment', 'hiring', 'workforce', 'planning', 'approval'],
  },
  {
    id: 'b2',
    title: 'Finding the right person (Managers)',
    part: 'B',
    chapter: 2,
    content: `
# B2. Finding the Right Person (Manager Guide)

## Advertising the Role
1. Post on TRC website
2. LinkedIn and professional networks
3. Industry-specific job boards
4. Internal referrals

## Screening Applications
- Use Application Scoring Matrix (C2)
- Short-list top 5-10 candidates
- Contact shortlisted candidates

## Interview Process
- Prepare interview questions
- Use Interview Scoring Matrix (C2)
- Rate candidates consistently
- Check references with C3 form

## Selection Decision
- Compare scores
- Discuss with Director
- Make offer to top candidate
- Prepare offer letter
    `,
    sections: [
      'Advertising the Role',
      'Screening Applications',
      'Interview Process',
      'Selection Decision',
    ],
    keywords: ['recruitment', 'interview', 'selection', 'offer', 'scoring'],
  },
];

export class HandbookService {
  static getAllSections(): HandbookSection[] {
    return handbookContent;
  }

  static getPartSections(part: 'A' | 'B'): HandbookSection[] {
    return handbookContent.filter((s) => s.part === part);
  }

  static searchSections(query: string): HandbookSection[] {
    const q = query.toLowerCase();
    return handbookContent.filter(
      (section) =>
        section.title.toLowerCase().includes(q) ||
        section.content.toLowerCase().includes(q) ||
        section.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }

  static getSectionById(id: string): HandbookSection | undefined {
    return handbookContent.find((s) => s.id === id);
  }
}

export default HandbookService;
