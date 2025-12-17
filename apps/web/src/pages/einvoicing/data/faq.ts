/**
 * E-Invoice Frequently Asked Questions
 * Comprehensive FAQ covering all aspects of e-invoicing
 */

export interface FAQ {
  id: string;
  category: FAQCategory;
  question: string;
  questionMalay?: string;
  answer: string;
  relatedQuestions?: string[];
  links?: { label: string; url: string }[];
}

export type FAQCategory =
  | 'general'
  | 'exemptions'
  | 'technical'
  | 'document-types'
  | 'industries'
  | 'penalties'
  | 'implementation';

export const faqCategories: Record<FAQCategory, { label: string; icon: string }> = {
  'general': { label: 'General', icon: 'Info' },
  'exemptions': { label: 'Exemptions', icon: 'ShieldCheck' },
  'technical': { label: 'Technical', icon: 'Code' },
  'document-types': { label: 'Document Types', icon: 'Files' },
  'industries': { label: 'Industries', icon: 'Buildings' },
  'penalties': { label: 'Penalties', icon: 'Warning' },
  'implementation': { label: 'Implementation', icon: 'Wrench' }
};

export const faqs: FAQ[] = [
  // General
  {
    id: 'what-is-einvoice',
    category: 'general',
    question: 'What is e-invoicing in Malaysia?',
    answer: 'E-invoicing is a mandatory digital invoicing system implemented by LHDN (Inland Revenue Board of Malaysia) through the MyInvois platform. It requires businesses to submit invoices electronically in real-time for validation, receiving a Unique Identification Number (UIN) and QR code for each validated invoice. The system aims to improve tax compliance, reduce fraud, and digitize business transactions.',
    links: [
      { label: 'LHDN e-Invoice Overview', url: 'https://www.hasil.gov.my/en/e-invoice/' }
    ]
  },
  {
    id: 'who-must-comply',
    category: 'general',
    question: 'Who must comply with e-invoicing requirements?',
    answer: 'All businesses conducting commercial activities in Malaysia must eventually comply with e-invoicing, based on the phased rollout schedule. This includes Sdn Bhd companies, sole proprietors, partnerships, freelancers, and foreign companies with Malaysia presence. Implementation is phased by annual revenue: >RM100M from Aug 2024, >RM25M from Jan 2025, >RM5M from Jul 2025, and >RM1M from Jan 2026. Businesses below RM1M are exempt (with conditions).'
  },
  {
    id: 'what-is-myinvois',
    category: 'general',
    question: 'What is the MyInvois portal?',
    answer: 'MyInvois is the official e-invoicing portal provided by LHDN for free. It allows businesses to submit, validate, and manage e-invoices either manually through the web portal or via API integration with accounting systems. The portal provides testing (sandbox) and production environments.',
    links: [
      { label: 'MyTax Portal (Access MyInvois)', url: 'https://mytax.hasil.gov.my/' }
    ]
  },
  {
    id: 'b2c-einvoice',
    category: 'general',
    question: 'Do I need to issue e-invoices for B2C transactions (sales to consumers)?',
    answer: 'Yes, B2C transactions are subject to e-invoicing. However, you have two options: (1) Issue individual e-invoices for customers who request them, or (2) Aggregate transactions where customers don\'t request e-invoices into a monthly consolidated e-invoice. The consolidated invoice must be submitted within 7 calendar days after month end, using "General Public" as buyer name and TIN "EI00000000010".'
  },
  {
    id: 'existing-receipts',
    category: 'general',
    question: 'Can I still issue regular receipts to customers?',
    answer: 'Yes, you can still issue normal receipts to customers for B2C transactions. These transactions are then consolidated into a monthly consolidated e-invoice. However, if a customer specifically requests an e-invoice (for business expense claims or tax purposes), you must issue an individual e-invoice and that transaction cannot be included in the consolidated invoice.'
  },

  // Exemptions
  {
    id: 'who-exempt',
    category: 'exemptions',
    question: 'Who is exempt from e-invoicing?',
    answer: 'Exempt persons include: Rulers and Royal Consorts, Federal and State governments, government authorities, local authorities, statutory bodies, and diplomatic/consular personnel. Businesses with annual revenue below RM1 million are also exempt, provided they don\'t have affiliates (parent companies, subsidiaries, or related companies) that exceed this threshold.'
  },
  {
    id: 'revenue-threshold',
    category: 'exemptions',
    question: 'What is the current revenue exemption threshold?',
    answer: 'The current exemption threshold is RM1,000,000 annual revenue. This was raised from RM500,000 on 6 December 2025. Businesses below this threshold are exempt, but must not have shareholders, subsidiaries, related companies, or joint ventures with revenue exceeding this threshold. Phase 5 (originally for businesses <RM500K) has been effectively cancelled.'
  },
  {
    id: 'affiliate-rule',
    category: 'exemptions',
    question: 'How do affiliate companies affect my exemption status?',
    answer: 'If you have a parent company, subsidiary, or related company that has implemented e-invoicing or exceeds the revenue threshold, you may NOT qualify for the revenue exemption. This means a small subsidiary of a large company must comply with e-invoicing even if the subsidiary\'s own revenue is below RM1 million.'
  },
  {
    id: 'once-compliant',
    category: 'exemptions',
    question: 'What happens if my revenue drops after I start e-invoicing?',
    answer: 'Once you are required to implement e-invoicing and have started, you must continue issuing e-invoices even if your revenue subsequently drops below the threshold. There is no "opt-out" once you\'re in the system.'
  },
  {
    id: 'sole-prop-multiple',
    category: 'exemptions',
    question: 'I\'m a sole proprietor with multiple businesses. How is my threshold calculated?',
    answer: 'For sole proprietors, the revenue from ALL owned businesses is combined to determine the threshold. Your phase and start date are set by the highest annual revenue reported across all businesses. If the combined revenue exceeds RM1 million, each individual business must comply with e-invoicing.'
  },

  // Technical
  {
    id: 'einvoice-format',
    category: 'technical',
    question: 'What format are e-invoices submitted in?',
    answer: 'E-invoices must be in UBL 2.1 format, submitted as either XML or JSON files. The format includes 53-55 mandatory data fields covering supplier details, buyer details, item information, tax amounts, and payment terms. Digital signatures are required for authentication.',
    links: [
      { label: 'MyInvois SDK Documentation', url: 'https://sdk.myinvois.hasil.gov.my/' }
    ]
  },
  {
    id: 'submission-methods',
    category: 'technical',
    question: 'What are the ways to submit e-invoices?',
    answer: 'There are two main methods: (1) MyInvois Portal - manual entry through the web interface, suitable for low-volume businesses; (2) API Integration - automated submission from your accounting software, ERP, or POS system, suitable for high-volume businesses. Most accounting software vendors now offer MyInvois integration.'
  },
  {
    id: 'what-is-tin',
    category: 'technical',
    question: 'What is TIN and where do I find it?',
    answer: 'TIN (Tax Identification Number) is a unique identifier assigned by LHDN to all taxpayers. You can find your TIN by logging into the MyTax portal with your company director\'s identification. If you don\'t have a TIN, you can register via the e-Daftar platform accessible through MyTax.'
  },
  {
    id: 'what-is-msic',
    category: 'technical',
    question: 'What is MSIC code and how do I find mine?',
    answer: 'MSIC (Malaysia Standard Industrial Classification) is a 5-digit code representing your business activity. It\'s one of the mandatory fields in e-invoices. You can find your MSIC code on your SSM registration, or look it up on the Department of Statistics Malaysia MSIC code system. For foreign suppliers without MSIC, use "00000".',
    links: [
      { label: 'MSIC Code Lookup', url: 'https://msic.stats.gov.my/bi/' }
    ]
  },
  {
    id: 'validation-process',
    category: 'technical',
    question: 'How does e-invoice validation work?',
    answer: 'When you submit an e-invoice, MyInvois performs real-time validation checking the format, structure, mandatory fields, and data integrity. If valid, you receive a Unique Identification Number (UIN) and QR code. If invalid, you receive error messages to correct. Validated invoices can be shared with buyers in human-readable formats (PDF, JPG).'
  },
  {
    id: 'rejection-cancellation',
    category: 'technical',
    question: 'Can e-invoices be rejected or cancelled?',
    answer: 'Yes, within 72 hours of validation. Buyers can request rejection (supplier must then cancel), and suppliers can cancel their own invoices. Justification is required for rejection/cancellation. After 72 hours, corrections must be made through credit notes or debit notes.'
  },

  // Document Types
  {
    id: 'document-types-explained',
    category: 'document-types',
    question: 'What are the different e-invoice document types?',
    answer: 'There are 5 main document types: (1) Invoice - standard sales document; (2) Credit Note - reduces amount owed (returns, discounts); (3) Debit Note - increases amount (additional charges); (4) Refund Note - documents refunds; (5) Self-Billed Invoice - issued by buyer in specific scenarios. Each serves a different purpose in documenting transactions.'
  },
  {
    id: 'what-is-self-billed',
    category: 'document-types',
    question: 'What is a self-billed e-invoice?',
    answer: 'A self-billed e-invoice is issued by the BUYER instead of the seller. This is required in specific scenarios: payments to foreign suppliers, agent/dealer commissions, rental payments to individual landlords, e-commerce platform payouts, acquisitions from non-business individuals, and several other defined situations. LHDN specifies exactly when self-billing is permitted.'
  },
  {
    id: 'consolidated-invoice',
    category: 'document-types',
    question: 'What is a consolidated e-invoice?',
    answer: 'A consolidated e-invoice is a monthly summary of all B2C transactions where individual customers didn\'t request e-invoices. It must be submitted within 7 calendar days after month end. Use "General Public" as buyer name with TIN "EI00000000010". Consolidated invoices are NOT allowed for B2B, transactions >RM10,000 (from 2026), automotive, aviation, construction materials, and agent payments.'
  },
  {
    id: 'credit-note-usage',
    category: 'document-types',
    question: 'When do I issue a credit note vs refund note?',
    answer: 'Credit Note: Used to reduce the original invoice amount - for returns, discounts, or error corrections. References the original invoice. Refund Note: Used when actually returning money to the customer - for cancelled prepaid orders, deposit returns, or overpayment refunds. Both require proper documentation and reference to original transactions.'
  },

  // Industries
  {
    id: 'industry-exemption',
    category: 'industries',
    question: 'Are any industries exempt from e-invoicing?',
    answer: 'No, there are no industry exemptions. All industries must comply with e-invoicing requirements. However, LHDN has published industry-specific guidelines for Healthcare, Construction, Telecommunications, E-commerce, Petroleum, Insurance/Takaful, Aviation, Tourism, Financial Services, and others, addressing unique scenarios in each sector.'
  },
  {
    id: 'retail-pos',
    category: 'industries',
    question: 'How does e-invoicing work for retail/POS systems?',
    answer: 'Retail businesses can integrate their POS systems with MyInvois via API for automated e-invoice submission. For customers not requesting e-invoices, normal receipts can be issued and aggregated into monthly consolidated e-invoices. Many POS vendors now offer MyInvois integration modules.'
  },
  {
    id: 'construction-requirements',
    category: 'industries',
    question: 'Are there special rules for the construction industry?',
    answer: 'Yes. Construction has specific requirements: progress claims require individual e-invoices regardless of certification status, subcontractor payments (including penalties) need e-invoices, and sales of construction materials under CIDB Act 1994 CANNOT use consolidated e-invoices. Main contractors can maintain current billing cycles but must conform to e-invoice format.'
  },
  {
    id: 'fnb-requirements',
    category: 'industries',
    question: 'How does e-invoicing work for restaurants and F&B?',
    answer: 'F&B outlets can use consolidated e-invoices for walk-in customers who don\'t request individual e-invoices. Catering services to businesses require individual e-invoices. If using delivery platforms (GrabFood, FoodPanda), the platform handles their portion while you handle direct orders. Supplier purchases follow standard B2B e-invoice rules.'
  },

  // Penalties
  {
    id: 'non-compliance-penalty',
    category: 'penalties',
    question: 'What are the penalties for not issuing e-invoices?',
    answer: 'Under Section 120(1)(d) of the Income Tax Act 1967, penalties for non-compliance include fines from RM200 to RM20,000 per instance, and/or imprisonment up to 6 months. Penalties are applied per instance of non-compliance, so multiple violations can accumulate significant fines.'
  },
  {
    id: 'relaxation-period',
    category: 'penalties',
    question: 'What is the relaxation period?',
    answer: 'Each implementation phase includes a 6-month relaxation period where businesses can learn the system without penalty for minor errors. During this period, you should still issue e-invoices, but enforcement is more lenient. Phase 1 relaxation ended 31 Jan 2025, Phase 2 ends 30 Jun 2025, Phase 3 ends 31 Dec 2025, Phase 4 ends 30 Jun 2026.'
  },
  {
    id: 'late-submission',
    category: 'penalties',
    question: 'What if I submit consolidated e-invoices late?',
    answer: 'Consolidated e-invoices must be submitted within 7 calendar days after month end. Late submission may result in penalties during the enforcement period. It\'s advisable to set calendar reminders and establish a monthly process to ensure timely submission.'
  },

  // Implementation
  {
    id: 'how-to-start',
    category: 'implementation',
    question: 'How do I get started with e-invoicing?',
    answer: 'Step 1: Verify you have a TIN via MyTax portal. Step 2: Register on MyInvois portal through MyTax. Step 3: Choose submission method (Portal or API). Step 4: Gather mandatory data (MSIC code, customer TINs). Step 5: Test in sandbox environment. Step 6: Go live and maintain compliance. Tax incentives up to RM50,000/year are available for implementation costs.'
  },
  {
    id: 'software-needed',
    category: 'implementation',
    question: 'Do I need special software for e-invoicing?',
    answer: 'Not necessarily. You can use the free MyInvois Portal for manual or bulk upload submission. However, for high volume or automation, you\'ll want accounting software with MyInvois API integration. Most major accounting software (SQL Account, AutoCount, MYOB, etc.) now offer MyInvois modules. Check with your software vendor.'
  },
  {
    id: 'cost-to-implement',
    category: 'implementation',
    question: 'How much does e-invoicing implementation cost?',
    answer: 'Costs vary: MyInvois Portal is free. Software integration costs depend on your vendor - some offer free updates, others may charge for modules. Implementation consulting and training have additional costs. Good news: You can claim tax deduction up to RM50,000/year for implementation costs (2024-2027), plus accelerated capital allowance for ICT equipment.'
  },
  {
    id: 'sandbox-testing',
    category: 'implementation',
    question: 'How do I test before going live?',
    answer: 'MyInvois provides a Sandbox (testing) environment separate from production. You can access it through the portal to practice submitting test invoices, reviewing validation results, and understanding the workflow without affecting real data. It\'s highly recommended to thoroughly test all your transaction types before going live.'
  },
  {
    id: 'customer-tin-unavailable',
    category: 'implementation',
    question: 'What if my customer doesn\'t provide their TIN?',
    answer: 'For B2B transactions, you should request customer TIN at point of transaction. If a Malaysian individual only provides MyKad number without TIN, use the general TIN "EI00000000010". For B2C where customer doesn\'t need e-invoice, include in consolidated invoice with "General Public" details. Start collecting customer TINs early from major customers.'
  }
];

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(category: FAQCategory): FAQ[] {
  return faqs.filter(f => f.category === category);
}

/**
 * Search FAQs
 */
export function searchFAQs(query: string): FAQ[] {
  const lowerQuery = query.toLowerCase();
  return faqs.filter(f =>
    f.question.toLowerCase().includes(lowerQuery) ||
    f.answer.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get FAQ by ID
 */
export function getFAQById(id: string): FAQ | undefined {
  return faqs.find(f => f.id === id);
}
