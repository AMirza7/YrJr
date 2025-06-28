export const LEGAL_SECTIONS = {
  IPC: [
    {
      section: "302",
      title: "Murder",
      description:
        "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
    },
    {
      section: "304",
      title: "Culpable homicide not amounting to murder",
      description:
        "Whoever commits culpable homicide not amounting to murder shall be punished with imprisonment for life, or imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine, if the act by which the death is caused is done with the intention of causing death, or of causing such bodily injury as is likely to cause death.",
    },
    {
      section: "354",
      title:
        "Assault or criminal force to woman with intent to outrage her modesty",
      description:
        "Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished with imprisonment of either description for a term which shall not be less than one year but which may extend to five years, and shall also be liable to fine.",
    },
    {
      section: "376",
      title: "Rape",
      description:
        "A man is said to commit 'rape' if he has sexual intercourse with a woman under circumstances falling under any of the six following descriptions...",
    },
    {
      section: "420",
      title: "Cheating and dishonestly inducing delivery of property",
      description:
        "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
    },
  ],
  BNS: [
    {
      section: "103",
      title: "Murder",
      description:
        "Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.",
    },
    {
      section: "105",
      title: "Culpable homicide not amounting to murder",
      description:
        "Whoever commits culpable homicide not amounting to murder shall be punished with imprisonment for life, or imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.",
    },
    {
      section: "74",
      title:
        "Assault or criminal force to woman with intent to outrage her modesty",
      description:
        "Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished with imprisonment of either description for a term which shall not be less than one year but which may extend to five years, and shall also be liable to fine.",
    },
    {
      section: "63",
      title: "Rape",
      description:
        "A man is said to commit 'rape' if he penetrates his penis, to any extent, into the vagina, mouth, urethra or anus of a woman or makes her to do so with him or any other person...",
    },
    {
      section: "318",
      title: "Cheating",
      description:
        "Whoever cheats shall be punished with imprisonment of either description for a term which may extend to one year, or with fine, or with both.",
    },
  ],
};

export const LEGAL_TEMPLATES = [
  {
    id: "1",
    category: "Criminal Law",
    title: "FIR Template",
    description: "First Information Report template for criminal cases",
    content: `FIRST INFORMATION REPORT
Under Section 154 Cr.P.C.

District: [DISTRICT_NAME]
Police Station: [POLICE_STATION]
FIR No: [FIR_NUMBER]
Date: [DATE]
Time: [TIME]

Details of Complainant:
Name: [COMPLAINANT_NAME]
Father's/Husband's Name: [FATHER_HUSBAND_NAME]
Address: [ADDRESS]
Mobile: [MOBILE_NUMBER]

Details of Incident:
Date & Time of Incident: [INCIDENT_DATE_TIME]
Place of Incident: [INCIDENT_PLACE]
Brief Description: [INCIDENT_DESCRIPTION]

Sections Applied: [SECTIONS]

Station House Officer
[POLICE_STATION]`,
  },
  {
    id: "2",
    category: "Civil Law",
    title: "Legal Notice",
    description: "Legal notice template for civil disputes",
    content: `LEGAL NOTICE

To,
[RECIPIENT_NAME]
[RECIPIENT_ADDRESS]

SUBJECT: Legal Notice under Section 80 of Civil Procedure Code, 1908

Dear Sir/Madam,

I, [SENDER_NAME], son/daughter of [FATHER_NAME], resident of [SENDER_ADDRESS], through my advocate [ADVOCATE_NAME], do hereby serve upon you this legal notice for the following reasons:

1. FACTS OF THE CASE:
[CASE_FACTS]

2. CAUSE OF ACTION:
[CAUSE_OF_ACTION]

3. DEMAND:
[DEMANDS]

Take notice that if you fail to comply with the above demands within 30 days of receipt of this notice, my client shall be constrained to initiate appropriate legal proceedings against you for recovery of the amount along with interest and costs.

Yours faithfully,
[ADVOCATE_NAME]
Advocate for [SENDER_NAME]`,
  },
  {
    id: "3",
    category: "Corporate Law",
    title: "Board Resolution",
    description: "Corporate board resolution template",
    content: `BOARD RESOLUTION

[COMPANY_NAME]
CIN: [CIN_NUMBER]

RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS

Date: [DATE]
Time: [TIME]
Venue: [VENUE]

RESOLVED THAT:

[RESOLUTION_CONTENT]

This resolution was passed by the Board of Directors at their meeting held on [DATE].

Chairman: [CHAIRMAN_NAME]
Signature: ________________

Company Secretary: [SECRETARY_NAME]
Signature: ________________`,
  },
];

export const COURT_TYPES = [
  "Supreme Court of India",
  "High Court",
  "District Court",
  "Sessions Court",
  "Magistrate Court",
  "Family Court",
  "Consumer Court",
  "Labour Court",
  "Tribunal",
];

export const CASE_TYPES = [
  "Criminal",
  "Civil",
  "Constitutional",
  "Corporate",
  "Family",
  "Labour",
  "Tax",
  "Consumer",
  "Environmental",
  "Intellectual Property",
];

export const CASE_STATUS = [
  "Filed",
  "Under Investigation",
  "Charge Sheet Filed",
  "Trial in Progress",
  "Arguments Completed",
  "Judgment Reserved",
  "Judgment Delivered",
  "Appeal Filed",
  "Disposed",
  "Closed",
];

export const PRIORITY_LEVELS = [
  { value: "high", label: "High Priority", color: "#ef4444" },
  { value: "medium", label: "Medium Priority", color: "#f59e0b" },
  { value: "low", label: "Low Priority", color: "#10b981" },
];

export const PINBOARD_TAGS = [
  "Urgent",
  "Review",
  "Follow-up",
  "Court Date",
  "Documentation",
  "Client Meeting",
  "Research",
  "Filing",
  "Payment",
  "Appeal",
];
