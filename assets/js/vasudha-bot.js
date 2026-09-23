/**
 * Vasudha Virtual Assistant - Enterprise B2B Pharma Sales & Technical Engine
 * 100% Native, Offline, Zero Third-Party Tracking
 * Embedded: 265 Commercial Molecules + 30 Comprehensive B2B Technical FAQs
 * Features: Fuzzy Typo-Tolerant Search, Multi-Molecule RFQ Cart, Therapeutic Area Routing
 */

(function () {
  'use strict';

  // 1. EMBEDDED KNOWLEDGE BASE
  const VP_PRODUCTS = [{"name": "Amitriptyline HCl", "category": "apis", "category_label": "API", "cas": "549-18-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "CNS & Neurology", "sub_category": "Tricyclic Antidepressant", "synonyms": ["Elavil", "Endep"], "dmf_status": "USDMF / CEP Available"}, {"name": "Aripiprazole", "category": "apis", "category_label": "API", "cas": "129722-12-9", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "CNS & Neurology", "sub_category": "Atypical Antipsychotic", "synonyms": ["Abilify", "Aristada"], "dmf_status": "USDMF / CEP Available"}, {"name": "Bepotastine Besilate", "category": "apis", "category_label": "API", "cas": "190786-44-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "H1 Receptor Antagonist", "synonyms": ["Bepreve", "Talion"], "dmf_status": "USDMF / PMDA Available"}, {"name": "Cisapride Monohydrate", "category": "apis", "category_label": "API", "cas": "260779-88-2", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Gastroenterology", "sub_category": "Gastroprokinetic 5-HT4 Agonist", "synonyms": ["Prepulsid", "Propulsid"], "dmf_status": "USDMF Available"}, {"name": "Cinnarizine", "category": "apis", "category_label": "API", "cas": "298-57-7", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Allergy & Vestibular", "sub_category": "Antihistamine & Calcium Channel Blocker", "synonyms": ["Stugeron"], "dmf_status": "USDMF / CEP Available"}, {"name": "Clopidogrel Bisulphate", "category": "apis", "category_label": "API", "cas": "120202-66-6", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Cardiovascular", "sub_category": "Antiplatelet / ADP P2Y12 Antagonist", "synonyms": ["Plavix"], "dmf_status": "USDMF / CEP Available"}, {"name": "Cyclobenzaprine HCl", "category": "apis", "category_label": "API", "cas": "6202-23-9", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "CNS & Musculoskeletal", "sub_category": "Centrally Acting Muscle Relaxant", "synonyms": ["Flexeril", "Amrix"], "dmf_status": "USDMF Available"}, {"name": "Cyproheptadine HCl", "category": "apis", "category_label": "API", "cas": "41354-29-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "First-Generation Antihistamine", "synonyms": ["Periactin"], "dmf_status": "USDMF Available"}, {"name": "Dabigatran Etexilate Mesylate", "category": "apis", "category_label": "API", "cas": "872728-81-9", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Cardiovascular", "sub_category": "Direct Thrombin Inhibitor (NOAC)", "synonyms": ["Pradaxa"], "dmf_status": "USDMF / CEP Available"}, {"name": "Desloratadine", "category": "apis", "category_label": "API", "cas": "100643-71-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "Second-Generation Non-Sedating Antihistamine", "synonyms": ["Clarinex", "Aerius"], "dmf_status": "USDMF / CEP Available"}, {"name": "Dexlansoprazole Sesquihydrate", "category": "apis", "category_label": "API", "cas": "313640-86-7", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Gastroenterology", "sub_category": "Proton Pump Inhibitor (PPI)", "synonyms": ["Prevacid", "Zoton"], "dmf_status": "USDMF / CEP Available"}, {"name": "Diatrizoic Acid", "category": "apis", "category_label": "API", "cas": "117-96-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Diagnostic Radiopaque Agent", "sub_category": "Iodinated Contrast Medium", "synonyms": ["Hypaque", "Gastrografin"], "dmf_status": "USDMF / USP Available"}, {"name": "Diatrizoic Acid Dihydrate", "category": "apis", "category_label": "API", "cas": "50978-11-5", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Diagnostic Radiopaque Agent", "sub_category": "Iodinated Contrast Medium", "synonyms": ["Hypaque", "Gastrografin"], "dmf_status": "USDMF / USP Available"}, {"name": "Diatrizoic Sodium", "category": "apis", "category_label": "API", "cas": "737-31-5", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Diagnostic Radiopaque Agent", "sub_category": "Iodinated Contrast Medium", "synonyms": ["Hypaque", "Gastrografin"], "dmf_status": "USDMF / USP Available"}, {"name": "Diatrizoic Meglumine", "category": "apis", "category_label": "API", "cas": "131-49-7", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Diagnostic Radiopaque Agent", "sub_category": "Iodinated Contrast Medium", "synonyms": ["Hypaque", "Gastrografin"], "dmf_status": "USDMF / USP Available"}, {"name": "Dimethyl Fumarate", "category": "apis", "category_label": "API", "cas": "624-49-7", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "CNS & Immunology", "sub_category": "Nrf2 Activator (Multiple Sclerosis)", "synonyms": ["Tecfidera"], "dmf_status": "USDMF / CEP Available"}, {"name": "Diltiazem HCl", "category": "apis", "category_label": "API", "cas": "33286-22-5", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Cardiovascular", "sub_category": "Calcium Channel Blocker (Non-Dihydropyridine)", "synonyms": ["Cardizem", "Tiazac"], "dmf_status": "USDMF / CEP Available"}, {"name": "Domperidone", "category": "apis", "category_label": "API", "cas": "57808-66-9", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Gastroenterology", "sub_category": "Dopamine D2 Antagonist / Gastroprokinetic", "synonyms": ["Motilium"], "dmf_status": "USDMF / CEP Available"}, {"name": "Domperidone Maleate", "category": "apis", "category_label": "API", "cas": "83898-65-1", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Gastroenterology", "sub_category": "Dopamine D2 Antagonist / Gastroprokinetic", "synonyms": ["Motilium"], "dmf_status": "USDMF / CEP Available"}, {"name": "Donepezil HCl", "category": "apis", "category_label": "API", "cas": "120011-70-3", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "CNS & Neurology", "sub_category": "Acetylcholinesterase Inhibitor (Anti-Alzheimer's)", "synonyms": ["Aricept"], "dmf_status": "USDMF / CEP Available"}, {"name": "Donepezil HCl Monohydrate", "category": "apis", "category_label": "API", "cas": "884740-09-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "CNS & Neurology", "sub_category": "Acetylcholinesterase Inhibitor (Anti-Alzheimer's)", "synonyms": ["Aricept"], "dmf_status": "USDMF / CEP Available"}, {"name": "Ebastine", "category": "apis", "category_label": "API", "cas": "90729-43-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "Second-Generation Antihistamine", "synonyms": ["Kestine", "Ebastel"], "dmf_status": "USDMF / CEP Available"}, {"name": "Esomeprazole Magnesium Trihydrate", "category": "apis", "category_label": "API", "cas": "217087-09-7", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Gastroenterology", "sub_category": "Proton Pump Inhibitor (PPI)", "synonyms": ["Nexium"], "dmf_status": "USDMF / CEP / WHO Available"}, {"name": "Esflurbiprofen/(S)-Flurbiprofen", "category": "apis", "category_label": "API", "cas": "51543-39-6", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Musculoskeletal & Pain", "sub_category": "Nonsteroidal Anti-inflammatory Drug (NSAID)", "synonyms": ["Ansaid", "Froben"], "dmf_status": "USDMF / CEP Available"}, {"name": "Febuxostat", "category": "apis", "category_label": "API", "cas": "144060-53-7", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Rheumatology & Gout", "sub_category": "Xanthine Oxidase Inhibitor (Uric Acid Reducer)", "synonyms": ["Uloric", "Adenuric"], "dmf_status": "USDMF / CEP Available"}, {"name": "Fexofenadine HCl", "category": "apis", "category_label": "API", "cas": "153439-40-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "Second-Generation Non-Sedating Antihistamine", "synonyms": ["Allegra", "Telfast"], "dmf_status": "USDMF / CEP Available"}, {"name": "Flurbiprofen", "category": "apis", "category_label": "API", "cas": "5104-49-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Musculoskeletal & Pain", "sub_category": "Nonsteroidal Anti-inflammatory Drug (NSAID)", "synonyms": ["Ansaid", "Froben"], "dmf_status": "USDMF / CEP Available"}, {"name": "Flunarizine Di HCl", "category": "apis", "category_label": "API", "cas": "30484-77-6", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Allergy & Neurology", "sub_category": "Antihistamine & Calcium Channel Blocker", "synonyms": ["Sibelium"], "dmf_status": "USDMF / CEP Available"}, {"name": "Itopride HCl", "category": "apis", "category_label": "API", "cas": "122892-31-3", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Gastroenterology", "sub_category": "Dopamine D2 & Acetylcholinesterase Inhibitor", "synonyms": ["Ganaton"], "dmf_status": "USDMF Available"}, {"name": "Itraconazole", "category": "apis", "category_label": "API", "cas": "84625-61-6", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Anti-infective & Antifungal", "sub_category": "Triazole Antifungal Agent", "synonyms": ["Sporanox"], "dmf_status": "USDMF / CEP Available"}, {"name": "Ketorolac Tromethamine", "category": "apis", "category_label": "API", "cas": "74103-07-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Musculoskeletal & Pain", "sub_category": "Potent NSAID / Analgesic", "synonyms": ["Toradol", "Acular"], "dmf_status": "USDMF / CEP Available"}, {"name": "Lacosamide", "category": "apis", "category_label": "API", "cas": "175481-36-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "CNS & Neurology", "sub_category": "Antiepileptic / Anticonvulsant", "synonyms": ["Vimpat"], "dmf_status": "USDMF / CEP Available"}, {"name": "Loperamide HCl", "category": "apis", "category_label": "API", "cas": "34552-83-5", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Gastroenterology", "sub_category": "Opioid Receptor Agonist / Antidiarrheal", "synonyms": ["Imodium"], "dmf_status": "USDMF / CEP Available"}, {"name": "Loratadine", "category": "apis", "category_label": "API", "cas": "79794-75-5", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "Second-Generation Antihistamine", "synonyms": ["Claritin"], "dmf_status": "USDMF / CEP Available"}, {"name": "Losartan Potassium", "category": "apis", "category_label": "API", "cas": "124750-99-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Cardiovascular", "sub_category": "Angiotensin II Receptor Blocker (ARB)", "synonyms": ["Cozaar"], "dmf_status": "USDMF / CEP Available"}, {"name": "Mebeverine HCl", "category": "apis", "category_label": "API", "cas": "2753-45-9", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Gastroenterology", "sub_category": "Musculotropic Antispasmodic (IBS)", "synonyms": ["Colofac", "Duspatalin"], "dmf_status": "USDMF / CEP Available"}, {"name": "Methoxyphenamine HCl", "category": "apis", "category_label": "API", "cas": "5588-10-3", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Respiratory", "sub_category": "Sympathomimetic Bronchodilator", "synonyms": ["Orthoxine"], "dmf_status": "USDMF Available"}, {"name": "Mirabegron", "category": "apis", "category_label": "API", "cas": "223673-61-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Urology & Overactive Bladder", "sub_category": "Beta-3 Adrenergic Receptor Agonist", "synonyms": ["Myrbetriq", "Betmiga"], "dmf_status": "USDMF / CEP Available"}, {"name": "Nortriptyline HCl", "category": "apis", "category_label": "API", "cas": "894-71-3", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "CNS & Neurology", "sub_category": "Tricyclic Antidepressant", "synonyms": ["Pamelor", "Aventyl"], "dmf_status": "USDMF / CEP Available"}, {"name": "Oxatomide Anhydrous", "category": "apis", "category_label": "API", "cas": "60607-34-3", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "H1 Antihistamine & Mast Cell Stabilizer", "synonyms": ["Tinset"], "dmf_status": "USDMF Available"}, {"name": "Oxcarbazepine", "category": "apis", "category_label": "API", "cas": "28721-07-5", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "CNS & Neurology", "sub_category": "Antiepileptic / Mood Stabilizer", "synonyms": ["Trileptal"], "dmf_status": "USDMF / CEP Available"}, {"name": "Olmesartan Medoxomil", "category": "apis", "category_label": "API", "cas": "144689-63-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Cardiovascular", "sub_category": "Angiotensin II Receptor Blocker (ARB)", "synonyms": ["Benicar", "Olmetec"], "dmf_status": "USDMF / CEP Available"}, {"name": "Pantoprazole Sodium Sesquihydrate", "category": "apis", "category_label": "API", "cas": "164579-32-2", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Gastroenterology", "sub_category": "Proton Pump Inhibitor (PPI)", "synonyms": ["Protonix", "Protium"], "dmf_status": "USDMF / CEP Available"}, {"name": "Pimozide", "category": "apis", "category_label": "API", "cas": "2062-78-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "CNS & Neurology", "sub_category": "Antipsychotic", "synonyms": ["Orap"], "dmf_status": "USDMF Available"}, {"name": "Pimobendan", "category": "apis", "category_label": "API", "cas": "74150-27-9", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Cardiovascular & Veterinary", "sub_category": "Inodilator / Calcium Sensitizer", "synonyms": ["Vetmedin"], "dmf_status": "USDMF / CEP Available"}, {"name": "Pregabalin", "category": "apis", "category_label": "API", "cas": "148553-50-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "CNS & Neurology", "sub_category": "Neuropathic Pain / Anticonvulsant", "synonyms": ["Lyrica"], "dmf_status": "USDMF / CEP Available"}, {"name": "Quetiapine Fumarate", "category": "apis", "category_label": "API", "cas": "111974-72-2", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "CNS & Neurology", "sub_category": "Atypical Antipsychotic", "synonyms": ["Seroquel"], "dmf_status": "USDMF / CEP Available"}, {"name": "Rivaroxaban", "category": "apis", "category_label": "API", "cas": "366789-02-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Cardiovascular", "sub_category": "Factor Xa Inhibitor (NOAC)", "synonyms": ["Xarelto"], "dmf_status": "USDMF / CEP Available"}, {"name": "Rupatadine Fumarate", "category": "apis", "category_label": "API", "cas": "182349-12-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "Dual H1 & PAF Receptor Antagonist", "synonyms": ["Rupafin"], "dmf_status": "USDMF / CEP Available"}, {"name": "Sacubitril Sodium", "category": "apis", "category_label": "API", "cas": "149690-05-1", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Cardiovascular", "sub_category": "Neprilysin Inhibitor (Heart Failure)", "synonyms": ["Entresto"], "dmf_status": "Tech Pack Available"}, {"name": "Tamsulosin HCl", "category": "apis", "category_label": "API", "cas": "106463-17-6", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Urology & Men's Health", "sub_category": "Selective Alpha-1A Adrenoceptor Antagonist (BPH)", "synonyms": ["Flomax"], "dmf_status": "USDMF / CEP Available"}, {"name": "Telmisartan", "category": "apis", "category_label": "API", "cas": "144701-48-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Cardiovascular", "sub_category": "Angiotensin II Receptor Blocker (ARB)", "synonyms": ["Micardis"], "dmf_status": "USDMF / CEP Available"}, {"name": "Trazodone HCl", "category": "apis", "category_label": "API", "cas": "25332-39-2", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "CNS & Neurology", "sub_category": "SARI Antidepressant", "synonyms": ["Desyrel", "Oleptro"], "dmf_status": "USDMF / CEP Available"}, {"name": "Valsartan", "category": "apis", "category_label": "API", "cas": "137862-53-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Cardiovascular", "sub_category": "Angiotensin II Receptor Blocker (ARB)", "synonyms": ["Diovan"], "dmf_status": "USDMF / CEP Available"}, {"name": "Vonoprazan Fumarate", "category": "apis", "category_label": "API", "cas": "881681-01-2", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html", "therapeutic": "Gastroenterology", "sub_category": "Potassium-Competitive Acid Blocker (P-CAB)", "synonyms": ["Voquezna", "Takecab"], "dmf_status": "USDMF / Tech Pack"}, {"name": "Alcaftadine", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Ophthalmology", "sub_category": "H1 Receptor Antagonist (Allergic Conjunctivitis)", "synonyms": ["Lastacaft"], "dmf_status": "USDMF / Tech Pack"}, {"name": "Amitriptyline HCl &amp; Nortriptyline HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "1210-35-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "CNS & Neurology", "sub_category": "Tricyclic Antidepressant", "synonyms": ["Elavil", "Endep"], "dmf_status": "USDMF / CEP Available"}, {"name": "Amitriptyline HCl &amp; Nortriptyline HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "5407-04-5", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "CNS & Neurology", "sub_category": "Tricyclic Antidepressant", "synonyms": ["Elavil", "Endep"], "dmf_status": "USDMF / CEP Available"}, {"name": "Bepotastine Besilate", "category": "intermediates", "category_label": "Intermediate", "cas": "65214-82-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "H1 Receptor Antagonist", "synonyms": ["Bepreve", "Talion"], "dmf_status": "USDMF / PMDA Available"}, {"name": "Bepotastine Besilate", "category": "intermediates", "category_label": "Intermediate", "cas": "27652-89-7", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "H1 Receptor Antagonist", "synonyms": ["Bepreve", "Talion"], "dmf_status": "USDMF / PMDA Available"}, {"name": "Bepotastine Besilate", "category": "intermediates", "category_label": "Intermediate", "cas": "122368-54-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "H1 Receptor Antagonist", "synonyms": ["Bepreve", "Talion"], "dmf_status": "USDMF / PMDA Available"}, {"name": "Bepotastine Besilate", "category": "intermediates", "category_label": "Intermediate", "cas": "5382-16-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "H1 Receptor Antagonist", "synonyms": ["Bepreve", "Talion"], "dmf_status": "USDMF / PMDA Available"}, {"name": "Bepotastine Besilate", "category": "intermediates", "category_label": "Intermediate", "cas": "161558-45-8", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "H1 Receptor Antagonist", "synonyms": ["Bepreve", "Talion"], "dmf_status": "USDMF / PMDA Available"}, {"name": "Cinnarizine and Flunarizine", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Vestibular", "sub_category": "Antihistamine & Calcium Channel Blocker", "synonyms": ["Stugeron"], "dmf_status": "USDMF / CEP Available"}, {"name": "Cyclobenzaprine HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "2222-33-5", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "CNS & Musculoskeletal", "sub_category": "Centrally Acting Muscle Relaxant", "synonyms": ["Flexeril", "Amrix"], "dmf_status": "USDMF Available"}, {"name": "Cyclobenzaprine HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "5407-04-5", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "CNS & Musculoskeletal", "sub_category": "Centrally Acting Muscle Relaxant", "synonyms": ["Flexeril", "Amrix"], "dmf_status": "USDMF Available"}, {"name": "Cyproheptadine HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "2222-33-5", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "First-Generation Antihistamine", "synonyms": ["Periactin"], "dmf_status": "USDMF Available"}, {"name": "Cyproheptadine HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "5570-77-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "First-Generation Antihistamine", "synonyms": ["Periactin"], "dmf_status": "USDMF Available"}, {"name": "Dabigatran Etexilate Mesylate", "category": "intermediates", "category_label": "Intermediate", "cas": "211915-84-3", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular", "sub_category": "Direct Thrombin Inhibitor (NOAC)", "synonyms": ["Pradaxa"], "dmf_status": "USDMF / CEP Available"}, {"name": "Dabigatran Etexilate Mesylate", "category": "intermediates", "category_label": "Intermediate", "cas": "429658-95-7", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular", "sub_category": "Direct Thrombin Inhibitor (NOAC)", "synonyms": ["Pradaxa"], "dmf_status": "USDMF / CEP Available"}, {"name": "Dabigatran Etexilate Mesylate", "category": "intermediates", "category_label": "Intermediate", "cas": "211915-06-9", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular", "sub_category": "Direct Thrombin Inhibitor (NOAC)", "synonyms": ["Pradaxa"], "dmf_status": "USDMF / CEP Available"}, {"name": "Domperidone", "category": "intermediates", "category_label": "Intermediate", "cas": "62780-89-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Gastroenterology", "sub_category": "Dopamine D2 Antagonist / Gastroprokinetic", "synonyms": ["Motilium"], "dmf_status": "USDMF / CEP Available"}, {"name": "Domperidone", "category": "intermediates", "category_label": "Intermediate", "cas": "53786-28-0", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Gastroenterology", "sub_category": "Dopamine D2 Antagonist / Gastroprokinetic", "synonyms": ["Motilium"], "dmf_status": "USDMF / CEP Available"}, {"name": "Donepezil HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "120014-30-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "CNS & Neurology", "sub_category": "Acetylcholinesterase Inhibitor (Anti-Alzheimer's)", "synonyms": ["Aricept"], "dmf_status": "USDMF / CEP Available"}, {"name": "Donepezil HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "4803-74-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "CNS & Neurology", "sub_category": "Acetylcholinesterase Inhibitor (Anti-Alzheimer's)", "synonyms": ["Aricept"], "dmf_status": "USDMF / CEP Available"}, {"name": "Donepezil HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "120014-06-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "CNS & Neurology", "sub_category": "Acetylcholinesterase Inhibitor (Anti-Alzheimer's)", "synonyms": ["Aricept"], "dmf_status": "USDMF / CEP Available"}, {"name": "Ebastine", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "Second-Generation Antihistamine", "synonyms": ["Kestine", "Ebastel"], "dmf_status": "USDMF / CEP Available"}, {"name": "Eprosartan", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular", "sub_category": "Angiotensin II Receptor Blocker (ARB)", "synonyms": ["Teveten"], "dmf_status": "USDMF Available"}, {"name": "Febuxostat", "category": "intermediates", "category_label": "Intermediate", "cas": "161797-99-5", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Rheumatology & Gout", "sub_category": "Xanthine Oxidase Inhibitor (Uric Acid Reducer)", "synonyms": ["Uloric", "Adenuric"], "dmf_status": "USDMF / CEP Available"}, {"name": "Febuxostat", "category": "intermediates", "category_label": "Intermediate", "cas": "161798-01-2", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Rheumatology & Gout", "sub_category": "Xanthine Oxidase Inhibitor (Uric Acid Reducer)", "synonyms": ["Uloric", "Adenuric"], "dmf_status": "USDMF / CEP Available"}, {"name": "Febuxostat", "category": "intermediates", "category_label": "Intermediate", "cas": "161798-02-3", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Rheumatology & Gout", "sub_category": "Xanthine Oxidase Inhibitor (Uric Acid Reducer)", "synonyms": ["Uloric", "Adenuric"], "dmf_status": "USDMF / CEP Available"}, {"name": "Febuxostat", "category": "intermediates", "category_label": "Intermediate", "cas": "161798-03-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Rheumatology & Gout", "sub_category": "Xanthine Oxidase Inhibitor (Uric Acid Reducer)", "synonyms": ["Uloric", "Adenuric"], "dmf_status": "USDMF / CEP Available"}, {"name": "Febuxostat", "category": "intermediates", "category_label": "Intermediate", "cas": "160844-75-7", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Rheumatology & Gout", "sub_category": "Xanthine Oxidase Inhibitor (Uric Acid Reducer)", "synonyms": ["Uloric", "Adenuric"], "dmf_status": "USDMF / CEP Available"}, {"name": "Flunarizine Di-HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Neurology", "sub_category": "Antihistamine & Calcium Channel Blocker", "synonyms": ["Sibelium"], "dmf_status": "USDMF / CEP Available"}, {"name": "Golvatinib &amp; Gilteritinib", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Oncology & Targeted Therapy", "sub_category": "c-Met & FLT3 Receptor Tyrosine Kinase Inhibitor", "synonyms": ["Xospata Target"], "dmf_status": "Tech Pack Available"}, {"name": "Haloperidol", "category": "intermediates", "category_label": "Intermediate", "cas": "3874-54-2", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "CNS & Neurology", "sub_category": "Typical Antipsychotic", "synonyms": ["Haldol"], "dmf_status": "USDMF / CEP Available"}, {"name": "Haloperidol", "category": "intermediates", "category_label": "Intermediate", "cas": "39512-49-7", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "CNS & Neurology", "sub_category": "Typical Antipsychotic", "synonyms": ["Haldol"], "dmf_status": "USDMF / CEP Available"}, {"name": "Indoramin HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular & Urology", "sub_category": "Alpha-1 Adrenoceptor Antagonist", "synonyms": ["Baratol", "Doralese"], "dmf_status": "USDMF Available"}, {"name": "Ketotifen", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Ophthalmology", "sub_category": "H1 Antihistamine & Mast Cell Stabilizer", "synonyms": ["Zaditor"], "dmf_status": "USDMF / CEP Available"}, {"name": "Linagliptin", "category": "intermediates", "category_label": "Intermediate", "cas": "309956-78-3", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Endocrinology & Antidiabetic", "sub_category": "DPP-4 Inhibitor", "synonyms": ["Tradjenta", "Trajenta"], "dmf_status": "USDMF Available"}, {"name": "Linagliptin", "category": "intermediates", "category_label": "Intermediate", "cas": "334618-23-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Endocrinology & Antidiabetic", "sub_category": "DPP-4 Inhibitor", "synonyms": ["Tradjenta", "Trajenta"], "dmf_status": "USDMF Available"}, {"name": "Loperamide HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "39512-49-7", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Gastroenterology", "sub_category": "Opioid Receptor Agonist / Antidiarrheal", "synonyms": ["Imodium"], "dmf_status": "USDMF / CEP Available"}, {"name": "Loperamide HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "37743-18-3", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Gastroenterology", "sub_category": "Opioid Receptor Agonist / Antidiarrheal", "synonyms": ["Imodium"], "dmf_status": "USDMF / CEP Available"}, {"name": "Loperamide HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "956-89-8", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Gastroenterology", "sub_category": "Opioid Receptor Agonist / Antidiarrheal", "synonyms": ["Imodium"], "dmf_status": "USDMF / CEP Available"}, {"name": "Loperamide HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "37742-98-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Gastroenterology", "sub_category": "Opioid Receptor Agonist / Antidiarrheal", "synonyms": ["Imodium"], "dmf_status": "USDMF / CEP Available"}, {"name": "Loratadine &amp; Desloratadine", "category": "intermediates", "category_label": "Intermediate", "cas": "31255-57-9", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "Second-Generation Non-Sedating Antihistamine", "synonyms": ["Clarinex", "Aerius"], "dmf_status": "USDMF / CEP Available"}, {"name": "Loratadine &amp; Desloratadine", "category": "intermediates", "category_label": "Intermediate", "cas": "31251-41-9", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "Second-Generation Non-Sedating Antihistamine", "synonyms": ["Clarinex", "Aerius"], "dmf_status": "USDMF / CEP Available"}, {"name": "Loratadine &amp; Desloratadine", "category": "intermediates", "category_label": "Intermediate", "cas": "38092-89-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "Second-Generation Non-Sedating Antihistamine", "synonyms": ["Clarinex", "Aerius"], "dmf_status": "USDMF / CEP Available"}, {"name": "Loratadine &amp; Desloratadine", "category": "intermediates", "category_label": "Intermediate", "cas": "119770-60-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "Second-Generation Non-Sedating Antihistamine", "synonyms": ["Clarinex", "Aerius"], "dmf_status": "USDMF / CEP Available"}, {"name": "Loratadine &amp; Desloratadine", "category": "intermediates", "category_label": "Intermediate", "cas": "5570-77-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "Second-Generation Non-Sedating Antihistamine", "synonyms": ["Clarinex", "Aerius"], "dmf_status": "USDMF / CEP Available"}, {"name": "Losartan Potassium", "category": "intermediates", "category_label": "Intermediate", "cas": "11479-26-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular", "sub_category": "Angiotensin II Receptor Blocker (ARB)", "synonyms": ["Cozaar"], "dmf_status": "USDMF / CEP Available"}, {"name": "Losartan Potassium", "category": "intermediates", "category_label": "Intermediate", "cas": "83857-96-9", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular", "sub_category": "Angiotensin II Receptor Blocker (ARB)", "synonyms": ["Cozaar"], "dmf_status": "USDMF / CEP Available"}, {"name": "Mirabegron", "category": "intermediates", "category_label": "Intermediate", "cas": "521284-19-5", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Urology & Overactive Bladder", "sub_category": "Beta-3 Adrenergic Receptor Agonist", "synonyms": ["Myrbetriq", "Betmiga"], "dmf_status": "USDMF / CEP Available"}, {"name": "Mirabegron", "category": "intermediates", "category_label": "Intermediate", "cas": "521284-21-9", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Urology & Overactive Bladder", "sub_category": "Beta-3 Adrenergic Receptor Agonist", "synonyms": ["Myrbetriq", "Betmiga"], "dmf_status": "USDMF / CEP Available"}, {"name": "Mirabegron", "category": "intermediates", "category_label": "Intermediate", "cas": "521284-22-0", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Urology & Overactive Bladder", "sub_category": "Beta-3 Adrenergic Receptor Agonist", "synonyms": ["Myrbetriq", "Betmiga"], "dmf_status": "USDMF / CEP Available"}, {"name": "Oxatomide", "category": "intermediates", "category_label": "Intermediate", "cas": "62780-89-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "H1 Antihistamine & Mast Cell Stabilizer", "synonyms": ["Tinset"], "dmf_status": "USDMF Available"}, {"name": "Oxatomide", "category": "intermediates", "category_label": "Intermediate", "cas": "841-77-0", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "H1 Antihistamine & Mast Cell Stabilizer", "synonyms": ["Tinset"], "dmf_status": "USDMF Available"}, {"name": "Pemetrexed acid", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Oncology & Antineoplastic", "sub_category": "Antifolate Antineoplastic Agent", "synonyms": ["Alimta"], "dmf_status": "USDMF / Tech Pack"}, {"name": "Pimozide", "category": "intermediates", "category_label": "Intermediate", "cas": "20662-53-7", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "CNS & Neurology", "sub_category": "Antipsychotic", "synonyms": ["Orap"], "dmf_status": "USDMF Available"}, {"name": "Pimozide", "category": "intermediates", "category_label": "Intermediate", "cas": "3312-04-7", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "CNS & Neurology", "sub_category": "Antipsychotic", "synonyms": ["Orap"], "dmf_status": "USDMF Available"}, {"name": "Prucalopride", "category": "intermediates", "category_label": "Intermediate", "cas": "16771-85-0", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Gastroenterology", "sub_category": "Selective 5-HT4 Receptor Agonist", "synonyms": ["Motegrity", "Resolor"], "dmf_status": "USDMF / CEP Available"}, {"name": "Prucalopride", "category": "intermediates", "category_label": "Intermediate", "cas": "179474-79-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Gastroenterology", "sub_category": "Selective 5-HT4 Receptor Agonist", "synonyms": ["Motegrity", "Resolor"], "dmf_status": "USDMF / CEP Available"}, {"name": "Rifabutin", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Anti-infective & Antibiotic", "sub_category": "Rifamycin Antibiotic (Antimycobacterial)", "synonyms": ["Mycobutin"], "dmf_status": "USDMF / CEP Available"}, {"name": "Rivaroxaban", "category": "intermediates", "category_label": "Intermediate", "cas": "446292-08-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular", "sub_category": "Factor Xa Inhibitor (NOAC)", "synonyms": ["Xarelto"], "dmf_status": "USDMF / CEP Available"}, {"name": "Rivaroxaban", "category": "intermediates", "category_label": "Intermediate", "cas": "898543-06-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular", "sub_category": "Factor Xa Inhibitor (NOAC)", "synonyms": ["Xarelto"], "dmf_status": "USDMF / CEP Available"}, {"name": "Ropivacaine Hydrochloride Monohydrate", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Anesthesia & Pain", "sub_category": "Aminoamide Local Anesthetic", "synonyms": ["Naropin"], "dmf_status": "USDMF / CEP Available"}, {"name": "Rupatadine Fumarate", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "Dual H1 & PAF Receptor Antagonist", "synonyms": ["Rupafin"], "dmf_status": "USDMF / CEP Available"}, {"name": "Selexipag", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular", "sub_category": "Prostacyclin IP Receptor Agonist (PAH)", "synonyms": ["Uptravi"], "dmf_status": "USDMF / Tech Pack"}, {"name": "Tamsulosin HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "112101-81-2", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Urology & Men's Health", "sub_category": "Selective Alpha-1A Adrenoceptor Antagonist (BPH)", "synonyms": ["Flomax"], "dmf_status": "USDMF / CEP Available"}, {"name": "Tamsulosin HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "106133-20-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Urology & Men's Health", "sub_category": "Selective Alpha-1A Adrenoceptor Antagonist (BPH)", "synonyms": ["Flomax"], "dmf_status": "USDMF / CEP Available"}, {"name": "Trazadone", "category": "intermediates", "category_label": "Intermediate", "cas": "6969-71-7", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "CNS & Neurology", "sub_category": "SARI Antidepressant", "synonyms": ["Desyrel"], "dmf_status": "USDMF / CEP Available"}, {"name": "Trazadone", "category": "intermediates", "category_label": "Intermediate", "cas": "52605-52-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "CNS & Neurology", "sub_category": "SARI Antidepressant", "synonyms": ["Desyrel"], "dmf_status": "USDMF / CEP Available"}, {"name": "Tucatinib", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Oncology & Targeted Therapy", "sub_category": "HER2 Tyrosine Kinase Inhibitor", "synonyms": ["Tukysa"], "dmf_status": "Under Development"}, {"name": "Ormeloxifene hydrochloride Intermediate", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Women's Health & Gynecology", "sub_category": "Selective Estrogen Receptor Modulator (SERM)", "synonyms": ["Saheli", "Centron"], "dmf_status": "USDMF Available"}, {"name": "Etodolac Intermediate", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Musculoskeletal & Pain", "sub_category": "COX-2 Selective NSAID Intermediate", "synonyms": ["Lodine"], "dmf_status": "USDMF Available"}, {"name": "Salcaprozate sodium intermediate", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Endocrinology & Oral Drug Delivery", "sub_category": "SNAC Absorption Enhancer (Oral Semaglutide)", "synonyms": ["Rybelsus Carrier"], "dmf_status": "Under Development / Tech Pack"}, {"name": "Prazosin.HCl, Terazosin.HCl, Alfuzosin.HCl, Doxazosin.HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular & Urology", "sub_category": "Alpha-1 Blocker (Antihypertensive & BPH)", "synonyms": ["Minipress"], "dmf_status": "USDMF Available"}, {"name": "Minoxidil, Kopexil, Kopyrrol", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Dermatology & Hair Care", "sub_category": "Vasodilator & Potassium Channel Opener", "synonyms": ["Rogaine"], "dmf_status": "USDMF / CEP Available"}, {"name": "Ticagrelor", "category": "intermediates", "category_label": "Intermediate", "cas": "145783-15-9", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular", "sub_category": "Antiplatelet Agent", "synonyms": ["Brilinta", "Brilique"], "dmf_status": "USDMF / CEP Available"}, {"name": "Ticagrelor", "category": "intermediates", "category_label": "Intermediate", "cas": "1156491-10-9", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular", "sub_category": "Antiplatelet Agent", "synonyms": ["Brilinta", "Brilique"], "dmf_status": "USDMF / CEP Available"}, {"name": "Ticagrelor", "category": "intermediates", "category_label": "Intermediate", "cas": "376608-65-0", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular", "sub_category": "Antiplatelet Agent", "synonyms": ["Brilinta", "Brilique"], "dmf_status": "USDMF / CEP Available"}, {"name": "Isoxsuprine HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular", "sub_category": "Peripheral Vasodilator", "synonyms": ["Vasodilan"], "dmf_status": "USDMF Available"}, {"name": "Voglibose", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Endocrinology & Antidiabetic", "sub_category": "Alpha-Glucosidase Inhibitor", "synonyms": ["Basen", "Volix"], "dmf_status": "USDMF Available"}, {"name": "Mitapivat Sulfate", "category": "intermediates", "category_label": "Intermediate", "cas": "57260-71-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Hematology & Rare Disease", "sub_category": "Pyruvate Kinase Activator (Hemolytic Anemia)", "synonyms": ["Pyrukynd"], "dmf_status": "Tech Pack Available"}, {"name": "Mitapivat Sulfate", "category": "intermediates", "category_label": "Intermediate", "cas": "1260081-86-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Hematology & Rare Disease", "sub_category": "Pyruvate Kinase Activator (Hemolytic Anemia)", "synonyms": ["Pyrukynd"], "dmf_status": "Tech Pack Available"}, {"name": "Mitapivat Sulfate", "category": "intermediates", "category_label": "Intermediate", "cas": "1489-69-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Hematology & Rare Disease", "sub_category": "Pyruvate Kinase Activator (Hemolytic Anemia)", "synonyms": ["Pyrukynd"], "dmf_status": "Tech Pack Available"}, {"name": "Ruxolitinib", "category": "intermediates", "category_label": "Intermediate", "cas": "1146629-83-5", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Oncology & Hematology", "sub_category": "JAK1 / JAK2 Kinase Inhibitor", "synonyms": ["Jakafi", "Jakavi"], "dmf_status": "Under Development"}, {"name": "Ruxolitinib", "category": "intermediates", "category_label": "Intermediate", "cas": "3680-69-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Oncology & Hematology", "sub_category": "JAK1 / JAK2 Kinase Inhibitor", "synonyms": ["Jakafi", "Jakavi"], "dmf_status": "Under Development"}, {"name": "Ruxolitinib", "category": "intermediates", "category_label": "Intermediate", "cas": "2075-45-8", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Oncology & Hematology", "sub_category": "JAK1 / JAK2 Kinase Inhibitor", "synonyms": ["Jakafi", "Jakavi"], "dmf_status": "Under Development"}, {"name": "Venetoclax", "category": "intermediates", "category_label": "Intermediate", "cas": "2979-19-3", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Oncology & Targeted Therapy", "sub_category": "BCL-2 Inhibitor (Leukemia)", "synonyms": ["Venclexta", "Venclyxto"], "dmf_status": "Under Development"}, {"name": "Venetoclax", "category": "intermediates", "category_label": "Intermediate", "cas": "98549-88-3", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Oncology & Targeted Therapy", "sub_category": "BCL-2 Inhibitor (Leukemia)", "synonyms": ["Venclexta", "Venclyxto"], "dmf_status": "Under Development"}, {"name": "Venetoclax", "category": "intermediates", "category_label": "Intermediate", "cas": "1228780-72-0", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Oncology & Targeted Therapy", "sub_category": "BCL-2 Inhibitor (Leukemia)", "synonyms": ["Venclexta", "Venclyxto"], "dmf_status": "Under Development"}, {"name": "Venetoclax", "category": "intermediates", "category_label": "Intermediate", "cas": "1235865-77-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Oncology & Targeted Therapy", "sub_category": "BCL-2 Inhibitor (Leukemia)", "synonyms": ["Venclexta", "Venclyxto"], "dmf_status": "Under Development"}, {"name": "Upadacitinib", "category": "intermediates", "category_label": "Intermediate", "cas": "1869118-25-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Immunology & Rheumatology", "sub_category": "Selective JAK1 Inhibitor", "synonyms": ["Rinvoq"], "dmf_status": "Under Development"}, {"name": "Upadacitinib", "category": "intermediates", "category_label": "Intermediate", "cas": "2095311-49-0", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Immunology & Rheumatology", "sub_category": "Selective JAK1 Inhibitor", "synonyms": ["Rinvoq"], "dmf_status": "Under Development"}, {"name": "Olaparib", "category": "intermediates", "category_label": "Intermediate", "cas": "420846-72-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Oncology & Targeted Therapy", "sub_category": "PARP Inhibitor (BRCA-Mutated)", "synonyms": ["Lynparza"], "dmf_status": "Under Development / Tech Pack"}, {"name": "Olaparib", "category": "intermediates", "category_label": "Intermediate", "cas": "59878-57-8", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Oncology & Targeted Therapy", "sub_category": "PARP Inhibitor (BRCA-Mutated)", "synonyms": ["Lynparza"], "dmf_status": "Under Development / Tech Pack"}, {"name": "Atrasentan", "category": "intermediates", "category_label": "Intermediate", "cas": "178739-03-2", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular & Nephrology", "sub_category": "Endothelin A Receptor Antagonist", "synonyms": [], "dmf_status": "Under Development"}, {"name": "Atrasentan", "category": "intermediates", "category_label": "Intermediate", "cas": "40124-27-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Cardiovascular & Nephrology", "sub_category": "Endothelin A Receptor Antagonist", "synonyms": [], "dmf_status": "Under Development"}, {"name": "Rimegepant Sulphate", "category": "intermediates", "category_label": "Intermediate", "cas": "39713-40-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "CNS & Neurology", "sub_category": "CGRP Receptor Antagonist (Anti-Migraine)", "synonyms": ["Nurtec ODT", "Vydura"], "dmf_status": "Under Development / Tech Pack"}, {"name": "Rimegepant Sulphate", "category": "intermediates", "category_label": "Intermediate", "cas": "1190363-50-8", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "CNS & Neurology", "sub_category": "CGRP Receptor Antagonist (Anti-Migraine)", "synonyms": ["Nurtec ODT", "Vydura"], "dmf_status": "Under Development / Tech Pack"}, {"name": "Rimegepant Sulphate", "category": "intermediates", "category_label": "Intermediate", "cas": "781649-84-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "CNS & Neurology", "sub_category": "CGRP Receptor Antagonist (Anti-Migraine)", "synonyms": ["Nurtec ODT", "Vydura"], "dmf_status": "Under Development / Tech Pack"}, {"name": "GalNAc", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html", "therapeutic": "Biotechnology & Targeted Delivery", "sub_category": "N-Acetylgalactosamine Oligonucleotide Ligand", "synonyms": ["siRNA Delivery"], "dmf_status": "Tech Pack Available"}, {"name": "Duloxetine HCl", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "136434-34-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "CNS & Neurology", "sub_category": "SNRI Antidepressant", "synonyms": ["Cymbalta", "Yentreve"], "dmf_status": "USDMF / CEP Available"}, {"name": "Esomeprazole", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "217087-09-7", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Proton Pump Inhibitor (PPI)", "synonyms": ["Nexium"], "dmf_status": "USDMF / CEP / WHO Available"}, {"name": "Esomeprazole (Micro/MUPS)", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "217087-09-7", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Proton Pump Inhibitor (PPI)", "synonyms": ["Nexium"], "dmf_status": "USDMF / CEP / WHO Available"}, {"name": "Lansoprazole", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "103577-45-3", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Proton Pump Inhibitor (PPI)", "synonyms": ["Prevacid", "Zoton"], "dmf_status": "USDMF / CEP Available"}, {"name": "Lansoprazole (Micro Pellets)", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "103577-45-3", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Proton Pump Inhibitor (PPI)", "synonyms": ["Prevacid", "Zoton"], "dmf_status": "USDMF / CEP Available"}, {"name": "Omeprazole", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "73590-58-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Proton Pump Inhibitor (PPI)", "synonyms": ["Prilosec", "Losec"], "dmf_status": "USDMF / CEP / WHO Available"}, {"name": "Omeprazole (Micro Pellets)", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "73590-58-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Proton Pump Inhibitor (PPI)", "synonyms": ["Prilosec", "Losec"], "dmf_status": "USDMF / CEP / WHO Available"}, {"name": "Pantoprazole", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "102625-70-7", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Proton Pump Inhibitor (PPI)", "synonyms": ["Protonix", "Protium"], "dmf_status": "USDMF / CEP Available"}, {"name": "Pancreatin", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "8049-47-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Pancreatic Enzyme Replacement", "synonyms": ["Creon", "Pancreaze"], "dmf_status": "USDMF Available"}, {"name": "Rabeprazole", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "117976-90-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Proton Pump Inhibitor (PPI)", "synonyms": ["Aciphex", "Pariet"], "dmf_status": "USDMF / CEP Available"}, {"name": "Diclofenac Sodium", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "15307-79-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Musculoskeletal & Pain", "sub_category": "Nonsteroidal Anti-inflammatory Drug (NSAID)", "synonyms": ["Voltaren", "Cataflam"], "dmf_status": "USDMF / CEP Available"}, {"name": "Domperidone", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "57808-66-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Dopamine D2 Antagonist / Gastroprokinetic", "synonyms": ["Motilium"], "dmf_status": "USDMF / CEP Available"}, {"name": "Venlafaxine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "93413-69-5", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "CNS & Neurology", "sub_category": "SNRI Antidepressant", "synonyms": ["Effexor"], "dmf_status": "USDMF / CEP Available"}, {"name": "Aprepitant", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "170729-80-3", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology & Oncology", "sub_category": "NK1 Receptor Antagonist (Antiemetic)", "synonyms": ["Emend"], "dmf_status": "USDMF / CEP Available"}, {"name": "Dabigatran", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "211915-06-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Cardiovascular", "sub_category": "Direct Thrombin Inhibitor (NOAC)", "synonyms": ["Pradaxa"], "dmf_status": "USDMF / CEP Available"}, {"name": "Diclofenac Sodium", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "15307-79-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Musculoskeletal & Pain", "sub_category": "Nonsteroidal Anti-inflammatory Drug (NSAID)", "synonyms": ["Voltaren", "Cataflam"], "dmf_status": "USDMF / CEP Available"}, {"name": "Domperidone", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "57808-66-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Dopamine D2 Antagonist / Gastroprokinetic", "synonyms": ["Motilium"], "dmf_status": "USDMF / CEP Available"}, {"name": "Itraconazole", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "84625-61-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Anti-infective & Antifungal", "sub_category": "Triazole Antifungal Agent", "synonyms": ["Sporanox"], "dmf_status": "USDMF / CEP Available"}, {"name": "Orlistat", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "96829-58-2", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Metabolic & Weight Management", "sub_category": "Gastric & Pancreatic Lipase Inhibitor", "synonyms": ["Xenical", "Alli"], "dmf_status": "USDMF Available"}, {"name": "Clarithromycin Taste Masked Micro Pellets, Granules", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "81103-11-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Anti-infective & Antibiotic", "sub_category": "Macrolide Antibiotic", "synonyms": ["Biaxin", "Klaricid"], "dmf_status": "USDMF / CEP Available"}, {"name": "Diclofenac Sodium", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "15307-79-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Musculoskeletal & Pain", "sub_category": "Nonsteroidal Anti-inflammatory Drug (NSAID)", "synonyms": ["Voltaren", "Cataflam"], "dmf_status": "USDMF / CEP Available"}, {"name": "Domperidone", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "57808-66-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Dopamine D2 Antagonist / Gastroprokinetic", "synonyms": ["Motilium"], "dmf_status": "USDMF / CEP Available"}, {"name": "Itopride HCl", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "122892-31-3", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Dopamine D2 & Acetylcholinesterase Inhibitor", "synonyms": ["Ganaton"], "dmf_status": "USDMF Available"}, {"name": "Levosulpiride", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "23672-07-3", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology & CNS", "sub_category": "Prokinetic / Antipsychotic", "synonyms": ["Levopraid"], "dmf_status": "USDMF Available"}, {"name": "Mebeverine HCl", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "2753-45-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Musculotropic Antispasmodic (IBS)", "synonyms": ["Colofac", "Duspatalin"], "dmf_status": "USDMF / CEP Available"}, {"name": "Memantine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "19982-08-2", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "CNS & Neurology", "sub_category": "NMDA Receptor Antagonist (Anti-Alzheimer's)", "synonyms": ["Namenda", "Ebixa"], "dmf_status": "USDMF / CEP Available"}, {"name": "Mesalamine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "89-57-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "5-Aminosalicylic Acid (IBD/Ulcerative Colitis)", "synonyms": ["Asacol", "Pentasa", "Lialda"], "dmf_status": "USDMF / CEP Available"}, {"name": "Mesalamine (Premix/Granules)", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "89-57-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "5-Aminosalicylic Acid (IBD/Ulcerative Colitis)", "synonyms": ["Asacol", "Pentasa", "Lialda"], "dmf_status": "USDMF / CEP Available"}, {"name": "Nicardipine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "55985-32-5", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Cardiovascular", "sub_category": "Dihydropyridine Calcium Channel Blocker", "synonyms": ["Cardene"], "dmf_status": "USDMF / CEP Available"}, {"name": "Tamsulosin HCl", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "106463-17-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Urology & Men's Health", "sub_category": "Selective Alpha-1A Adrenoceptor Antagonist (BPH)", "synonyms": ["Flomax"], "dmf_status": "USDMF / CEP Available"}, {"name": "Vincamine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "1617-90-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Cardiovascular", "sub_category": "Peripheral Vasodilator", "synonyms": ["Oxygeron"], "dmf_status": "USDMF Available"}, {"name": "Dexlansoprazole", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "138530-94-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Proton Pump Inhibitor (PPI)", "synonyms": ["Prevacid", "Zoton"], "dmf_status": "USDMF / CEP Available"}, {"name": "Barnidipine hydrochloride", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "104757-53-1", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Cardiovascular", "sub_category": "Calcium Channel Blocker", "synonyms": ["Vasexten"], "dmf_status": "USDMF Available"}, {"name": "Chlorpheneramine Maleate", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "113-92-8", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "First-Generation Antihistamine", "synonyms": ["Chlor-Trimeton"], "dmf_status": "USDMF / CEP Available"}, {"name": "Cinitapride", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "66564-14-5", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Gastroprokinetic & Anti-emetic", "synonyms": ["Cintapro", "Pemix"], "dmf_status": "USDMF Available"}, {"name": "Clarithromycin", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "81103-11-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Anti-infective & Antibiotic", "sub_category": "Macrolide Antibiotic", "synonyms": ["Biaxin", "Klaricid"], "dmf_status": "USDMF / CEP Available"}, {"name": "Everolimus", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "159351-69-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Oncology & Immunosuppression", "sub_category": "mTOR Kinase Inhibitor", "synonyms": ["Afinitor", "Zortress"], "dmf_status": "USDMF / Tech Pack"}, {"name": "Flurbiprofen", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "5104-49-4", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Musculoskeletal & Pain", "sub_category": "Nonsteroidal Anti-inflammatory Drug (NSAID)", "synonyms": ["Ansaid", "Froben"], "dmf_status": "USDMF / CEP Available"}, {"name": "Ketoprofen", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "22071-15-4", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Musculoskeletal & Pain", "sub_category": "Nonsteroidal Anti-inflammatory Drug (NSAID)", "synonyms": ["Orudis", "Oruvail"], "dmf_status": "USDMF / CEP Available"}, {"name": "Levomilnacipran", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "96847-55-1", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "CNS & Neurology", "sub_category": "SNRI Antidepressant", "synonyms": ["Fetzima"], "dmf_status": "Tech Pack / USDMF"}, {"name": "Linaclotide", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "851199-59-2", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Guanylate Cyclase-C Agonist (IBS-C)", "synonyms": ["Linzess", "Constella"], "dmf_status": "Under Development"}, {"name": "Memantine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "19982-08-2", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "CNS & Neurology", "sub_category": "NMDA Receptor Antagonist (Anti-Alzheimer's)", "synonyms": ["Namenda", "Ebixa"], "dmf_status": "USDMF / CEP Available"}, {"name": "Mesalamine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "89-57-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "5-Aminosalicylic Acid (IBD/Ulcerative Colitis)", "synonyms": ["Asacol", "Pentasa", "Lialda"], "dmf_status": "USDMF / CEP Available"}, {"name": "Metoprolol Succinate MUPS", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "98455-82-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Cardiovascular", "sub_category": "Selective Beta-1 Blocker", "synonyms": ["Toprol-XL", "Lopressor"], "dmf_status": "USDMF / CEP Available"}, {"name": "Nicardipine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "55985-32-5", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Cardiovascular", "sub_category": "Dihydropyridine Calcium Channel Blocker", "synonyms": ["Cardene"], "dmf_status": "USDMF / CEP Available"}, {"name": "Pancreatin", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "8049-47-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Pancreatic Enzyme Replacement", "synonyms": ["Creon", "Pancreaze"], "dmf_status": "USDMF Available"}, {"name": "Peppermint oil", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "8006-90-4", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Gastroenterology", "sub_category": "Antispasmodic Essential Oil (IBS)", "synonyms": ["Colpermin"], "dmf_status": "Tech Pack Available"}, {"name": "Sirolimus", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "53123-88-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Immunosuppression & Transplant", "sub_category": "mTOR Inhibitor (Rapamycin)", "synonyms": ["Rapamune"], "dmf_status": "USDMF Available"}, {"name": "Tacrolimus", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "104987-11-3", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Immunosuppression & Transplant", "sub_category": "Calcineurin Inhibitor (Macrolide)", "synonyms": ["Prograf", "Protopic"], "dmf_status": "USDMF / CEP Available"}, {"name": "Tolterodine Tartrate", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "124937-52-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Urology & Overactive Bladder", "sub_category": "Muscarinic Receptor Antagonist (Anticholinergic)", "synonyms": ["Detrol"], "dmf_status": "USDMF / CEP Available"}, {"name": "Trospium chloride", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "10405-02-4", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Urology & Overactive Bladder", "sub_category": "Quaternary Ammonium Antimuscarinic", "synonyms": ["Sanctura", "Regurin"], "dmf_status": "USDMF Available"}, {"name": "Viloxazine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "46817-91-8", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "CNS & Neurology", "sub_category": "Selective Norepinephrine Reuptake Inhibitor", "synonyms": ["Qelbree"], "dmf_status": "Tech Pack Available"}, {"name": "Xanomeline Tartrate", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "141064-23-5", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "CNS & Neurology", "sub_category": "Muscarinic Acetylcholine Receptor Agonist", "synonyms": ["Cobenfy"], "dmf_status": "Under Development"}, {"name": "Carbonyl Iron", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "7439-89-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Nutrition & Hematology", "sub_category": "Elemental Iron Dietary Mineral", "synonyms": [], "dmf_status": "FCC / USP Grade"}, {"name": "Zinc Sulphate", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "7446-20-0", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Nutrition & Mineral", "sub_category": "Essential Trace Mineral", "synonyms": [], "dmf_status": "USP / BP Grade"}, {"name": "Folic Acid", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "59-30-3", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html", "therapeutic": "Nutrition & Hematology", "sub_category": "B-Complex Vitamin (Vitamin B9)", "synonyms": [], "dmf_status": "USP / Ph.Eur Available"}, {"name": "N-Methyl-4-piperidone", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "N-Methyl-4-hydroxypiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "N-Methyl-4-chloropiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "N-Methyl-4-chloropiperidine HCl", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "N-Methyl-4-aminopiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "N-Carbethoxy-4-piperidone", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "N-Carbethoxy-4-hydroxypiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "N-Carbethoxy-4-aminopiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "N-Benzyl-4-piperidone", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "N-Benzyl-4-hydroxypiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "4-Benzyl-4-hydroxypiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "N-Benzyl-4-chloropiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "N-Benzyl-4-aminopiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "4-(2-Keto-benzimidazolinyl) piperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "4-Piperidone ethylene ketal", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "4-Hydroxypiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "4-Aminopiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "4-Piperidinopiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "1,4&#x27;-Bipiperidine dihydrochloride", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "N-Piperidin-4-ylbenzamide", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "N-Isobutyl-4-piperidone", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "1-(4-Chlorobenzhydryl)-piperazine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Specialty Chemistry & Intermediates", "sub_category": "Custom Synthesis Fine Chemical", "synonyms": [], "dmf_status": "Technical Package Available"}, {"name": "N-Ethyl-4-piperidone", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "1,3-Dimethyl-4-piperidone", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "(R)-(-)-3-Aminopiperidine dihydrochloride", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "N-Propyl-4-piperidone", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "3-Chloromethyl-5-Methylpyridine Hydrochloride", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Specialty Intermediates", "sub_category": "Substituted Pyridine Building Block", "synonyms": [], "dmf_status": "Commercial Grade"}, {"name": "4-(4-Chlorophenyl)-4-hydroxypiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "4-(4-Bromophenyl)-4-hydroxypiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "4-Phenyl-4-hydroxypiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "4-Phenylpiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html", "therapeutic": "Piperidone Chemistry & Fine Intermediates", "sub_category": "Advanced Heterocyclic Building Block / Precursor", "synonyms": ["Piperidone derivative", "CRAMS building block"], "dmf_status": "Technical Data Package Available"}, {"name": "Bempedoic acid", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Cardiovascular", "sub_category": "ATP Citrate Lyase Inhibitor (Cholesterol)", "synonyms": ["Nexletol", "Nilemdo"], "dmf_status": "Under Development / Tech Pack"}, {"name": "Bilastine", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Allergy & Antihistaminic", "sub_category": "Second-Generation Non-Sedating Antihistamine", "synonyms": ["Bilaxten", "Blexten"], "dmf_status": "USDMF / CEP Available"}, {"name": "Calcium Folinate (Leucovorin calcium)", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Oncology Adjunct & Nutrition", "sub_category": "Folinic Acid / Chemotherapy Rescue", "synonyms": ["Leucovorin"], "dmf_status": "USDMF Available"}, {"name": "Dapagliflozin Propanediol", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Endocrinology & Antidiabetic", "sub_category": "SGLT2 Inhibitor", "synonyms": ["Farxiga", "Forxiga"], "dmf_status": "USDMF / CEP Available"}, {"name": "Dexlansoprazole Sesquihydrate", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Gastroenterology", "sub_category": "Proton Pump Inhibitor (PPI)", "synonyms": ["Prevacid", "Zoton"], "dmf_status": "USDMF / CEP Available"}, {"name": "Dexlansoprazole Anhydrous", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Gastroenterology", "sub_category": "Proton Pump Inhibitor (PPI)", "synonyms": ["Prevacid", "Zoton"], "dmf_status": "USDMF / CEP Available"}, {"name": "Edoxaban Tosylate", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Cardiovascular", "sub_category": "Factor Xa Inhibitor (NOAC)", "synonyms": ["Savaysa", "Lixiana"], "dmf_status": "Under Development / USDMF"}, {"name": "Eflornithine hydrochloride monohydrate", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Dermatology & Oncology", "sub_category": "Ornithine Decarboxylase Inhibitor", "synonyms": ["Vaniqa", "Iwilfin"], "dmf_status": "Under Development"}, {"name": "Empagliflozin", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Endocrinology & Antidiabetic", "sub_category": "SGLT2 Inhibitor", "synonyms": ["Jardiance"], "dmf_status": "USDMF / CEP Available"}, {"name": "Fosfomycin Tromethamol", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Anti-infective & Antibiotic", "sub_category": "Phosphonic Acid Derivative Antibiotic", "synonyms": ["Monurol"], "dmf_status": "USDMF / CEP Available"}, {"name": "Isoxsuprine HCl", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Cardiovascular", "sub_category": "Peripheral Vasodilator", "synonyms": ["Vasodilan"], "dmf_status": "USDMF Available"}, {"name": "Lactulose Crystals", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Gastroenterology", "sub_category": "Osmotic Laxative / Hepatic Encephalopathy", "synonyms": ["Duphalac", "Kristalose"], "dmf_status": "USDMF / CEP Available"}, {"name": "L-methyl Folate Calcium", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Nutrition & Psychiatry", "sub_category": "Active Bioavailable Folate", "synonyms": ["Deplin"], "dmf_status": "USDMF Available"}, {"name": "Maropitant", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Gastroenterology & Veterinary", "sub_category": "NK1 Receptor Antagonist (Veterinary Antiemetic)", "synonyms": ["Cerenia"], "dmf_status": "USDMF / Tech Pack"}, {"name": "Maropitant Citrate", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Gastroenterology & Veterinary", "sub_category": "NK1 Receptor Antagonist (Veterinary Antiemetic)", "synonyms": ["Cerenia"], "dmf_status": "USDMF / Tech Pack"}, {"name": "Ormeloxifene HCl", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Women's Health & Gynecology", "sub_category": "Selective Estrogen Receptor Modulator (SERM)", "synonyms": ["Saheli", "Centron"], "dmf_status": "USDMF Available"}, {"name": "Pentosan Polysulfate Sodium", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Urology", "sub_category": "Semi-synthetic Glycosaminoglycan (Interstitial Cystitis)", "synonyms": ["Elmiron"], "dmf_status": "USDMF Available"}, {"name": "Propyphenazone", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Musculoskeletal & Pain", "sub_category": "Pyrazolone Analgesic & Antipyretic", "synonyms": [], "dmf_status": "USDMF Available"}, {"name": "Rimegepant Sulfate Hydrate", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "CNS & Neurology", "sub_category": "CGRP Receptor Antagonist (Anti-Migraine)", "synonyms": ["Nurtec ODT", "Vydura"], "dmf_status": "Under Development / Tech Pack"}, {"name": "Ropivacaine Hydrochloride monohydrate", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Anesthesia & Pain", "sub_category": "Aminoamide Local Anesthetic", "synonyms": ["Naropin"], "dmf_status": "USDMF / CEP Available"}, {"name": "Trofinetide", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "CNS & Neurology", "sub_category": "Synthetic Tripeptide (Rett Syndrome)", "synonyms": ["Daybue"], "dmf_status": "Under Development"}, {"name": "Tyloxapol", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Pulmonary & Ophthalmic", "sub_category": "Non-ionic Liquid Polymer Surfactant", "synonyms": ["Triton WR-1339"], "dmf_status": "USP / BP Available"}, {"name": "Ursodiol", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Gastroenterology", "sub_category": "Bile Acid / Hepatoprotective", "synonyms": ["Actigall", "Urso"], "dmf_status": "USDMF / CEP Available"}, {"name": "Voglibose", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Endocrinology & Antidiabetic", "sub_category": "Alpha-Glucosidase Inhibitor", "synonyms": ["Basen", "Volix"], "dmf_status": "USDMF Available"}, {"name": "Vitamin K2-7 (Menaquinone-7)", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html", "therapeutic": "Nutrition & Bone Health", "sub_category": "Menaquinone-7 (Osteoporosis & Vascular Health)", "synonyms": [], "dmf_status": "Pharma Grade"}];

  const VP_FAQS = [{"Question": "What products does Vasudha Pharma manufacture?", "Answer": "Vasudha Pharma Chem Limited is a leading global manufacturer specializing in 4 core categories: 1) Active Pharmaceutical Ingredients (APIs), 2) Pharmaceutical Pellets & MUPS, 3) Advanced Intermediates, and 4) Piperidone Derivatives. With over 265 commercial molecules, our portfolio covers diverse therapeutic areas including CNS & Neurology, Cardiovascular, Gastroenterology, Allergy, and Pain Management.", "Keywords": "products, portfolio, catalog, molecules, apis, pellets, mups, intermediates, piperidone, list, overview"}, {"Question": "What APIs are manufactured by Vasudha Pharma?", "Answer": "Our commercial API portfolio includes major molecules such as Amitriptyline HCl, Aripiprazole, Bepotastine Besilate, Clopidogrel Bisulphate, Cyclobenzaprine HCl, Dabigatran Etexilate Mesylate, Desloratadine, Diltiazem HCl, Donepezil HCl, Fexofenadine HCl, Mesalamine, Tamsulosin HCl, and many others. We hold USDMF and CEP filings across our key APIs.", "Keywords": "api, active pharmaceutical ingredient, amitriptyline, aripiprazole, bepotastine, clopidogrel, dabigatran, desloratadine, diltiazem, donepezil, tamsulosin"}, {"Question": "Does Vasudha Pharma offer Pellets & MUPS?", "Answer": "Yes, Vasudha Pharma produces high-precision Pellets and MUPS (Multi-Unit Particulate Systems) with controlled release, enteric coated, delayed release, and sustained release profiles. Key pellet formulations include Esomeprazole, Lansoprazole, Omeprazole, Pantoprazole, Rabeprazole, Duloxetine HCl, Itraconazole, and Pancreatin.", "Keywords": "pellets, mups, micro pellets, enteric coated, sustained release, delayed release, omeprazole, esomeprazole, pantoprazole, rabeprazole, duloxetine, itraconazole"}, {"Question": "What are Vasudha Pharma's capabilities in Piperidone chemistry?", "Answer": "Vasudha Pharma is one of the world's largest manufacturers of Piperidone Derivatives. Our world-scale dedicated capacity produces N-Methyl-4-piperidone, N-Carbethoxy-4-piperidone, N-Benzyl-4-piperidone, 4-Hydroxypiperidine, 4-Piperidone ethylene ketal, and diverse substituted piperidines supporting global innovators and generic manufacturers.", "Keywords": "piperidone, piperidine, n-methyl-4-piperidone, n-benzyl-4-piperidone, n-carbethoxy-4-piperidone, 4-hydroxypiperidine, heterocyclic, building blocks"}, {"Question": "Does Vasudha Pharma offer Custom Synthesis and CDMO / CMO services?", "Answer": "Yes. Vasudha Pharma provides end-to-end Contract Development and Manufacturing Organization (CDMO / CMO) and custom synthesis services through our state-of-the-art Vikasith R&D Centre. Services include route scouting, process optimization, scale-up from grams to metric tons, technology transfer, and cGMP commercial manufacturing.", "Keywords": "cdmo, cmo, custom synthesis, contract manufacturing, cram, crams, route scouting, process development, scale-up, vikasith"}, {"Question": "What regulatory approvals and accreditations does Vasudha Pharma hold?", "Answer": "Vasudha Pharma's manufacturing facilities operate in strict compliance with current Good Manufacturing Practices (cGMP) and are regularly inspected and approved by leading global regulatory authorities including: US FDA (USA), EDQM / EMA (Europe), PMDA (Japan), WHO-GMP, KFDA (Korea), COFEPRIS (Mexico), and ANVISA (Brazil).", "Keywords": "regulatory, approvals, usfda, fda, edqm, ema, pmda, who-gmp, kfda, cofepris, anvisa, cgmp, gmp, inspections, audits"}, {"Question": "Where are Vasudha Pharma's manufacturing units located?", "Answer": "Vasudha Pharma operates multi-purpose manufacturing campuses across Andhra Pradesh and Telangana, India: Unit-1 (Jeedimetla, Hyderabad), Unit-2 & Unit-5 (Jawaharlal Nehru Pharma City - JNPC, Parawada, Visakhapatnam), and Unit-3 (APIIC-IALA, Bonthapally). Our centralized R&D Innovation Centre (Vikasith) is located in Pragathi Nagar, Hyderabad.", "Keywords": "manufacturing, units, facilities, locations, plant, vizag, visakhapatnam, hyderabad, jeedimetla, parawada, jnpc, bonthapally"}, {"Question": "What recent awards has Vasudha Pharma received?", "Answer": "In 2026, Vasudha Pharma Unit-2 (Visakhapatnam / JNPC) received the prestigious Best Management Award from the Andhra Pradesh State Government for exceptional labor welfare, occupational health and safety (OHSAS 18001), eco-sustainability, and ISO 14001 environmental stewardship.", "Keywords": "awards, recognition, best management award, 2026, honors, government, achievement"}, {"Question": "How can I request a commercial quotation or product sample?", "Answer": "You can request a commercial price quotation (RFQ) or analytical/pilot sample directly by clicking the '📋 Request a Quote' chip right here in this assistant, or by visiting our Contact page. Inquiries can also be emailed directly to our commercial marketing office at marketing@vasudhapharma.com.", "Keywords": "quote, quotation, rfq, price, pricing, sample, order, buy, purchase, cost, commercial inquiry"}, {"Question": "How can I apply for a job or career opportunity at Vasudha Pharma?", "Answer": "You can view all current vacancies and job openings across Production, Quality Control (QC), Quality Assurance (QA), Regulatory Affairs (RA), and R&D on our Careers portal at careers.html. Resumes can be submitted directly via our online application form or emailed to hr@vasudhapharma.com.", "Keywords": "careers, jobs, vacancy, openings, hiring, apply, recruitment, hr, resume, cv, interview"}, {"Question": "What is Vasudha Pharma's Corporate Governance and Vigil Mechanism Policy?", "Answer": "Vasudha Pharma maintains a strict zero-tolerance policy against unethical conduct, fraud, or violations of regulatory standards. Our Vigil Mechanism and Whistleblower Policy provides a secure, confidential channel for employees and stakeholders to report concerns directly to the Audit Committee.", "Keywords": "governance, vigil mechanism, whistleblower, ethics, compliance, policy, integrity"}, {"Question": "What are the CSR initiatives of the Vasudha Foundation?", "Answer": "The Vasudha Foundation conducts social impact programs focusing on: 1) Rural Community Healthcare & diagnostic camps, 2) Safe drinking water infrastructure (RO water plants), 3) Educational scholarships and government school upgrades, and 4) Environmental greenbelt tree planting around industrial hubs.", "Keywords": "csr, foundation, social responsibility, philanthropy, community, education, health, welfare"}, {"Question": "How can I contact Vasudha Pharma?", "Answer": "Corporate Office: Plot No. 78, Jawaharlal Nehru Pharma City, Parawada, Visakhapatnam - 531021, Andhra Pradesh, India. Tel: +91-8924-236200 / +91-40-44558888. Email: info@vasudhapharma.com / marketing@vasudhapharma.com. Web: https://vasudhapharma.com.", "Keywords": "contact, address, phone, email, telephone, headquarters, corporate office, location, directions"}, {"Question": "What are Vasudha's Minimum Order Quantities (MOQs) for commercial and evaluation samples?", "Answer": "For R&D, formulation evaluation, and analytical method verification, we provide pilot and working standard samples from 10 g to 1 kg along with a complete Certificate of Analysis (CoA) and analytical pack. For commercial production orders, our typical MOQ is 25 kg (one standard fiber drum) up to multi-metric ton campaign lots.", "Keywords": "moq, minimum order quantity, sample size, evaluation sample, working standard, trial order, small batch, drum size"}, {"Question": "What standard packaging options are provided for bulk APIs, Pellets, and Intermediates?", "Answer": "All products are packaged under validated cleanroom conditions using pharmacopeial-grade packaging materials: inner heat-sealed food/pharma grade LDPE liners (double bagged) with food-grade desiccant, enclosed inside tamper-evident UN-certified fiber drums (25 kg / 50 kg) or HDPE drums. Custom packaging configurations can be qualified upon request.", "Keywords": "packaging, drum, fiber drum, hdpe, liner, double liner, storage container, packing standard, un certified"}, {"Question": "What stability study data is available according to ICH Q1A(R2) climatic zones?", "Answer": "Vasudha Pharma conducts rigorous stability programs in accordance with ICH Q1A(R2) guidelines. Stability data is available across Zone II (25°C / 60% RH) and Zone IVb (30°C / 75% RH - hot and humid climates), including 6-month accelerated testing (40°C / 75% RH) and long-term testing up to 36 to 60 months with complete re-test interval data.", "Keywords": "stability, ich q1a, zone ii, zone ivb, accelerated stability, shelf life, retest period, storage condition, humidity"}, {"Question": "How can our company schedule a vendor qualification or technical compliance audit?", "Answer": "We welcome customer quality audits and vendor qualification visits across Unit 1, Unit 2, Unit 3, and Unit 5. Both on-site audits and secure remote/virtual desktop audits can be coordinated by contacting our Corporate Quality Assurance department at qa@vasudhapharma.com or quality@vasudhapharma.com with your preferred audit scope and dates.", "Keywords": "audit, vendor audit, site visit, vendor qualification, audit schedule, qa audit, inspection visit, virtual audit"}, {"Question": "Can Vasudha provide an Open-Part Drug Master File (USDMF) or CEP Letter of Authorization (LOA)?", "Answer": "Yes. Upon execution of a bilateral Non-Disclosure Agreement (CDA), Vasudha Pharma issues formal Letters of Access / Authorization (LOA) to regulatory authorities (US FDA, EDQM, Health Canada) allowing customers to cross-reference our USDMF, CEP, or Canadian DMF in their Abbreviated New Drug Applications (ANDA) or Marketing Authorizations (MA).", "Keywords": "dmf, usdmf, cep, loa, letter of access, letter of authorization, open part dmf, technical dossier, regulatory filing, cross reference"}, {"Question": "What is the process for executing a bilateral Confidential Disclosure Agreement (CDA / NDA)?", "Answer": "To facilitate in-depth technical discussions, route scouting, or DMF access, our legal and commercial team provides a mutual CDA turnaround within 24 to 48 hours. You may share your company's standard template or adopt Vasudha's bilateral NDA by contacting legal@vasudhapharma.com or marketing@vasudhapharma.com.", "Keywords": "cda, nda, confidentiality agreement, non disclosure agreement, secrecy agreement, legal template"}, {"Question": "Does Vasudha provide Nitrosamine, Elemental Impurity, and Genotoxic Risk Assessments?", "Answer": "Yes. Comprehensive Nitrosamine Risk Assessments (Step 1, Step 2, and confirmatory testing via LC-MS/MS and GC-MS/MS) are established for all commercial APIs in strict alignment with US FDA, EMA, and ICH M7(R1) guidelines. Full Elemental Impurity Risk Assessments in compliance with ICH Q3D (via ICP-MS) are routinely provided.", "Keywords": "nitrosamines, genotoxic impurities, elemental impurities, ich q3d, ich m7, risk assessment, lc-ms, gc-ms, toxicology"}, {"Question": "Which global pharmacopeial standards do your products comply with?", "Answer": "Vasudha Pharma's products comply with official compendial monographs across the United States Pharmacopeia (USP), European Pharmacopoeia (Ph.Eur / EP), British Pharmacopoeia (BP), Indian Pharmacopoeia (IP), and Japanese Pharmacopoeia (JP). Where compendial monographs do not exist, tightly validated In-House Specifications are applied.", "Keywords": "pharmacopeia, usp, bp, ph eur, ep, ip, jp, compendial, monograph, in house specification, coa"}, {"Question": "How does the Vikasith R&D Centre support process innovation and route scouting?", "Answer": "The Vikasith R&D Centre in Hyderabad houses over 100 research scientists, synthetic organic chemists, and AR&D analytical specialists. Capabilities include green chemistry route design, polymorphic screening, crystal engineering, continuous flow chemistry, catalytic asymmetric hydrogenation, and seamless technology transfer to cGMP plant scale.", "Keywords": "vikasith, r&d, research, route scouting, green chemistry, flow chemistry, polymorphism, chiral synthesis, tech transfer"}, {"Question": "What coating and delivery technologies are supported for Pellets & MUPS?", "Answer": "Our dedicated Pellets facility utilizes advanced Fluid Bed Processors (FBP) with Wurster bottom-spray coating technology. We manufacture enteric-coated pellets (pH-dependent release), sustained-release pellets, delayed-release multi-particulates, taste-masked granules for pediatric suspensions, and directly compressible MUPS granules.", "Keywords": "pellet coating, wurster, fluid bed, fbp, enteric coating, mups technology, taste masking, pediatric granules, micro pellets"}, {"Question": "What is Vasudha's manufacturing capacity and global market share in Piperidones?", "Answer": "Vasudha Pharma is recognized as a global market leader in Piperidone chemistry, commanding a dominant share of worldwide capacity. With multi-thousand metric ton annual throughput across multi-purpose reactors (up to 16,000-liter scale), we ensure an uninterrupted, backward-integrated supply chain for critical API synthesis globally.", "Keywords": "piperidone capacity, market share, global leader, reactor capacity, backward integration, supply chain security"}, {"Question": "How are temperature-sensitive products handled during international transport and cold-chain logistics?", "Answer": "For temperature-sensitive APIs and enzymatic materials, we implement validated cold-chain logistics using temperature-controlled reefer containers, insulated shippers with dry ice or phase-change materials (PCM), and real-time USB/GPS temperature data loggers monitoring transit conditions from plant dispatch to destination port.", "Keywords": "cold chain, temperature control, reefer container, data logger, transport conditions, refrigerated shipping, thermal packaging"}, {"Question": "What are typical order lead times and batch release schedules?", "Answer": "For catalog APIs and intermediates in regular commercial production, ready inventory can be dispatched within 7 to 14 business days following QC release. For campaign-based synthesis or custom batch sizes, typical production and QA batch release lead times range between 4 to 8 weeks.", "Keywords": "lead time, delivery time, dispatch, turnaround, order schedule, batch release, availability"}, {"Question": "Are your analytical test methods fully validated in compliance with ICH Q2(R1)?", "Answer": "Yes. All analytical methods (HPLC, UPLC, GC, Titration, PSD by Malvern Mastersizer) utilized for release and stability testing are fully validated according to ICH Q2(R1) guidelines, evaluating Specificity, Linearity, Range, Accuracy, Precision (Repeatability and Intermediate Precision), Detection Limit (LOD), and Quantitation Limit (LOQ).", "Keywords": "analytical validation, method validation, ich q2, hplc, uplc, gc, lod, loq, precision, accuracy, specificity"}, {"Question": "Does Vasudha comply with ICH Q3C (Residual Solvents) and ICH Q3D (Elemental Impurities)?", "Answer": "Yes. All manufacturing processes strictly control Class 1, Class 2, and Class 3 residual solvents using Headspace Gas Chromatography (HS-GC) under ICH Q3C limits. Elemental impurities (Class 1, 2A, 2B, and 3 metals) are rigorously quantified via Inductively Coupled Plasma Mass Spectrometry (ICP-MS) complying with ICH Q3D.", "Keywords": "residual solvents, elemental impurities, ich q3c, ich q3d, hs-gc, icp-ms, solvent limits, heavy metals"}, {"Question": "Can Vasudha provide TSE/BSE, Non-GMO, and Melamine-Free declarations?", "Answer": "Yes. Standard regulatory declaration packages including TSE/BSE Risk Statements (confirming 100% synthetic origin with zero animal-derived raw materials), Non-GMO Declarations, Melamine-Free Certifications, and Allergen Statements are readily issued for all commercial molecules.", "Keywords": "tse, bse, non-gmo, gmo free, animal origin, melamine free, allergen statement, regulatory statements, declaration"}, {"Question": "Does Vasudha manufacture products under Environmental, Health & Safety (EHS) and ISO standards?", "Answer": "Yes. Vasudha Pharma is certified under ISO 14001:2015 (Environmental Management System) and ISO 45001 / OHSAS 18001 (Occupational Health & Safety). We operate Zero Liquid Discharge (ZLD) effluent treatment facilities, multi-stage biological ETPs, and are awarded EcoVadis Silver Sustainability Ratings.", "Keywords": "ehs, iso 14001, ohsas 18001, iso 45001, zero liquid discharge, zld, sustainability, ecovadis, environmental"}];

  // State Management
  const STATE = {
    isOpen: false,
    soundEnabled: true,
    history: [],
    teaserDismissed: false,
    inquiryCart: []
  };

  // Determine base path prefix (supports root and subdirectories)
  function getBasePrefix() {
    try {
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].getAttribute('src') || '';
        if (src.indexOf('vasudha-bot.js') !== -1) {
          const prefix = src.substring(0, src.indexOf('assets/js/vasudha-bot.js'));
          return prefix || '';
        }
      }
    } catch (e) {}
    return '';
  }

  const BASE_PREFIX = getBasePrefix();
  const LOGO_SRC = BASE_PREFIX + 'assets/vasudha-logo.jpg';

  // Levenshtein Distance for Typo-Tolerant Fuzzy Search
  function levenshteinDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    const m = s1.length, n = s2.length;
    if (m === 0) return n;
    if (n === 0) return m;
    if (Math.abs(m - n) > 3) return 99; // Quick bail-out
    const d = [];
    for (let i = 0; i <= m; i++) d[i] = [i];
    for (let j = 0; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        d[i][j] = Math.min(
          d[i - 1][j] + 1,
          d[i][j - 1] + 1,
          d[i - 1][j - 1] + cost
        );
      }
    }
    return d[m][n];
  }

  // Web Audio Notification Chime (Zero audio file downloads, works 100% offline)
  let audioCtx = null;
  function playNotificationChime() {
    if (!STATE.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtx) audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880.00, now + 0.12); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(587.33, now);
      osc2.frequency.setValueAtTime(880.00, now + 0.12);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } catch (e) {}
  }

  // HTML sanitizer
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Generate Reference ID
  function generateTicketId() {
    const num = Math.floor(1000 + Math.random() * 9000);
    return 'VP-RFQ-' + num;
  }

  // Copy bot text helper
  window.copyBotMsg = function(btn) {
    const bubble = btn.closest('.vp-msg-bubble');
    if (!bubble) return;
    const clone = bubble.cloneNode(true);
    const btns = clone.querySelectorAll('button, .vp-msg-actions, .vp-chips-container, .vp-inquiry-bar');
    btns.forEach(b => b.remove());
    const text = clone.innerText.trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        const origHtml = btn.innerHTML;
        btn.innerHTML = '<span style="color:#10b981; font-weight:700;">✓ Copied</span>';
        setTimeout(() => { btn.innerHTML = origHtml; }, 2000);
      });
    }
  };

  // Render Launcher, Window & Teaser
  function renderBotUI() {
    // Teaser Callout
    const teaserEl = document.createElement('div');
    teaserEl.id = 'vp-bot-teaser';
    teaserEl.style.display = 'none';
    teaserEl.innerHTML = `
      <div class="vp-teaser-inner">
        <div class="vp-teaser-avatar">
          <img src="${LOGO_SRC}" alt="Vasudha Assistant" onerror="this.src='${BASE_PREFIX}assets/vasudha-logo.jpg'">
        </div>
        <div class="vp-teaser-content">
          <div class="vp-teaser-title">Need pricing, DMFs, or technical specs?</div>
          <div class="vp-teaser-desc">Search 265+ molecules or request instant quotes.</div>
        </div>
        <button type="button" class="vp-teaser-close" id="vpTeaserClose" aria-label="Dismiss">&times;</button>
      </div>
    `;
    document.body.appendChild(teaserEl);

    // Floating Launcher Button
    const launcherEl = document.createElement('button');
    launcherEl.id = 'vp-bot-launcher';
    launcherEl.setAttribute('aria-label', 'Open Vasudha Virtual Assistant');
    launcherEl.innerHTML = `
      <div class="vp-launcher-icon vp-icon-chat">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </div>
      <div class="vp-launcher-icon vp-icon-close" style="display:none;">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
      <span class="vp-launcher-badge">1</span>
    `;
    document.body.appendChild(launcherEl);

    // Main Chat Window
    const winEl = document.createElement('div');
    winEl.id = 'vp-bot-window';
    winEl.setAttribute('aria-hidden', 'true');
    winEl.style.display = 'none';
    winEl.innerHTML = `
      <div class="vp-header">
        <div class="vp-header-left">
          <div class="vp-avatar-wrap vp-header-avatar">
            <img src="${LOGO_SRC}" alt="Vasudha Bot" class="vp-avatar" onerror="this.src='${BASE_PREFIX}assets/vasudha-logo.jpg'">
            <span class="vp-status-dot"></span>
          </div>
          <div class="vp-header-info">
            <div class="vp-header-title">Vasudha Virtual Assistant</div>
            <div class="vp-header-sub vp-header-subtitle">265+ Molecules &bull; USDMFs &bull; Offline AI</div>
          </div>
        </div>
        <div class="vp-header-actions">
          <button type="button" class="vp-btn-icon vp-header-btn" id="vpBtnSound" title="Toggle audio chime" aria-label="Toggle chime">
            <svg id="vpIconSoundOn" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <svg id="vpIconSoundOff" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          </button>
          <button type="button" class="vp-btn-icon vp-header-btn" id="vpBtnClear" title="Clear chat history" aria-label="Clear chat">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
          <button type="button" class="vp-btn-icon vp-header-btn" id="vpBtnClose" title="Minimize assistant" aria-label="Minimize">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Quick Filter Chips -->
      <div class="vp-quick-filters">
        <button type="button" class="vp-qf-chip" data-q="CNS & Neurology">🧠 CNS &amp; Neuro</button>
        <button type="button" class="vp-qf-chip" data-q="Cardiovascular">🫀 Cardio</button>
        <button type="button" class="vp-qf-chip" data-q="Gastroenterology">💊 Gastro &amp; PPIs</button>
        <button type="button" class="vp-qf-chip" data-q="Pellets">📦 Pellets &amp; MUPS</button>
        <button type="button" class="vp-qf-chip" data-q="Piperidone">🔬 Piperidones</button>
        <button type="button" class="vp-qf-chip" data-q="Antidiabetic">🍬 Anti-Diabetic</button>
        <button type="button" class="vp-qf-chip" data-q="USDMF">📜 USDMF Available</button>
        <button type="button" class="vp-qf-chip" data-action="request-quote">📋 Request a Quote</button>
      </div>

      <!-- Floating Inquiry Cart Bar (Visible when >= 1 molecule added) -->
      <div id="vpInquiryBar" class="vp-inquiry-bar" style="display:none;">
        <span id="vpInquiryBarText">📋 RFQ Cart (0 molecules)</span>
        <button type="button" id="vpInquiryBarSubmit">Submit Combined RFQ &rarr;</button>
      </div>

      <!-- Body / Messages -->
      <div class="vp-body" id="vpMessages"></div>

      <!-- Footer / Input -->
      <div class="vp-footer">
        <form id="vpChatForm" class="vp-chat-form vp-input-bar">
          <input type="text" id="vpChatInput" class="vp-input" placeholder="Search 265+ molecules, CAS, USDMF, or ask..." autocomplete="off">
          <button type="submit" class="vp-send-btn" id="vpSendBtn" aria-label="Send query">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
        <div class="vp-footer-credit vp-footer-brand">
          Vasudha Pharma Chem Ltd &bull; 100% Confidential cGMP Partner
        </div>
      </div>
    `;
    document.body.appendChild(winEl);

    bindEvents();
    loadGreeting();
    showTeaserDelayed();
  }

  // Bind Event Handlers
  function bindEvents() {
    const launcher = document.getElementById('vp-bot-launcher');
    const win = document.getElementById('vp-bot-window');
    const closeBtn = document.getElementById('vpBtnClose');
    const clearBtn = document.getElementById('vpBtnClear');
    const soundBtn = document.getElementById('vpBtnSound');
    const chatForm = document.getElementById('vpChatForm');
    const chatInput = document.getElementById('vpChatInput');
    const teaserClose = document.getElementById('vpTeaserClose');
    const messages = document.getElementById('vpMessages');
    const inquirySubmitBtn = document.getElementById('vpInquiryBarSubmit');

    // Launcher click
    if (launcher) {
      launcher.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBotWindow();
      });
    }

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeBotWindow();
      });
    }

    // Teaser close
    if (teaserClose) {
      teaserClose.addEventListener('click', (e) => {
        e.stopPropagation();
        hideTeaser();
        STATE.teaserDismissed = true;
      });
    }

    // Teaser click opens chat
    const teaser = document.getElementById('vp-bot-teaser');
    if (teaser) {
      teaser.addEventListener('click', () => {
        hideTeaser();
        openBotWindow();
      });
    }

    // Sound Toggle
    soundBtn.addEventListener('click', () => {
      STATE.soundEnabled = !STATE.soundEnabled;
      document.getElementById('vpIconSoundOn').style.display = STATE.soundEnabled ? 'block' : 'none';
      document.getElementById('vpIconSoundOff').style.display = STATE.soundEnabled ? 'none' : 'block';
    });

    // Clear Chat
    clearBtn.addEventListener('click', () => {
      messages.innerHTML = '';
      STATE.history = [];
      STATE.inquiryCart = [];
      updateInquiryCartUI();
      loadGreeting();
    });

    // Submit Chat Query
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = chatInput.value.trim();
      if (!val) return;
      chatInput.value = '';
      handleUserQuery(val);
    });

    // Inquiry Cart Submit
    if (inquirySubmitBtn) {
      inquirySubmitBtn.addEventListener('click', () => {
        if (STATE.inquiryCart.length === 0) return;
        mountInChatRFQForm(STATE.inquiryCart.join(', '), 'Multiple Selected Molecules');
      });
    }

    // Quick filter chips click
    document.querySelectorAll('.vp-qf-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const act = btn.getAttribute('data-action');
        if (act === 'request-quote') {
          mountInChatRFQForm('', '');
          return;
        }
        const q = btn.getAttribute('data-q');
        if (q) {
          handleUserQuery(q);
        }
      });
    });

    // Delegation for dynamic chips, product quotes & cart adds
    messages.addEventListener('click', (e) => {
      // Chip click
      const chip = e.target.closest('.vp-chip');
      if (chip) {
        const action = chip.getAttribute('data-action');
        const query = chip.getAttribute('data-query');
        if (action) handleChipAction(action, chip);
        else if (query) handleUserQuery(query);
        return;
      }

      // Instant Quote button on product card
      const quoteBtn = e.target.closest('.vp-btn-quote');
      if (quoteBtn) {
        const prod = quoteBtn.getAttribute('data-product');
        const cat = quoteBtn.getAttribute('data-category');
        mountInChatRFQForm(prod, cat);
        return;
      }

      // Add to Inquiry Cart button
      const addCartBtn = e.target.closest('.vp-btn-add-cart');
      if (addCartBtn) {
        const prodName = addCartBtn.getAttribute('data-product');
        toggleInquiryCart(prodName, addCartBtn);
        return;
      }

      // Copy CAS button
      const copyCasBtn = e.target.closest('.vp-copy-cas-btn');
      if (copyCasBtn) {
        const cas = copyCasBtn.getAttribute('data-cas');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(cas).then(() => {
            copyCasBtn.textContent = 'Copied!';
            setTimeout(() => { copyCasBtn.textContent = 'Copy'; }, 2000);
          });
        }
        return;
      }
    });
  }

  // Toggle Inquiry Cart
  function toggleInquiryCart(molecule, btn) {
    const idx = STATE.inquiryCart.indexOf(molecule);
    if (idx === -1) {
      STATE.inquiryCart.push(molecule);
      if (btn) {
        btn.classList.add('in-cart');
        btn.textContent = '✓ In RFQ Cart';
      }
    } else {
      STATE.inquiryCart.splice(idx, 1);
      if (btn) {
        btn.classList.remove('in-cart');
        btn.textContent = '+ Add to Inquiry';
      }
    }
    updateInquiryCartUI();
  }

  function updateInquiryCartUI() {
    const bar = document.getElementById('vpInquiryBar');
    const txt = document.getElementById('vpInquiryBarText');
    if (!bar || !txt) return;
    const count = STATE.inquiryCart.length;
    if (count > 0) {
      bar.style.display = 'flex';
      txt.textContent = `📋 RFQ Cart (${count} molecule${count > 1 ? 's' : ''})`;
    } else {
      bar.style.display = 'none';
    }
  }

  // Open / Close Bot Window
  function openBotWindow() {
    const win = document.getElementById('vp-bot-window');
    const launcher = document.getElementById('vp-bot-launcher');
    const chatInput = document.getElementById('vpChatInput');
    if (!win) return;

    win.style.display = 'flex';
    void win.offsetHeight; // Force layout calculation before animating
    win.classList.add('vp-open');
    win.style.opacity = '1';
    win.style.pointerEvents = 'auto';
    win.style.transform = 'translateY(0) scale(1)';
    win.setAttribute('aria-hidden', 'false');

    if (launcher) {
      launcher.classList.add('vp-active');
      launcher.classList.add('open');
      const chatIcon = launcher.querySelector('.vp-icon-chat');
      const closeIcon = launcher.querySelector('.vp-icon-close');
      if (chatIcon) { chatIcon.style.display = 'none'; chatIcon.style.opacity = '0'; }
      if (closeIcon) { closeIcon.style.display = 'flex'; closeIcon.style.opacity = '1'; }
      const badge = launcher.querySelector('.vp-launcher-badge');
      if (badge) badge.style.display = 'none';
      const unread = launcher.querySelector('.vp-unread-badge');
      if (unread) unread.style.display = 'none';
    }

    STATE.isOpen = true;
    hideTeaser();

    setTimeout(() => {
      if (chatInput) {
        try { chatInput.focus(); } catch (e) {}
      }
    }, 250);
  }

  function closeBotWindow() {
    const win = document.getElementById('vp-bot-window');
    const launcher = document.getElementById('vp-bot-launcher');
    if (!win) return;

    win.classList.remove('vp-open');
    win.style.opacity = '0';
    win.style.pointerEvents = 'none';
    win.style.transform = 'translateY(20px) scale(0.95)';
    win.setAttribute('aria-hidden', 'true');

    if (launcher) {
      launcher.classList.remove('vp-active');
      launcher.classList.remove('open');
      const chatIcon = launcher.querySelector('.vp-icon-chat');
      const closeIcon = launcher.querySelector('.vp-icon-close');
      if (chatIcon) { chatIcon.style.display = 'flex'; chatIcon.style.opacity = '1'; }
      if (closeIcon) { closeIcon.style.display = 'none'; closeIcon.style.opacity = '0'; }
    }

    STATE.isOpen = false;

    setTimeout(() => {
      if (!STATE.isOpen && win) {
        win.style.display = 'none';
      }
    }, 280);
  }

  // Global window helpers
  window.openVasudhaBot = openBotWindow;
  window.closeVasudhaBot = closeBotWindow;
  window.toggleVasudhaBot = toggleBotWindow;

  function toggleBotWindow() {
    if (STATE.isOpen) closeBotWindow();
    else openBotWindow();
  }

  function showTeaserDelayed() {
    setTimeout(() => {
      if (!STATE.isOpen && !STATE.teaserDismissed) {
        const teaser = document.getElementById('vp-bot-teaser');
        if (teaser) teaser.style.display = 'flex';
      }
    }, 4000);
  }

  function hideTeaser() {
    const teaser = document.getElementById('vp-bot-teaser');
    if (teaser) teaser.style.display = 'none';
  }

  // Append Messages to DOM
  function appendMessageToDOM(sender, htmlContent, scroll = true) {
    const messages = document.getElementById('vpMessages');
    const msgEl = document.createElement('div');
    msgEl.className = `vp-msg vp-msg-${sender}`;

    const copyBtnHtml = sender === 'bot' 
      ? `<div class="vp-msg-actions"><button type="button" class="vp-copy-msg-btn" title="Copy response text" onclick="copyBotMsg(this)"><i class="fas fa-copy"></i></button></div>` 
      : '';

    msgEl.innerHTML = `
      <div class="vp-msg-bubble">
        ${copyBtnHtml}
        ${htmlContent}
      </div>
    `;

    messages.appendChild(msgEl);
    if (scroll) {
      messages.scrollTop = messages.scrollHeight;
    }
  }

  // Show Typing Indicator
  function showTypingIndicator() {
    const messages = document.getElementById('vpMessages');
    const typingEl = document.createElement('div');
    typingEl.id = 'vp-typing-indicator';
    typingEl.className = 'vp-msg vp-msg-bot';
    typingEl.innerHTML = `
      <div class="vp-msg-bubble vp-typing">
        <span></span><span></span><span></span>
      </div>
    `;
    messages.appendChild(typingEl);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTypingIndicator() {
    const el = document.getElementById('vp-typing-indicator');
    if (el) el.remove();
  }

  // Initial Greeting
  function loadGreeting() {
    const greetingHtml = `
      <p>Hello! Welcome to <strong>Vasudha Pharma Chem Limited</strong>.</p>
      <p>I am your native B2B technical assistant. How may I help you today?</p>
      <div class="vp-chips-container">
        <button type="button" class="vp-chip" data-action="explore-products">🔍 Search Products (265+)</button>
        <button type="button" class="vp-chip" data-action="request-quote">📋 Request a Quote (RFQ)</button>
        <button type="button" class="vp-chip" data-action="ask-facilities">🏭 Manufacturing Sites</button>
        <button type="button" class="vp-chip" data-action="ask-regulatory">📜 US FDA &amp; Accreditations</button>
        <button type="button" class="vp-chip" data-action="ask-cdmo">🧪 CDMO &amp; Vikasith R&amp;D</button>
        <button type="button" class="vp-chip" data-action="ask-contact">📞 Speak with Marketing</button>
      </div>
    `;
    appendMessageToDOM('bot', greetingHtml, true);
  }

  // Handle Quick Chips
  function handleChipAction(action, chipEl) {
    switch (action) {
      case 'explore-products':
        handleUserQuery('What products does Vasudha Pharma manufacture?');
        break;
      case 'request-quote':
        mountInChatRFQForm('', '');
        break;
      case 'ask-facilities':
        handleUserQuery('Where are Vasudha Pharma manufacturing units located?');
        break;
      case 'ask-regulatory':
        handleUserQuery('What regulatory approvals and accreditations does Vasudha Pharma hold?');
        break;
      case 'ask-cdmo':
        handleUserQuery('Does Vasudha Pharma offer Custom Synthesis and CDMO services?');
        break;
      case 'ask-contact':
        handleUserQuery('How can I contact Vasudha Pharma?');
        break;
      default:
        break;
    }
  }

  // Render Product Card HTML with Rich Details
  function renderProductCardHtml(p) {
    const pageUrl = BASE_PREFIX + (p.page || 'products.html');
    const theraBadge = p.therapeutic ? `<span class="vp-thera-tag" title="Therapeutic Area">🩺 ${escapeHtml(p.therapeutic)}</span>` : '';
    const subClass = p.sub_category ? `<div class="vp-sub-class">${escapeHtml(p.sub_category)}</div>` : '';
    const synText = (p.synonyms && p.synonyms.length > 0) ? `<div class="vp-synonyms">Brand / Synonyms: <em>${escapeHtml(p.synonyms.join(', '))}</em></div>` : '';
    const dmfText = p.dmf_status || p.filings || 'Available on Request';
    const inCart = (STATE.inquiryCart || []).includes(p.name);

    return `
      <div class="vp-product-card" data-molecule="${escapeHtml(p.name)}">
        <div class="vp-product-head">
          <span class="vp-product-title">${escapeHtml(p.name)}</span>
          <div class="vp-badge-cluster">
            <span class="vp-category-tag">${escapeHtml(p.category_label || p.category)}</span>
            ${theraBadge}
          </div>
        </div>
        ${subClass}
        ${synText}
        <div class="vp-product-meta">
          <div class="vp-product-cas">
            <span>CAS:</span>
            <span class="vp-cas-badge">${escapeHtml(p.cas || 'N/A')}</span>
            ${p.cas ? `<button type="button" class="vp-copy-cas-btn" data-cas="${escapeHtml(p.cas)}" title="Copy CAS">Copy</button>` : ''}
          </div>
          <div>Specs: <strong>${escapeHtml(p.specs || 'In-House / Standard')}</strong></div>
          <div>Regulatory: <strong class="vp-dmf-status">📜 ${escapeHtml(dmfText)}</strong></div>
        </div>
        <div class="vp-product-actions">
          <a href="${pageUrl}" class="vp-product-btn vp-btn-view">View Specs &amp; Page</a>
          <button type="button" class="vp-product-btn vp-btn-quote" data-product="${escapeHtml(p.name)}" data-category="${escapeHtml(p.category)}">Instant Quote</button>
          <button type="button" class="vp-product-btn vp-btn-add-cart ${inCart ? 'in-cart' : ''}" data-product="${escapeHtml(p.name)}">${inCart ? '✓ In RFQ Cart' : '+ Add to Inquiry'}</button>
        </div>
      </div>
    `;
  }

  // Mount In-Chat RFQ Form
  function mountInChatRFQForm(prefillProduct = '', prefillCategory = '') {
    const ticketId = generateTicketId();
    let productValue = prefillProduct;
    if (!productValue && STATE.inquiryCart.length > 0) {
      productValue = STATE.inquiryCart.join(', ');
    }

    const formHtml = `
      <div class="vp-rfq-card">
        <div class="vp-rfq-header">
          <div class="vp-rfq-title">📋 Commercial Quotation / Sample Request</div>
          <div class="vp-rfq-ticket">${ticketId}</div>
        </div>
        <p style="margin: 4px 0 12px; font-size: 12px; color: var(--vp-bot-text-muted);">
          Submit your product requirements. Our global marketing team will respond with full pricing, MOQ, and technical packs within 1 business day.
        </p>
        <form class="vp-rfq-form" data-ticket="${ticketId}">
          <div class="vp-form-group">
            <label>Product(s) / Molecule(s) of Interest *</label>
            <input type="text" name="molecule" value="${escapeHtml(productValue)}" placeholder="e.g. Amitriptyline HCl, Pantoprazole Pellets" required>
          </div>
          <div class="vp-form-row">
            <div class="vp-form-group">
              <label>Requirement Type *</label>
              <select name="type" required>
                <option value="commercial-quote">Commercial Price Quotation</option>
                <option value="evaluation-sample">R&amp;D / Pilot Sample (10g - 1kg)</option>
                <option value="dmf-access">USDMF / CEP Letter of Authorization (LOA)</option>
                <option value="custom-synthesis">Custom Synthesis / CDMO Inquiry</option>
              </select>
            </div>
            <div class="vp-form-group">
              <label>Estimated Quantity *</label>
              <input type="text" name="quantity" placeholder="e.g. 500g, 25 kg, 2 MT" required>
            </div>
          </div>
          <div class="vp-form-row">
            <div class="vp-form-group">
              <label>Full Name / Contact Person *</label>
              <input type="text" name="contactName" placeholder="e.g. Dr. Sarah Jenkins" required>
            </div>
            <div class="vp-form-group">
              <label>Company / Organization *</label>
              <input type="text" name="company" placeholder="e.g. Biocare Laboratories" required>
            </div>
          </div>
          <div class="vp-form-row">
            <div class="vp-form-group">
              <label>Work Email Address *</label>
              <input type="email" name="email" placeholder="name@pharma-corp.com" required>
            </div>
            <div class="vp-form-group">
              <label>Phone / WhatsApp</label>
              <input type="tel" name="phone" placeholder="+1 (555) 000-0000">
            </div>
          </div>
          <div class="vp-form-group">
            <label>Destination Country / Market *</label>
            <input type="text" name="country" placeholder="e.g. United States, Germany, India" required>
          </div>
          <div class="vp-form-group">
            <label>Regulatory &amp; Compendial Requirements</label>
            <input type="text" name="requirements" placeholder="e.g. USP grade, USDMF required, Zone IVb stability">
          </div>
          <button type="submit" class="vp-rfq-submit-btn">Send Inquiry to Commercial Office &rarr;</button>
        </form>
      </div>
    `;

    appendMessageToDOM('bot', formHtml, true);

    // Bind form submit
    setTimeout(() => {
      const form = document.querySelector(`.vp-rfq-form[data-ticket="${ticketId}"]`);
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const contactName = formData.get('contactName') || '';
          const company = formData.get('company') || '';
          const country = formData.get('country') || '';
          const molecule = formData.get('molecule') || '';
          const type = formData.get('type') || '';
          const quantity = formData.get('quantity') || '';
          const email = formData.get('email') || '';
          const phone = formData.get('phone') || '';
          const requirements = formData.get('requirements') || '';
          const now = new Date();

          const payload = {
            id: ticketId,
            ticket: ticketId,
            dateStr: now.toLocaleDateString(),
            timestamp: now.toISOString(),
            submittedAt: now.toISOString(),
            contactName: contactName,
            name: contactName,
            company: company,
            country: country,
            market: country || 'Global',
            molecule: molecule,
            type: type,
            quantity: quantity,
            email: email,
            phone: phone,
            requirements: requirements,
            notes: (type ? '[' + type + '] ' : '') + (requirements || 'No additional notes')
          };

          // Persist lead in localStorage for staff operations review (both keys for cross-compatibility)
          try {
            const existingVp = JSON.parse(localStorage.getItem('vp_bot_leads') || '[]');
            existingVp.unshift(payload);
            localStorage.setItem('vp_bot_leads', JSON.stringify(existingVp.slice(0, 50)));

            const existing = JSON.parse(localStorage.getItem('vasudha_bot_rfqs') || '[]');
            existing.unshift(payload);
            localStorage.setItem('vasudha_bot_rfqs', JSON.stringify(existing.slice(0, 50)));
          } catch (err) {}

          // Clear inquiry cart
          STATE.inquiryCart = [];
          updateInquiryCartUI();

          // Render Success Confirmation
          const successHtml = `
            <div class="vp-rfq-success">
              <div class="vp-success-icon">✓</div>
              <div class="vp-success-title">Inquiry Submitted Successfully</div>
              <div class="vp-success-ticket">Reference Ticket: <strong>${ticketId}</strong></div>
              <p style="margin: 8px 0; font-size: 13px;">
                Thank you! Your request for <strong>${escapeHtml(payload.molecule)}</strong> has been transmitted to Vasudha Pharma's Commercial Desk.
              </p>
              <p style="font-size: 12px; color: var(--vp-bot-text-muted);">
                A confirmation has been queued for <strong>${escapeHtml(payload.email)}</strong>. Our technical sales representative will follow up with the full technical pack and pricing.
              </p>
              <div class="vp-chips-container" style="margin-top: 12px;">
                <button type="button" class="vp-chip" data-action="explore-products">🔍 Search More Products</button>
                <button type="button" class="vp-chip" data-action="ask-facilities">🏭 View Manufacturing Units</button>
              </div>
            </div>
          `;
          form.parentElement.innerHTML = successHtml;
          playNotificationChime();
        });
      }
    }, 50);
  }

  // Natural Language & Search Engine
  function handleUserQuery(query) {
    appendMessageToDOM('user', query, true);
    showTypingIndicator();

    setTimeout(() => {
      hideTypingIndicator();
      playNotificationChime();

      const q = query.trim().toLowerCase();

      // 1. Check for Greetings
      if (/^(hi|hello|hey|good\s+morning|good\s+afternoon|good\s+evening|namaste|help)$/i.test(q)) {
        const greetingHtml = `
          <p>Hello! How can I assist you with Vasudha Pharma's products or services today?</p>
          <div class="vp-chips-container">
            <button type="button" class="vp-chip" data-action="explore-products">🔍 Search Products (265+)</button>
            <button type="button" class="vp-chip" data-action="request-quote">📋 Request a Quote (RFQ)</button>
            <button type="button" class="vp-chip" data-action="ask-facilities">🏭 Manufacturing Facilities</button>
            <button type="button" class="vp-chip" data-action="ask-regulatory">📜 US FDA &amp; Accreditations</button>
          </div>
        `;
        appendMessageToDOM('bot', greetingHtml, true);
        return;
      }

      // 2. Check for Gratitude
      if (/^(thanks|thank\s+you|appreciate\s+it|thx|awesome|great|perfect)$/i.test(q)) {
        appendMessageToDOM('bot', `<p>You are very welcome! If you need any further technical documentation, DMF filings, or commercial pricing, feel free to ask anytime. 😊</p>`, true);
        return;
      }

      // 3. Check for RFQ / Quote Intent
      if (/(quote|quotation|price|pricing|cost|rfq|buy|purchase|sample|order)/i.test(q) && !/(cas|spec|facility|plant|who|what|moq|packaging)/i.test(q)) {
        mountInChatRFQForm('', '');
        return;
      }

            // 4. Token Parsing with Pharma Stop Words Filtering
      const STOP_WORDS = new Set(['and', 'the', 'for', 'with', 'are', 'what', 'how', 'can', 'our', 'all', 'any', 'does', 'you', 'your', 'about', 'from', 'have', 'has', 'give']);
      const qTokens = q.replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(t => t.length >= 3 && !STOP_WORDS.has(t));

      // 5. Search Knowledge Base FAQs (30 Technical & Commercial FAQs)
      let bestFaq = null;
      let highestFaqScore = 0;

      for (let i = 0; i < VP_FAQS.length; i++) {
        const faq = VP_FAQS[i];
        const fQ = (faq.Question || '').toLowerCase();
        const fA = (faq.Answer || '').toLowerCase();
        const fK = (faq.Keywords || '').toLowerCase();
        let score = 0;

        for (let t = 0; t < qTokens.length; t++) {
          const tok = qTokens[t];
          if (fQ.indexOf(tok) !== -1) score += 35;
          if (fK.indexOf(tok) !== -1) score += 30;
          if (fA.indexOf(tok) !== -1) score += 10;

          // Fuzzy match on FAQ keywords
          if (tok.length >= 5) {
            const kwList = fK.split(/,\s*/);
            for (let k = 0; k < kwList.length; k++) {
              if (levenshteinDistance(tok, kwList[k].trim()) <= 1) {
                score += 25;
                break;
              }
            }
          }
        }

        if (score > highestFaqScore) {
          highestFaqScore = score;
          bestFaq = faq;
        }
      }

      // 6. Search Commercial Products Catalog (265 Molecules)
      const matchingProducts = [];

      for (let i = 0; i < VP_PRODUCTS.length; i++) {
        const p = VP_PRODUCTS[i];
        const pNameLower = p.name.toLowerCase();
        const pCas = (p.cas || '').toLowerCase();
        const pCat = (p.category || '').toLowerCase();
        const pCatLabel = (p.category_label || '').toLowerCase();
        const pThera = (p.therapeutic || '').toLowerCase();
        const pSub = (p.sub_category || '').toLowerCase();
        const pSyns = (p.synonyms || []).map(s => s.toLowerCase());

        let score = 0;

        // Exact CAS match
        if (pCas && (pCas === q || q.indexOf(pCas) !== -1 || pCas.indexOf(q) !== -1 && q.length >= 4)) {
          matchingProducts.push({ product: p, score: 100 });
          continue;
        }

        // Exact name match
        if (pNameLower === q) {
          matchingProducts.push({ product: p, score: 95 });
          continue;
        }

        // Synonym / Brand name exact match (e.g. Abilify -> Aripiprazole, Plavix -> Clopidogrel)
        if (pSyns.includes(q)) {
          matchingProducts.push({ product: p, score: 90 });
          continue;
        }

        // Name contains query
        if (pNameLower.indexOf(q) !== -1) {
          score += 85;
        }

        // Therapeutic or Sub-category matches query
        if (pThera && (pThera.indexOf(q) !== -1 || q.indexOf(pThera) !== -1)) {
          score += 65;
        }
        if (pSub && (pSub.indexOf(q) !== -1 || q.indexOf(pSub) !== -1)) {
          score += 60;
        }

        // Category matches
        if (pCat === q || pCatLabel.toLowerCase() === q) {
          score += 55;
        }

        // Token match
        for (let t = 0; t < qTokens.length; t++) {
          const tok = qTokens[t];

          if (pNameLower.indexOf(tok) !== -1) score += 35;
          if (pCas.indexOf(tok) !== -1) score += 40;
          if (pThera.indexOf(tok) !== -1) score += 25;
          if (pSub.indexOf(tok) !== -1) score += 20;
          if (pSyns.some(s => s.indexOf(tok) !== -1)) score += 35;
          if (pCat.indexOf(tok) !== -1 || pCatLabel.indexOf(tok) !== -1) score += 15;

          // Fuzzy tolerance (Levenshtein distance <= 2 for words >= 5 letters)
          if (tok.length >= 5) {
            const firstWord = pNameLower.split(/\s+/)[0];
            if (firstWord.length >= 5 && levenshteinDistance(tok, firstWord) <= 2) {
              score += 45;
            }
          }
        }

        if (score >= 30) {
          matchingProducts.push({ product: p, score });
        }
      }

      matchingProducts.sort((a, b) => b.score - a.score);
      const topProdScore = matchingProducts.length > 0 ? matchingProducts[0].score : 0;

      // Helper function to render FAQ response
      function renderFaqResponse(faq) {
        const formattedAnswer = (faq.Answer || '').replace(
          /(https?:\/\/[^\s]+)/g,
          '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        const faqHtml = `
          <p><strong>${escapeHtml(faq.Question)}</strong></p>
          <p>${formattedAnswer}</p>
          <div class="vp-chips-container" style="margin-top:8px;">
            <button type="button" class="vp-chip" data-action="request-quote">📋 Request a Quote</button>
            <button type="button" class="vp-chip" data-action="explore-products">🔍 Search Another Molecule</button>
            <button type="button" class="vp-chip" data-action="ask-contact">📞 Contact Us</button>
          </div>
        `;
        appendMessageToDOM('bot', faqHtml, true);
      }

      // Helper function to render Products response
      function renderProductsResponse(prods) {
        const topMatches = prods.slice(0, 5).map(m => m.product);
        let responseHtml = `
          <p>Found <strong>${prods.length}</strong> commercial product${prods.length > 1 ? 's' : ''} matching "<strong>${escapeHtml(query)}</strong>":</p>
          <div class="vp-products-list">
            ${topMatches.map(p => renderProductCardHtml(p)).join('')}
          </div>
        `;

        if (prods.length > 5) {
          responseHtml += `
            <p style="margin-top:8px; font-size:12px; color:var(--vp-bot-text-muted);">
              Showing top 5 matches. Browse our full commercial catalog on our <a href="${BASE_PREFIX}products.html" target="_blank">Complete 265+ Products Directory</a>.
            </p>
          `;
        }
        appendMessageToDOM('bot', responseHtml, true);
      }

      // Decision Matrix:
      // 1. High-Confidence Product Match (exact CAS, name, synonym, or name contains query)
      if (topProdScore >= 85) {
        renderProductsResponse(matchingProducts);
        return;
      }

      // 2. High-Confidence Technical / Regulatory FAQ Match
      if (highestFaqScore >= 40) {
        renderFaqResponse(bestFaq);
        return;
      }

      // 3. Product match if score is higher than FAQ
      if (topProdScore >= 30 && topProdScore >= highestFaqScore) {
        renderProductsResponse(matchingProducts);
        return;
      }

      // 4. Moderate FAQ Match
      if (highestFaqScore >= 20) {
        renderFaqResponse(bestFaq);
        return;
      }

      // 5. Moderate Product Match
      if (topProdScore >= 30) {
        renderProductsResponse(matchingProducts);
        return;
      }

// 6. Intelligent Fallback with Category Prompts
      const fallbackHtml = `
        <p>I couldn't find an exact commercial match for "<strong>${escapeHtml(query)}</strong>".</p>
        <p>Would you like to explore our major therapeutic portfolios or submit a custom inquiry?</p>
        <div class="vp-chips-container">
          <button type="button" class="vp-chip" data-query="CNS & Neurology">🧠 CNS &amp; Neuro</button>
          <button type="button" class="vp-chip" data-query="Cardiovascular">🫀 Cardiovascular</button>
          <button type="button" class="vp-chip" data-query="Gastroenterology">💊 Gastro &amp; PPIs</button>
          <button type="button" class="vp-chip" data-query="Pellets">📦 Pellets &amp; MUPS</button>
          <button type="button" class="vp-chip" data-query="Piperidone">🔬 Piperidones</button>
          <button type="button" class="vp-chip" data-action="request-quote">📋 Request Custom Quotation (RFQ)</button>
          <button type="button" class="vp-chip" data-action="ask-cdmo">🧪 Custom Synthesis (CDMO)</button>
          <button type="button" class="vp-chip" data-action="ask-contact">📞 Speak with Marketing</button>
        </div>
      `;
      appendMessageToDOM('bot', fallbackHtml, true);
    }, 400);
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderBotUI);
  } else {
    renderBotUI();
  }
})();
