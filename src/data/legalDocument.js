export const LEGAL_DOCUMENT = {
  brand: 'PAWLLET',
  subtitle: 'TERMS & CONDITIONS  |  PRIVACY POLICY',
  campaign: 'PAWLLET × BUZZ BRIGADES GIVEAWAY',
  meta: 'Effective date: [DATE] | Website: [DOMAIN]',
  intro:
    'This document is a working draft for the PAWLLET × Buzz Brigades giveaway and related registration page. It must be updated after the campaign process is agreed with Buzz Brigades. The service is operated by [FULL LEGAL / BUSINESS NAME], [BUSINESS ADDRESS] ("PAWLLET", "we", "us").',
  sections: [
    {
      id: 'criteria',
      heading: '1. Giveaway entry criteria',
      blocks: [
        { type: 'p', text: 'To be eligible to register, participants will be required to:' },
        {
          type: 'ul',
          items: [
            "Follow PAWLLET's official Instagram account.",
            "Follow Buzz Brigades' official Instagram account.",
            'Publish an Instagram Reel or Story featuring the campaign and using #Pawllet.',
            'Submit the link to the published Reel or Story in the registration form.',
          ],
        },
        {
          type: 'p',
          text: 'Participants must meet the entry criteria before submitting a registration. PAWLLET may verify the submitted links and eligibility. The exact verification method, campaign dates, age and location eligibility, entry limits, winner selection, prize details and announcement process will be confirmed with Buzz Brigades and published in the final campaign rules.',
        },
        {
          type: 'p',
          text: 'The Rules, Steps and Register sections on the website are intentionally pending. They will be completed once the campaign process is finalised. Do not treat this draft as the complete giveaway rules.',
        },
      ],
    },
    {
      id: 'terms',
      heading: '2. Terms & Conditions',
      blocks: [
        { type: 'h4', text: 'Registration and participant responsibility' },
        {
          type: 'p',
          text: "Participants must provide accurate and complete information and ensure that the Instagram link submitted belongs to their own eligible entry. Participants are responsible for complying with Instagram's applicable terms and for having the rights and permissions to share any photos, videos or other content they submit.",
        },
        { type: 'h4', text: 'Use of submitted content' },
        {
          type: 'p',
          text: "Participants retain ownership of their content. Any use by PAWLLET or Buzz Brigades of a participant's Reel, Story, photograph, name or social media handle for marketing or promotional purposes must be explained and authorised separately where required. [CONFIRM WHETHER AND HOW CONTENT WILL BE REPOSTED OR USED.]",
        },
        { type: 'h4', text: 'Campaign administration' },
        {
          type: 'p',
          text: "The campaign will be administered according to the final rules published on the website. PAWLLET may reject or disqualify entries that do not meet the published criteria, contain misleading information or breach the campaign rules. Any changes to dates, prizes or process will be communicated through the campaign's official channels, subject to applicable law.",
        },
        { type: 'h4', text: 'General website terms' },
        {
          type: 'p',
          text: "Do not misuse the website, submit unlawful or infringing material, attempt unauthorised access, or interfere with the website's operation. PAWLLET's name, logo, designs and website materials belong to PAWLLET or its licensors and may not be used without permission. The website and services may be changed or temporarily unavailable.",
        },
        { type: 'h4', text: 'Liability and governing law' },
        {
          type: 'p',
          text: 'To the extent permitted by law, PAWLLET is not responsible for technical interruptions or circumstances outside its reasonable control. Nothing in these Terms excludes rights or liabilities that cannot legally be excluded. These Terms are governed by the laws of India, subject to mandatory consumer rights. Courts at [CITY, STATE] will have jurisdiction where legally permitted.',
        },
        { type: 'h4', text: 'Contact' },
        {
          type: 'p',
          text: 'For questions about the campaign or these Terms: [SUPPORT EMAIL] | [POSTAL ADDRESS].',
        },
      ],
    },
    {
      id: 'privacy',
      heading: '3. Privacy Policy',
      blocks: [
        { type: 'h4', text: 'Information collected through registration' },
        {
          type: 'p',
          text: 'The registration form is expected to collect the following participant information:',
        },
        {
          type: 'ul',
          items: [
            'Name and contact information.',
            "Link to the participant's Instagram Reel or Story.",
            'Pet type, age and breed.',
            "Participant's address.",
          ],
        },
        {
          type: 'p',
          text: 'Only collect the address if it is needed for the campaign, such as eligibility checks or prize delivery. If it is needed only for shortlisted participants or winners, consider collecting it at that later stage instead.',
        },
        { type: 'h4', text: 'How information is used' },
        {
          type: 'p',
          text: 'PAWLLET may use the submitted information to receive and review registrations, verify the stated entry criteria, contact participants about the campaign, administer the giveaway, select and notify winners, arrange prize delivery and address campaign-related queries.',
        },
        { type: 'h4', text: 'Sharing' },
        {
          type: 'p',
          text: 'Access to registration information should be limited to authorised PAWLLET team members and, where necessary to jointly administer the campaign, authorised Buzz Brigades representatives and service providers supporting the registration process. [CONFIRM WHICH PARTY WILL ACCESS EACH DATA FIELD AND NAME ANY FORM / HOSTING PROVIDERS.] Information may also be disclosed where required by law.',
        },
        { type: 'h4', text: 'Retention and security' },
        {
          type: 'p',
          text: 'Information should be retained only for as long as needed to administer the campaign, handle queries or disputes, and meet legal requirements. [SET THE ACTUAL DELETION / RETENTION PERIOD.] PAWLLET will use reasonable safeguards to protect submitted information, but no online system can guarantee absolute security.',
        },
        { type: 'h4', text: 'Participant choices and privacy requests' },
        {
          type: 'p',
          text: "Participants may contact [PRIVACY EMAIL] to ask about their personal information or make a request available under applicable law. PAWLLET may need to verify the requester's identity before responding. Add the designated grievance contact, if applicable: [NAME / DESIGNATION AND CONTACT DETAILS].",
        },
        { type: 'h4', text: 'Cookies and website data' },
        {
          type: 'p',
          text: 'The website may process basic technical information needed to operate and secure the registration page. [ADD DETAILS OF ANY ANALYTICS, COOKIES OR TRACKING TOOLS ACTUALLY USED.]',
        },
      ],
    },
    {
      id: 'finalise',
      heading: '4. Details to finalise after the Buzz Brigades meeting',
      blocks: [
        {
          type: 'ul',
          items: [
            'Campaign start and closing dates, time zone and eligible locations / age group.',
            'Exact content requirements for the Reel or Story, including hashtag and any tagging requirements.',
            'Whether a Story must remain live for a minimum period and what proof is accepted if it expires.',
            'How PAWLLET and Buzz Brigades will verify follows and submitted links.',
            'Entry limits, disqualification rules and whether repeat entries are allowed.',
            'Winner selection method, number of winners, prize details and announcement date.',
            'Prize collection or delivery process and when a full address is required.',
            'Whether participant content, names or handles may be reposted, and the permission process.',
            'Which team members and partner representatives can access registration data, and when it will be deleted.',
          ],
        },
      ],
    },
    {
      id: 'checklist',
      heading: '5. Publication checklist',
      blocks: [
        {
          type: 'p',
          text: 'Before publishing, complete all [bracketed details], confirm the live registration form matches this Policy, identify the legal operator and contact details, confirm data access and retention with Buzz Brigades, and have the final campaign terms and privacy wording reviewed for applicable Indian legal requirements. This is a practical draft, not legal advice.',
        },
      ],
    },
  ],
};

