export interface CheckpointData {
  id: number;
  titleMy: string;
  titleEn: string;
  descriptionMy: string;
  descriptionEn: string;
  whyItMatters: string;
  commonMistake: string;
  howToFix: string[];
  emphasis?: 'high' | 'medium';
}

export const CHECKPOINTS: CheckpointData[] = [
  {
    id: 1,
    titleMy: 'logo / badan zakat rasmi',
    titleEn: 'official zakat body logo',
    descriptionMy:
      'pastikan resit ada logo badan zakat yang sah. kalau takde logo atau logo nampak pelik, mungkin bukan resit rasmi.',
    descriptionEn:
      'ensure the receipt has an official zakat body logo. if no logo or logo looks strange, might not be an official receipt.',
    whyItMatters:
      'LHDN hanya terima resit dari badan zakat yang diiktiraf. kalau badan tak sah, claim tax rebate tak boleh guna.',
    commonMistake:
      'ada orang bayar zakat kat tempat yang tak rasmi, lepas tu wonder kenapa LHDN reject.',
    howToFix: [
      'check logo macam Pusat Pungutan Zakat (PPZ), Lembaga Zakat Selangor (LZS), atau Majlis Agama Islam negeri lain',
      'kalau ragu, google nama badan zakat tu tengok sama ke tidak',
    ],
    emphasis: 'medium',
  },
  {
    id: 2,
    titleMy: 'nama penuh',
    titleEn: 'full name',
    descriptionMy:
      'nama kena sama dengan IC dan tax form. kalau typo sikit pun, LHDN boleh reject.',
    descriptionEn:
      'name must match IC and tax form. even a small typo can cause LHDN to reject.',
    whyItMatters:
      'LHDN match nama dengan rekod cukai. kalau nama tak sama, sistem tak dapat identify you.',
    commonMistake:
      'nama pendek macam "Ahmad" instead of "Ahmad bin Abdullah" - LHDN nak full name.',
    howToFix: [
      'semak nama kat IC - tulis exactly macam kat IC',
      'kalau typo, request resit baru dari badan zakat',
      'jangan guna nickname atau nama panggilan',
    ],
  },
  {
    id: 3,
    titleMy: 'no. kad pengenalan',
    titleEn: 'identity card number',
    descriptionMy:
      'ini yang paling penting! kalau ic number salah, rebate claim confirm reject. double check sekarang sebelum submit tax form.',
    descriptionEn:
      'this is the most important! if ic number is wrong, rebate claim will definitely be rejected. double check now before submitting tax form.',
    whyItMatters:
      'IC number adalah unique identifier. satu digit salah je, LHDN reject terus. then you kena scramble untuk fix.',
    commonMistake:
      'tertukar angka (contoh: 890123 jadi 890132), atau missing digit.',
    howToFix: [
      'ambil IC sekarang, check digit by digit',
      'kira semua digit - mesti ada 12 angka (format: XXXXXX-XX-XXXX)',
      'kalau salah, request resit baru ASAP',
      'screenshot resit yang betul untuk backup',
    ],
    emphasis: 'high', // EMPHASIZED - checkpoint #3
  },
  {
    id: 4,
    titleMy: 'alamat',
    titleEn: 'address',
    descriptionMy:
      'alamat tak perlu 100% match dengan tax form, tapi kena reasonable. jangan alamat lain negara pulak.',
    descriptionEn:
      "address doesn't need to be 100% match with tax form, but must be reasonable. don't put address from another country.",
    whyItMatters:
      'LHDN tengok untuk verify identity. kalau alamat weird sangat, boleh trigger audit.',
    commonMistake:
      'alamat office vs alamat rumah - ni okay. yang tak okay adalah alamat yang tak wujud atau incomplete.',
    howToFix: [
      'pastikan ada poskod',
      'nama bandar & negeri spelled correctly',
      'kalau alamat pendek sangat, better request resit baru dengan alamat lengkap',
    ],
  },
  {
    id: 5,
    titleMy: 'jumlah zakat',
    titleEn: 'zakat amount',
    descriptionMy:
      'amount kena clear dan dalam ringgit malaysia (RM). this is the amount you akan claim as tax rebate.',
    descriptionEn:
      'amount must be clear and in ringgit malaysia (RM). this is the amount you will claim as tax rebate.',
    whyItMatters:
      'ini angka yang LHDN akan allow untuk rebate. kalau tak clear atau typo, claim boleh kena reject.',
    commonMistake:
      'amount blur, takde currency symbol (RM), atau amount written wrongly (contoh: RM100.000 instead of RM1,000.00)',
    howToFix: [
      'pastikan amount ada decimal point (RM 500.00, not RM 500)',
      'cross check dengan bank statement / online receipt',
      'kalau tak sama, request clarification dari badan zakat',
    ],
  },
  {
    id: 6,
    titleMy: 'cara bayaran',
    titleEn: 'payment method',
    descriptionMy:
      'kena stated macam mana you bayar - online banking, cash, cheque, debit card, etc.',
    descriptionEn:
      'must state how you paid - online banking, cash, cheque, debit card, etc.',
    whyItMatters:
      'LHDN nak tau payment legit. payment method helps verify the transaction actually happened.',
    commonMistake:
      'resit tulis "cash" tapi amount RM10,000+ - LHDN boleh question because large cash payments are unusual.',
    howToFix: [
      'check resit ada mention payment method',
      'kalau online, better ada transaction reference number',
      'kalau missing, request updated receipt',
    ],
  },
  {
    id: 7,
    titleMy: 'jenis zakat',
    titleEn: 'type of zakat',
    descriptionMy:
      'resit kena specify jenis zakat - zakat pendapatan, zakat perniagaan, zakat fitrah, zakat saham, etc.',
    descriptionEn:
      'receipt must specify type of zakat - income zakat, business zakat, fitrah, shares, etc.',
    whyItMatters:
      'different types of zakat ada different rules. LHDN nak tau you claim for which type.',
    commonMistake:
      'resit cuma tulis "zakat" tanpa specify jenis. this is not specific enough.',
    howToFix: [
      'common types: zakat pendapatan (most common for employees), zakat perniagaan (for businesses), zakat harta (for wealth)',
      'if resit tak specify, request clarification',
      'zakat fitrah NOT claimable for tax rebate - only zakat pendapatan/perniagaan',
    ],
  },
  {
    id: 8,
    titleMy: 'tarikh',
    titleEn: 'date',
    descriptionMy:
      'tarikh bayaran kena dalam tahun yang you nak claim. for tax year 2024, zakat payment mesti between 1 jan - 31 dec 2024.',
    descriptionEn:
      'payment date must be within the year you want to claim. for tax year 2024, zakat payment must be between 1 jan - 31 dec 2024.',
    whyItMatters:
      'you can only claim zakat rebate for payments made in that tax year. bayar early 2025? cannot claim for year 2024.',
    commonMistake:
      'bayar zakat on 31 dec but resit dated 1 jan next year - this counts as next tax year.',
    howToFix: [
      'check tarikh clearly printed',
      'format should be clear (DD/MM/YYYY or similar)',
      'if date falls in wrong year, you cannot claim for previous tax year',
      'plan ahead - bayar zakat before end dec for current year claim',
    ],
  },
  {
    id: 9,
    titleMy: 'no. siri / rujukan',
    titleEn: 'serial / reference number',
    descriptionMy:
      'resit rasmi mesti ada unique reference number. this proves it\'s an official receipt, not fake.',
    descriptionEn:
      'official receipt must have unique reference number. this proves it\'s an official receipt, not fake.',
    whyItMatters:
      'LHDN boleh trace back to badan zakat using this number. if no number, resit might be questioned.',
    commonMistake:
      'online receipts kadang-kadang takde receipt number - hanya ada transaction ID. this is still okay as long as it\'s unique.',
    howToFix: [
      'look for "No. Resit", "Rujukan", "Receipt No.", or "Transaction ID"',
      'screencap or PDF version better than photo - numbers lebih clear',
      'if truly no number, request official receipt with proper numbering',
    ],
  },
  {
    id: 10,
    titleMy: 'cop "resit rasmi" / tandatangan',
    titleEn: 'official receipt stamp / signature',
    descriptionMy:
      'resit rasmi usually ada stamp atau digital signature. modern receipts might not have physical stamp tapi kena ada indicator yang ia official.',
    descriptionEn:
      'official receipt usually has stamp or digital signature. modern receipts might not have physical stamp but must have indicator that it\'s official.',
    whyItMatters:
      'ini proof of authenticity. receipts without any official marking might be questioned by LHDN.',
    commonMistake:
      'expect physical stamp on all receipts - online receipts biasanya digital signature or system-generated watermark je.',
    howToFix: [
      'physical receipts: should have stamp + signature',
      'online receipts: look for digital signature, watermark, or "Dokumen ini dijana secara digital" statement',
      'PDF receipts downloaded from official portal are acceptable',
      'if in doubt, request clarification from zakat body',
    ],
  },
];

export const STORAGE_KEY = 'opentax_yearend2025_progress_v1';
