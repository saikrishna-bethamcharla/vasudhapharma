/**
 * VASUDHA VIRTUAL ASSISTANT (VP-BOT)
 * 100% Native, White-Labeled, Standalone & Offline-Ready
 * Vasudha Pharma Chem Limited
 * Zero External Dependencies - Works directly from local file:/// unzipped folder
 */

(function () {
  'use strict';

  // Prevent multiple initializations
  if (window.VasudhaBotInitialized) return;
  window.VasudhaBotInitialized = true;

  // Embedded Complete Product Catalog (265 Commercial Molecules)
  const VP_PRODUCTS = [{"name": "Amitriptyline HCl", "category": "apis", "category_label": "API", "cas": "549-18-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Aripiprazole", "category": "apis", "category_label": "API", "cas": "129722-12-9", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Bepotastine Besilate", "category": "apis", "category_label": "API", "cas": "190786-44-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Cisapride Monohydrate", "category": "apis", "category_label": "API", "cas": "260779-88-2", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Cinnarizine", "category": "apis", "category_label": "API", "cas": "298-57-7", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Clopidogrel Bisulphate", "category": "apis", "category_label": "API", "cas": "120202-66-6", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Cyclobenzaprine HCl", "category": "apis", "category_label": "API", "cas": "6202-23-9", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Cyproheptadine HCl", "category": "apis", "category_label": "API", "cas": "41354-29-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Dabigatran Etexilate Mesylate", "category": "apis", "category_label": "API", "cas": "872728-81-9", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Desloratadine", "category": "apis", "category_label": "API", "cas": "100643-71-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Dexlansoprazole Sesquihydrate", "category": "apis", "category_label": "API", "cas": "313640-86-7", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Diatrizoic Acid", "category": "apis", "category_label": "API", "cas": "117-96-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Diatrizoic Acid Dihydrate", "category": "apis", "category_label": "API", "cas": "50978-11-5", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Diatrizoic Sodium", "category": "apis", "category_label": "API", "cas": "737-31-5", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Diatrizoic Meglumine", "category": "apis", "category_label": "API", "cas": "131-49-7", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Dimethyl Fumarate", "category": "apis", "category_label": "API", "cas": "624-49-7", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Diltiazem HCl", "category": "apis", "category_label": "API", "cas": "33286-22-5", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Domperidone", "category": "apis", "category_label": "API", "cas": "57808-66-9", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Domperidone Maleate", "category": "apis", "category_label": "API", "cas": "83898-65-1", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Donepezil HCl", "category": "apis", "category_label": "API", "cas": "120011-70-3", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Donepezil HCl Monohydrate", "category": "apis", "category_label": "API", "cas": "884740-09-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Ebastine", "category": "apis", "category_label": "API", "cas": "90729-43-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Esomeprazole Magnesium Trihydrate", "category": "apis", "category_label": "API", "cas": "217087-09-7", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Esflurbiprofen/(S)-Flurbiprofen", "category": "apis", "category_label": "API", "cas": "51543-39-6", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Febuxostat", "category": "apis", "category_label": "API", "cas": "144060-53-7", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Fexofenadine HCl", "category": "apis", "category_label": "API", "cas": "153439-40-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Flurbiprofen", "category": "apis", "category_label": "API", "cas": "5104-49-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Flunarizine Di HCl", "category": "apis", "category_label": "API", "cas": "30484-77-6", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Itopride HCl", "category": "apis", "category_label": "API", "cas": "122892-31-3", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Itraconazole", "category": "apis", "category_label": "API", "cas": "84625-61-6", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Ketorolac Tromethamine", "category": "apis", "category_label": "API", "cas": "74103-07-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Lacosamide", "category": "apis", "category_label": "API", "cas": "175481-36-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Loperamide HCl", "category": "apis", "category_label": "API", "cas": "34552-83-5", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Loratadine", "category": "apis", "category_label": "API", "cas": "79794-75-5", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Losartan Potassium", "category": "apis", "category_label": "API", "cas": "124750-99-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Mebeverine HCl", "category": "apis", "category_label": "API", "cas": "2753-45-9", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Methoxyphenamine HCl", "category": "apis", "category_label": "API", "cas": "5588-10-3", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Mirabegron", "category": "apis", "category_label": "API", "cas": "223673-61-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Nortriptyline HCl", "category": "apis", "category_label": "API", "cas": "894-71-3", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Oxatomide Anhydrous", "category": "apis", "category_label": "API", "cas": "60607-34-3", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Oxcarbazepine", "category": "apis", "category_label": "API", "cas": "28721-07-5", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Olmesartan Medoxomil", "category": "apis", "category_label": "API", "cas": "144689-63-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Pantoprazole Sodium Sesquihydrate", "category": "apis", "category_label": "API", "cas": "164579-32-2", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Pimozide", "category": "apis", "category_label": "API", "cas": "2062-78-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Pimobendan", "category": "apis", "category_label": "API", "cas": "74150-27-9", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Pregabalin", "category": "apis", "category_label": "API", "cas": "148553-50-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Quetiapine Fumarate", "category": "apis", "category_label": "API", "cas": "111974-72-2", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Rivaroxaban", "category": "apis", "category_label": "API", "cas": "366789-02-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Rupatadine Fumarate", "category": "apis", "category_label": "API", "cas": "182349-12-8", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Sacubitril Sodium", "category": "apis", "category_label": "API", "cas": "149690-05-1", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Tamsulosin HCl", "category": "apis", "category_label": "API", "cas": "106463-17-6", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Telmisartan", "category": "apis", "category_label": "API", "cas": "144701-48-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Trazodone HCl", "category": "apis", "category_label": "API", "cas": "25332-39-2", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Valsartan", "category": "apis", "category_label": "API", "cas": "137862-53-4", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Vonoprazan Fumarate", "category": "apis", "category_label": "API", "cas": "881681-01-2", "specs": "USP / BP / Ph.Eur", "filings": "Available", "page": "apis.html"}, {"name": "Alcaftadine", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Amitriptyline HCl &amp; Nortriptyline HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "1210-35-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Amitriptyline HCl &amp; Nortriptyline HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "5407-04-5", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Bepotastine Besilate", "category": "intermediates", "category_label": "Intermediate", "cas": "65214-82-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Bepotastine Besilate", "category": "intermediates", "category_label": "Intermediate", "cas": "27652-89-7", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Bepotastine Besilate", "category": "intermediates", "category_label": "Intermediate", "cas": "122368-54-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Bepotastine Besilate", "category": "intermediates", "category_label": "Intermediate", "cas": "5382-16-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Bepotastine Besilate", "category": "intermediates", "category_label": "Intermediate", "cas": "161558-45-8", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Cinnarizine and Flunarizine", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Cyclobenzaprine HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "2222-33-5", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Cyclobenzaprine HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "5407-04-5", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Cyproheptadine HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "2222-33-5", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Cyproheptadine HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "5570-77-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Dabigatran Etexilate Mesylate", "category": "intermediates", "category_label": "Intermediate", "cas": "211915-84-3", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Dabigatran Etexilate Mesylate", "category": "intermediates", "category_label": "Intermediate", "cas": "429658-95-7", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Dabigatran Etexilate Mesylate", "category": "intermediates", "category_label": "Intermediate", "cas": "211915-06-9", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Domperidone", "category": "intermediates", "category_label": "Intermediate", "cas": "62780-89-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Domperidone", "category": "intermediates", "category_label": "Intermediate", "cas": "53786-28-0", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Donepezil HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "120014-30-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Donepezil HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "4803-74-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Donepezil HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "120014-06-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Ebastine", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Eprosartan", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Febuxostat", "category": "intermediates", "category_label": "Intermediate", "cas": "161797-99-5", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Febuxostat", "category": "intermediates", "category_label": "Intermediate", "cas": "161798-01-2", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Febuxostat", "category": "intermediates", "category_label": "Intermediate", "cas": "161798-02-3", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Febuxostat", "category": "intermediates", "category_label": "Intermediate", "cas": "161798-03-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Febuxostat", "category": "intermediates", "category_label": "Intermediate", "cas": "160844-75-7", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Flunarizine Di-HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Golvatinib &amp; Gilteritinib", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Haloperidol", "category": "intermediates", "category_label": "Intermediate", "cas": "3874-54-2", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Haloperidol", "category": "intermediates", "category_label": "Intermediate", "cas": "39512-49-7", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Indoramin HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Ketotifen", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Linagliptin", "category": "intermediates", "category_label": "Intermediate", "cas": "309956-78-3", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Linagliptin", "category": "intermediates", "category_label": "Intermediate", "cas": "334618-23-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Loperamide HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "39512-49-7", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Loperamide HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "37743-18-3", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Loperamide HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "956-89-8", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Loperamide HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "37742-98-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Loratadine &amp; Desloratadine", "category": "intermediates", "category_label": "Intermediate", "cas": "31255-57-9", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Loratadine &amp; Desloratadine", "category": "intermediates", "category_label": "Intermediate", "cas": "31251-41-9", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Loratadine &amp; Desloratadine", "category": "intermediates", "category_label": "Intermediate", "cas": "38092-89-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Loratadine &amp; Desloratadine", "category": "intermediates", "category_label": "Intermediate", "cas": "119770-60-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Loratadine &amp; Desloratadine", "category": "intermediates", "category_label": "Intermediate", "cas": "5570-77-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Losartan Potassium", "category": "intermediates", "category_label": "Intermediate", "cas": "11479-26-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Losartan Potassium", "category": "intermediates", "category_label": "Intermediate", "cas": "83857-96-9", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Mirabegron", "category": "intermediates", "category_label": "Intermediate", "cas": "521284-19-5", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Mirabegron", "category": "intermediates", "category_label": "Intermediate", "cas": "521284-21-9", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Mirabegron", "category": "intermediates", "category_label": "Intermediate", "cas": "521284-22-0", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Oxatomide", "category": "intermediates", "category_label": "Intermediate", "cas": "62780-89-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Oxatomide", "category": "intermediates", "category_label": "Intermediate", "cas": "841-77-0", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Pemetrexed acid", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Pimozide", "category": "intermediates", "category_label": "Intermediate", "cas": "20662-53-7", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Pimozide", "category": "intermediates", "category_label": "Intermediate", "cas": "3312-04-7", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Prucalopride", "category": "intermediates", "category_label": "Intermediate", "cas": "16771-85-0", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Prucalopride", "category": "intermediates", "category_label": "Intermediate", "cas": "179474-79-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Rifabutin", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Rivaroxaban", "category": "intermediates", "category_label": "Intermediate", "cas": "446292-08-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Rivaroxaban", "category": "intermediates", "category_label": "Intermediate", "cas": "898543-06-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Ropivacaine Hydrochloride Monohydrate", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Rupatadine Fumarate", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Selexipag", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Tamsulosin HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "112101-81-2", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Tamsulosin HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "106133-20-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Trazadone", "category": "intermediates", "category_label": "Intermediate", "cas": "6969-71-7", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Trazadone", "category": "intermediates", "category_label": "Intermediate", "cas": "52605-52-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Tucatinib", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Ormeloxifene hydrochloride Intermediate", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Etodolac Intermediate", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Salcaprozate sodium intermediate", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Prazosin.HCl, Terazosin.HCl, Alfuzosin.HCl, Doxazosin.HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Minoxidil, Kopexil, Kopyrrol", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Ticagrelor", "category": "intermediates", "category_label": "Intermediate", "cas": "145783-15-9", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Ticagrelor", "category": "intermediates", "category_label": "Intermediate", "cas": "1156491-10-9", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Ticagrelor", "category": "intermediates", "category_label": "Intermediate", "cas": "376608-65-0", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Isoxsuprine HCl", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Voglibose", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Mitapivat Sulfate", "category": "intermediates", "category_label": "Intermediate", "cas": "57260-71-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Mitapivat Sulfate", "category": "intermediates", "category_label": "Intermediate", "cas": "1260081-86-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Mitapivat Sulfate", "category": "intermediates", "category_label": "Intermediate", "cas": "1489-69-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Ruxolitinib", "category": "intermediates", "category_label": "Intermediate", "cas": "1146629-83-5", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Ruxolitinib", "category": "intermediates", "category_label": "Intermediate", "cas": "3680-69-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Ruxolitinib", "category": "intermediates", "category_label": "Intermediate", "cas": "2075-45-8", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Venetoclax", "category": "intermediates", "category_label": "Intermediate", "cas": "2979-19-3", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Venetoclax", "category": "intermediates", "category_label": "Intermediate", "cas": "98549-88-3", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Venetoclax", "category": "intermediates", "category_label": "Intermediate", "cas": "1228780-72-0", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Venetoclax", "category": "intermediates", "category_label": "Intermediate", "cas": "1235865-77-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Upadacitinib", "category": "intermediates", "category_label": "Intermediate", "cas": "1869118-25-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Upadacitinib", "category": "intermediates", "category_label": "Intermediate", "cas": "2095311-49-0", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Olaparib", "category": "intermediates", "category_label": "Intermediate", "cas": "420846-72-6", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Olaparib", "category": "intermediates", "category_label": "Intermediate", "cas": "59878-57-8", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Atrasentan", "category": "intermediates", "category_label": "Intermediate", "cas": "178739-03-2", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Atrasentan", "category": "intermediates", "category_label": "Intermediate", "cas": "40124-27-4", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Rimegepant Sulphate", "category": "intermediates", "category_label": "Intermediate", "cas": "39713-40-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Rimegepant Sulphate", "category": "intermediates", "category_label": "Intermediate", "cas": "1190363-50-8", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Rimegepant Sulphate", "category": "intermediates", "category_label": "Intermediate", "cas": "781649-84-1", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "GalNAc", "category": "intermediates", "category_label": "Intermediate", "cas": "", "specs": "In-House Standard", "filings": "Commercial Grade", "page": "intermediates.html"}, {"name": "Duloxetine HCl", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "136434-34-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Esomeprazole", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "217087-09-7", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Esomeprazole (Micro/MUPS)", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "217087-09-7", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Lansoprazole", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "103577-45-3", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Lansoprazole (Micro Pellets)", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "103577-45-3", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Omeprazole", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "73590-58-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Omeprazole (Micro Pellets)", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "73590-58-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Pantoprazole", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "102625-70-7", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Pancreatin", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "8049-47-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Rabeprazole", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "117976-90-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Diclofenac Sodium", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "15307-79-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Domperidone", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "57808-66-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Venlafaxine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "93413-69-5", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Aprepitant", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "170729-80-3", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Dabigatran", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "211915-06-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Diclofenac Sodium", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "15307-79-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Domperidone", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "57808-66-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Itraconazole", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "84625-61-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Orlistat", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "96829-58-2", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Clarithromycin Taste Masked Micro Pellets, Granules", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "81103-11-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Diclofenac Sodium", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "15307-79-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Domperidone", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "57808-66-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Itopride HCl", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "122892-31-3", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Levosulpiride", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "23672-07-3", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Mebeverine HCl", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "2753-45-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Memantine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "19982-08-2", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Mesalamine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "89-57-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Mesalamine (Premix/Granules)", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "89-57-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Nicardipine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "55985-32-5", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Tamsulosin HCl", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "106463-17-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Vincamine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "1617-90-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Dexlansoprazole", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "138530-94-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Barnidipine hydrochloride", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "104757-53-1", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Chlorpheneramine Maleate", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "113-92-8", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Cinitapride", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "66564-14-5", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Clarithromycin", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "81103-11-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Everolimus", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "159351-69-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Flurbiprofen", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "5104-49-4", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Ketoprofen", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "22071-15-4", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Levomilnacipran", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "96847-55-1", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Linaclotide", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "851199-59-2", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Memantine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "19982-08-2", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Mesalamine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "89-57-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Metoprolol Succinate MUPS", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "98455-82-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Nicardipine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "55985-32-5", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Pancreatin", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "8049-47-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Peppermint oil", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "8006-90-4", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Sirolimus", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "53123-88-9", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Tacrolimus", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "104987-11-3", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Tolterodine Tartrate", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "124937-52-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Trospium chloride", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "10405-02-4", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Viloxazine", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "46817-91-8", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Xanomeline Tartrate", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "141064-23-5", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Carbonyl Iron", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "7439-89-6", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Zinc Sulphate", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "7446-20-0", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "Folic Acid", "category": "pellets", "category_label": "Pellets & MUPS", "cas": "59-30-3", "specs": "Enteric / SR Pellets", "filings": "WHO-GMP Formulations", "page": "pellets.html"}, {"name": "N-Methyl-4-piperidone", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "N-Methyl-4-hydroxypiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "N-Methyl-4-chloropiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "N-Methyl-4-chloropiperidine HCl", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "N-Methyl-4-aminopiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "N-Carbethoxy-4-piperidone", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "N-Carbethoxy-4-hydroxypiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "N-Carbethoxy-4-aminopiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "N-Benzyl-4-piperidone", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "N-Benzyl-4-hydroxypiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "4-Benzyl-4-hydroxypiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "N-Benzyl-4-chloropiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "N-Benzyl-4-aminopiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "4-(2-Keto-benzimidazolinyl) piperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "4-Piperidone ethylene ketal", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "4-Hydroxypiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "4-Aminopiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "4-Piperidinopiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "1,4&#x27;-Bipiperidine dihydrochloride", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "N-Piperidin-4-ylbenzamide", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "N-Isobutyl-4-piperidone", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "1-(4-Chlorobenzhydryl)-piperazine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "N-Ethyl-4-piperidone", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "1,3-Dimethyl-4-piperidone", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "(R)-(-)-3-Aminopiperidine dihydrochloride", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "N-Propyl-4-piperidone", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "3-Chloromethyl-5-Methylpyridine Hydrochloride", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "4-(4-Chlorophenyl)-4-hydroxypiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "4-(4-Bromophenyl)-4-hydroxypiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "4-Phenyl-4-hydroxypiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "4-Phenylpiperidine", "category": "piperidones", "category_label": "Piperidone", "cas": "", "specs": "High Purity (>=99.0%)", "filings": "Specialized Heterocycle", "page": "piperidone-derivatives.html"}, {"name": "Bempedoic acid", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Bilastine", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Calcium Folinate (Leucovorin calcium)", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Dapagliflozin Propanediol", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Dexlansoprazole Sesquihydrate", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Dexlansoprazole Anhydrous", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Edoxaban Tosylate", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Eflornithine hydrochloride monohydrate", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Empagliflozin", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Fosfomycin Tromethamol", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Isoxsuprine HCl", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Lactulose Crystals", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "L-methyl Folate Calcium", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Maropitant", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Maropitant Citrate", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Ormeloxifene HCl", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Pentosan Polysulfate Sodium", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Propyphenazone", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Rimegepant Sulfate Hydrate", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Ropivacaine Hydrochloride monohydrate", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Trofinetide", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Tyloxapol", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Ursodiol", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Voglibose", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}, {"name": "Vitamin K2-7 (Menaquinone-7)", "category": "under-dev", "category_label": "Under Development", "cas": "", "specs": "Process Validation Stage", "filings": "Pipeline / Scale-up", "page": "under-development.html"}];

  // Embedded Knowledge Base (Core FAQs, Regulatory Accreditations, Facilities, Services)
  const VP_FAQS = [{"Question": "What products does Vasudha Pharma manufacture?", "Answer": "Vasudha Pharma Chem Limited is a leading global manufacturer specializing in 4 core categories: 1) Active Pharmaceutical Ingredients (APIs) across therapeutic areas like cardiovascular, CNS, anti-histamines, and gastrointestinal; 2) Advanced Pharma Intermediates; 3) Pellets & MUPS (Multi-Unit Particulate Systems); and 4) Piperidone Derivatives, where Vasudha is recognized as one of the largest manufacturers globally. You can browse our complete 150+ product catalog on our Products page: https://vasudhapharma.com/products.html", "Category": "Products", "Keywords": "products, catalog, APIs, intermediates, pellets, piperidone, portfolio"}, {"Question": "What APIs are manufactured by Vasudha Pharma?", "Answer": "Our commercial API portfolio includes Amitriptyline HCl, Aripiprazole, Bepotastine Besilate, Clopidogrel Bisulphate, Cyclobenzaprine HCl, Dabigatran Etexilate Mesylate, Desloratadine, Dexlansoprazole, Dimethyl Fumarate, Donepezil HCl, Ebastine, Esomeprazole Magnesium Trihydrate, Febuxostat, Fexofenadine HCl, Flunarizine Di HCl, Itraconazole, Lacosamide, Loperamide HCl, Loratadine, Losartan Potassium, Mebeverine HCl, Mirabegron, Olmesartan Medoxomil, Pantoprazole Sodium, Pregabalin, Quetiapine Fumarate, Rivaroxaban, Rupatadine Fumarate, Sacubitril Sodium, Tamsulosin HCl, Telmisartan, Valsartan, and Vonoprazan Fumarate. Detailed specifications and DMF statuses are available on our APIs page: https://vasudhapharma.com/apis.html", "Category": "Products", "Keywords": "APIs, active ingredients, list of APIs, bulk drugs"}, {"Question": "Does Vasudha Pharma offer Pellets & MUPS?", "Answer": "Yes, Vasudha Pharma produces high-precision Pellets and MUPS (Multi-Unit Particulate Systems) including Esomeprazole (Micro/MUPS), Omeprazole, Lansoprazole, Pantoprazole, Rabeprazole, Duloxetine HCl, Venlafaxine, Itraconazole, Aprepitant, Dabigatran, Mesalamine, and Metoprolol Succinate MUPS with controlled, enteric, and sustained release profiles. Visit https://vasudhapharma.com/pellets.html for full details.", "Category": "Products", "Keywords": "pellets, MUPS, micro pellets, delayed release, sustained release"}, {"Question": "What are Vasudha Pharma's capabilities in Piperidone chemistry?", "Answer": "Vasudha Pharma is one of the world's largest manufacturers of Piperidone Derivatives. Our commercial offerings include N-Methyl-4-piperidone, 4-Benzyl-4-hydroxypiperidine, N-Carbethoxy-4-piperidone, N-Benzyl-4-piperidone, 4-Hydroxypiperidine, 4-Aminopiperidine, 1,4'-Bipiperidine dihydrochloride, and customized piperidine building blocks for API synthesis globally. Visit https://vasudhapharma.com/piperidone-derivatives.html.", "Category": "Products", "Keywords": "piperidone, piperidine derivatives, n-methyl-4-piperidone"}, {"Question": "Does Vasudha Pharma offer Custom Synthesis and CDMO / CMO services?", "Answer": "Yes. Vasudha Pharma provides end-to-end Contract Development and Manufacturing Organization (CDMO / CMO) solutions—from milligram-scale route scouting and impurity profiling in our DSIR-recognized R&D centers to multi-ton commercial manufacturing across our USFDA-inspected manufacturing plants. Submit your CDMO requirement on https://vasudhapharma.com/cmo-cdmo.html or email us directly.", "Category": "Services", "Keywords": "CDMO, CMO, custom synthesis, contract manufacturing, tech transfer"}, {"Question": "What regulatory approvals and accreditations does Vasudha Pharma hold?", "Answer": "Vasudha Pharma's manufacturing facilities operate in strict compliance with current Good Manufacturing Practices (cGMP). Our key plants are inspected and approved by global health authorities including: USFDA (United States), PMDA (Japan), EDQM / CEP (Europe), WHO-GMP, KFDA (South Korea), and Cofepris (Mexico). We also maintain ISO 9001 (Quality), ISO 14001 (Environment), and ISO 45001 (Occupational Health & Safety) certifications. Details: https://vasudhapharma.com/statutory-regulations.html", "Category": "Quality & Compliance", "Keywords": "regulatory, USFDA, FDA, PMDA, WHO GMP, EDQM, CEP, ISO, accreditations"}, {"Question": "Where are Vasudha Pharma's manufacturing units located?", "Answer": "Vasudha Pharma operates multi-purpose manufacturing campuses across Andhra Pradesh and Telangana, India: Unit-1 (Jeedimetla, Hyderabad), Unit-2, Unit-3, Unit-4, and Unit-5 located in Jawaharlal Nehru Pharma City (JNPC), Parawada, Visakhapatnam, and Shriram Chlorochem. Together, they house over 1,500+ KL reactor volume with cleanrooms (Class 100,000 / ISO Class 8). Full footprint: https://vasudhapharma.com/manufacturing.html", "Category": "Facilities", "Keywords": "manufacturing plants, locations, units, Vizag, Hyderabad, JNPC, factory"}, {"Question": "What recent awards has Vasudha Pharma received?", "Answer": "In 2026, Vasudha Pharma Unit-2 (Visakhapatnam / JNPC) received the prestigious Best Management Award from the Government of Andhra Pradesh for excellence in industrial relations, safety standards, and compliance. Additionally, VPCL was honored with the Best API Manufacturing Factory Award by the Government of Telangana for operational excellence and quality leadership. View updates: https://vasudhapharma.com/events.html", "Category": "Company Overview", "Keywords": "awards, best management award, telangana award, recognition"}, {"Question": "How can I request a commercial quotation or product sample?", "Answer": "You can request a commercial price quotation (RFQ) or analytical/pilot sample directly by visiting our Contact Page (https://vasudhapharma.com/contact.html), selecting 'Marketing' under Department, and choosing your product and desired volume. Alternatively, add multiple molecules to your RFQ Cart from our product tables or email domesticsales@vasudhapharma.com (India) or internationalsales@vasudhapharma.com (Global).", "Category": "Sales & Inquiries", "Keywords": "quotation, RFQ, price, sample, buy API, bulk purchase, MOQ"}, {"Question": "How can I apply for a job or career opportunity at Vasudha Pharma?", "Answer": "You can view all current vacancies and job openings across Production, Quality Control (QC), Quality Assurance (QA), R&D, and Regulatory Affairs on our Careers Portal: https://vasudhapharma.com/careers.html#openings. You can also email your CV/resume directly to our Talent Acquisition team at hr@vasudhapharma.com.", "Category": "Careers", "Keywords": "careers, jobs, openings, vacancy, hiring, HR, submit resume"}, {"Question": "What is Vasudha Pharma's Corporate Governance and Vigil Mechanism Policy?", "Answer": "Vasudha Pharma maintains a strict zero-tolerance policy against unethical conduct, fraud, or violations of cGMP. Employees, vendors, and stakeholders can submit confidential protected disclosures directly to our Vigilance Officer via email at ccollaboration@vasudhapharma.com. Read the policy: https://vasudhapharma.com/vigil-mechanism.html.", "Category": "Corporate Governance", "Keywords": "vigil mechanism, whistleblower, corporate governance, grievance"}, {"Question": "What are the CSR initiatives of the Vasudha Foundation?", "Answer": "The Vasudha Foundation conducts social impact programs focusing on: 1) Rural Community Healthcare and medical camps; 2) Educational infrastructure and scholarships; 3) Clean drinking water and sanitation; and 4) Environmental greening. Learn more: https://vasudhapharma.com/csr-policy.html.", "Category": "CSR & Foundation", "Keywords": "CSR, foundation, charity, rural health, education"}, {"Question": "How can I contact Vasudha Pharma?", "Answer": "Corporate Office: Plot No. 78, Jawaharlal Nehru Pharma City, Parawada, Visakhapatnam - 531021, Andhra Pradesh, India. Administrative & Marketing Office: Hyderabad, Telangana, India. Phone: +91-40-44778899. Email: info@vasudhapharma.com (General), domesticsales@vasudhapharma.com (Domestic Sales), internationalsales@vasudhapharma.com (Global Exports). Web form: https://vasudhapharma.com/contact.html.", "Category": "Contact", "Keywords": "contact, phone, email, address, office, location"}];

  // State Management
  const STATE = {
    isOpen: false,
    soundEnabled: true,
    history: [],
    teaserDismissed: false
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
    } catch (e) {
      // Audio not permitted or supported
    }
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

  // Render Launcher, Window & Teaser
  function renderBotUI() {
    // Teaser Callout
    const teaserEl = document.createElement('div');
    teaserEl.id = 'vp-bot-teaser';
    teaserEl.style.display = 'none';
    teaserEl.innerHTML = `
      <span>👋 <strong>Need assistance?</strong> Ask about our 265+ APIs, Pellets &amp; DMFs!</span>
      <button type="button" class="vp-teaser-close" title="Dismiss">&times;</button>
    `;

    // Launcher Button
    const launcherEl = document.createElement('button');
    launcherEl.id = 'vp-bot-launcher';
    launcherEl.setAttribute('aria-label', 'Open Vasudha Virtual Assistant');
    launcherEl.setAttribute('type', 'button');
    launcherEl.innerHTML = `
      <div class="vp-icon-chat">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
          <circle cx="8" cy="10" r="1.5"/>
          <circle cx="12" cy="10" r="1.5"/>
          <circle cx="16" cy="10" r="1.5"/>
        </svg>
      </div>
      <div class="vp-icon-close">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </div>
      <div class="vp-unread-badge" id="vp-unread-indicator"></div>
    `;

    // Chat Window
    const windowEl = document.createElement('div');
    windowEl.id = 'vp-bot-window';
    windowEl.innerHTML = `
      <div class="vp-header">
        <div class="vp-header-left">
          <div class="vp-header-avatar">
            <img src="${LOGO_SRC}" alt="Vasudha Logo" onerror="this.onerror=null; this.src='assets/vasudha-logo.jpg';">
          </div>
          <div class="vp-header-info">
            <div class="vp-header-title">Vasudha Virtual Assistant</div>
            <div class="vp-header-subtitle">
              <span class="vp-online-dot"></span>
              <span>Official Pharma Guide &bull; Online</span>
            </div>
          </div>
        </div>
        <div class="vp-header-actions">
          <button type="button" class="vp-header-btn" id="vp-sound-toggle" title="Toggle Sound">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </button>
          <button type="button" class="vp-header-btn" id="vp-reset-btn" title="Reset Chat">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
          <button type="button" class="vp-header-btn" id="vp-close-btn" title="Close Assistant">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="vp-body" id="vp-bot-messages">
        <!-- Messages rendered dynamically -->
      </div>

      <div class="vp-footer">
        <form class="vp-input-bar" id="vp-input-form">
          <input type="text" id="vp-bot-input" class="vp-input" placeholder="Type a drug name, CAS #, facility or query..." autocomplete="off">
          <button type="submit" class="vp-send-btn" id="vp-send-btn" aria-label="Send message">
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </form>
        <div class="vp-footer-brand">
          <span class="shield">🛡️</span> Vasudha Pharma Chem Ltd &bull; 100% Confidential
        </div>
      </div>
    `;

    document.body.appendChild(teaserEl);
    document.body.appendChild(launcherEl);
    document.body.appendChild(windowEl);

    setupEventListeners(launcherEl, windowEl, teaserEl);
  }

  // Setup UI Interactions
  function setupEventListeners(launcher, win, teaser) {
    const unreadIndicator = document.getElementById('vp-unread-indicator');
    const inputForm = document.getElementById('vp-input-form');
    const inputField = document.getElementById('vp-bot-input');
    const closeBtn = document.getElementById('vp-close-btn');
    const resetBtn = document.getElementById('vp-reset-btn');
    const soundToggle = document.getElementById('vp-sound-toggle');
    const teaserClose = teaser.querySelector('.vp-teaser-close');

    // Toggle Window Open / Close
    function toggleChat(forceState) {
      const targetState = typeof forceState === 'boolean' ? forceState : !STATE.isOpen;
      STATE.isOpen = targetState;

      if (STATE.isOpen) {
        win.classList.add('vp-open');
        launcher.classList.add('vp-active');
        teaser.style.display = 'none';
        STATE.teaserDismissed = true;
        if (unreadIndicator) unreadIndicator.style.display = 'none';
        setTimeout(() => inputField && inputField.focus(), 250);
        try { sessionStorage.setItem('vp_bot_open', '1'); } catch (e) {}
      } else {
        win.classList.remove('vp-open');
        launcher.classList.remove('vp-active');
        try { sessionStorage.setItem('vp_bot_open', '0'); } catch (e) {}
      }
    }

    launcher.addEventListener('click', () => toggleChat());
    closeBtn.addEventListener('click', () => toggleChat(false));

    // Teaser events
    teaser.addEventListener('click', (e) => {
      if (e.target.closest('.vp-teaser-close')) return;
      toggleChat(true);
    });

    teaserClose.addEventListener('click', (e) => {
      e.stopPropagation();
      teaser.style.display = 'none';
      STATE.teaserDismissed = true;
    });

    // Sound toggle
    soundToggle.addEventListener('click', () => {
      STATE.soundEnabled = !STATE.soundEnabled;
      soundToggle.style.opacity = STATE.soundEnabled ? '1' : '0.5';
      soundToggle.title = STATE.soundEnabled ? 'Sound On' : 'Sound Muted';
      if (STATE.soundEnabled) playNotificationChime();
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
      if (confirm('Start a fresh conversation with Vasudha Virtual Assistant?')) {
        clearChatHistory();
        renderWelcomeMessage();
      }
    });

    // Submit user message
    inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = (inputField.value || '').trim();
      if (!query) return;

      inputField.value = '';
      handleUserQuery(query);
    });

    // Show teaser after 2.5s if not already opened or dismissed
    setTimeout(() => {
      if (!STATE.isOpen && !STATE.teaserDismissed && sessionStorage.getItem('vp_bot_open') !== '1') {
        teaser.style.display = 'flex';
      }
    }, 2500);

    // Auto restore session state
    try {
      const savedHistory = sessionStorage.getItem('vp_bot_history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          STATE.history = parsed;
          renderSavedHistory();
        } else {
          renderWelcomeMessage();
        }
      } else {
        renderWelcomeMessage();
      }

      if (sessionStorage.getItem('vp_bot_open') === '1') {
        toggleChat(true);
      }
    } catch (e) {
      renderWelcomeMessage();
    }
  }

  // Clear Chat History
  function clearChatHistory() {
    STATE.history = [];
    const container = document.getElementById('vp-bot-messages');
    if (container) container.innerHTML = '';
    try {
      sessionStorage.removeItem('vp_bot_history');
    } catch (e) {}
  }

  // Save Chat History
  function saveChatState() {
    try {
      // Keep up to 25 recent items to avoid quota issues
      const trimmed = STATE.history.slice(-25);
      sessionStorage.setItem('vp_bot_history', JSON.stringify(trimmed));
    } catch (e) {}
  }

  // Render Saved History
  function renderSavedHistory() {
    const container = document.getElementById('vp-bot-messages');
    if (!container) return;
    container.innerHTML = '';

    STATE.history.forEach((item) => {
      appendMessageToDOM(item.sender, item.html, false);
    });
    scrollToBottom();
  }

  // Append Message to DOM
  function appendMessageToDOM(sender, html, save = true) {
    const container = document.getElementById('vp-bot-messages');
    if (!container) return;

    const row = document.createElement('div');
    row.className = `vp-msg-row vp-${sender}`;

    if (sender === 'bot') {
      row.innerHTML = `
        <div class="vp-msg-avatar">
          <img src="${LOGO_SRC}" alt="Vasudha">
        </div>
        <div class="vp-bubble">${html}</div>
      `;
    } else {
      row.innerHTML = `
        <div class="vp-bubble">${escapeHtml(html)}</div>
      `;
    }

    container.appendChild(row);
    scrollToBottom();

    if (save) {
      STATE.history.push({ sender, html, time: Date.now() });
      saveChatState();
    }

    // Attach event listeners for chips, RFQ triggers, and copy buttons
    attachDynamicActionListeners(row);
  }

  // Typing Indicator
  function showTypingIndicator() {
    const container = document.getElementById('vp-bot-messages');
    if (!container) return;

    hideTypingIndicator(); // remove previous if any

    const typingRow = document.createElement('div');
    typingRow.id = 'vp-typing-indicator';
    typingRow.className = 'vp-msg-row vp-bot';
    typingRow.innerHTML = `
      <div class="vp-msg-avatar">
        <img src="${LOGO_SRC}" alt="Vasudha">
      </div>
      <div class="vp-bubble vp-typing-indicator">
        <span class="vp-dot"></span>
        <span class="vp-dot"></span>
        <span class="vp-dot"></span>
      </div>
    `;
    container.appendChild(typingRow);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const el = document.getElementById('vp-typing-indicator');
    if (el) el.remove();
  }

  function scrollToBottom() {
    const container = document.getElementById('vp-bot-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  // Welcome Message
  function renderWelcomeMessage() {
    const welcomeHtml = `
      <p>Hello! Welcome to <strong>Vasudha Pharma Chem Limited</strong>. 👋</p>
      <p>I am your 24/7 Virtual Assistant. I can assist you with our <strong>265+ commercial molecules</strong>, technical DMF filings, regulatory accreditations, facility audits, or generate an instant <strong>Commercial Quotation (RFQ)</strong>.</p>
      <div class="vp-chips-container">
        <button type="button" class="vp-chip" data-action="explore-products">🔍 Search Products (265+)</button>
        <button type="button" class="vp-chip" data-action="request-quote">📋 Request a Quote (RFQ)</button>
        <button type="button" class="vp-chip" data-action="ask-facilities">🏭 Manufacturing Units</button>
        <button type="button" class="vp-chip" data-action="ask-regulatory">📜 US FDA &amp; Accreditations</button>
        <button type="button" class="vp-chip" data-action="ask-cdmo">🧪 CDMO &amp; R&amp;D Services</button>
        <button type="button" class="vp-chip" data-action="ask-careers">💼 Careers &amp; Openings</button>
        <button type="button" class="vp-chip" data-action="ask-contact">📞 Contact Sales Office</button>
      </div>
    `;
    appendMessageToDOM('bot', welcomeHtml, true);
  }

  // Attach Listeners for Chips, RFQ buttons, and Copy buttons inside message rows
  function attachDynamicActionListeners(scope) {
    // Quick Action Chips
    const chips = scope.querySelectorAll('.vp-chip[data-action]');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const action = chip.getAttribute('data-action');
        const text = chip.textContent.replace(/^[^\w\s]+/, '').trim();
        handleChipAction(action, text);
      });
    });

    // Copy CAS button
    const copyBtns = scope.querySelectorAll('.vp-copy-cas-btn');
    copyBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cas = btn.getAttribute('data-cas');
        if (cas && navigator.clipboard) {
          navigator.clipboard.writeText(cas).then(() => {
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = original; }, 1600);
          });
        }
      });
    });

    // Pre-filled RFQ button on product cards
    const quoteBtns = scope.querySelectorAll('.vp-btn-quote[data-product]');
    quoteBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const prod = btn.getAttribute('data-product');
        const cat = btn.getAttribute('data-category') || '';
        mountInChatRFQForm(prod, cat);
      });
    });

    // In-chat RFQ form submission
    const rfqForms = scope.querySelectorAll('.vp-rfq-form');
    rfqForms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRFQSubmission(form);
      });
    });
  }

  // Handle Quick Action Chip Selection
  function handleChipAction(action, label) {
    appendMessageToDOM('user', label, true);
    showTypingIndicator();

    setTimeout(() => {
      hideTypingIndicator();
      playNotificationChime();

      switch (action) {
        case 'explore-products':
          renderProductCategoriesGuide();
          break;
        case 'request-quote':
          mountInChatRFQForm('', '');
          break;
        case 'ask-facilities':
          renderFacilitiesInfo();
          break;
        case 'ask-regulatory':
          renderRegulatoryInfo();
          break;
        case 'ask-cdmo':
          renderCdmoInfo();
          break;
        case 'ask-careers':
          renderCareersInfo();
          break;
        case 'ask-contact':
          renderContactInfo();
          break;
        default:
          handleUserQuery(label);
      }
    }, 450);
  }

  // Product Category Guide
  function renderProductCategoriesGuide() {
    const html = `
      <p>Vasudha Pharma Chem Limited produces over <strong>265 commercial products</strong> across 5 specialized divisions:</p>
      <div class="vp-products-list">
        <div class="vp-product-card">
          <div class="vp-product-head">
            <span class="vp-product-title">Active Pharmaceutical Ingredients (APIs)</span>
            <span class="vp-category-tag">55 Products</span>
          </div>
          <div class="vp-product-meta">
            <span>Core therapies: Cardiovascular, CNS, Antihistamines, Gastrointestinal, and Pain Management.</span>
          </div>
          <div class="vp-product-actions">
            <a href="${BASE_PREFIX}apis.html" class="vp-product-btn vp-btn-view">Browse API Catalog</a>
            <button type="button" class="vp-product-btn vp-btn-quote" data-product="API Requirement" data-category="apis">Request API RFQ</button>
          </div>
        </div>

        <div class="vp-product-card">
          <div class="vp-product-head">
            <span class="vp-product-title">Pharma Intermediates</span>
            <span class="vp-category-tag">98 Products</span>
          </div>
          <div class="vp-product-meta">
            <span>Advanced key starting materials (KSMs) and regulatory intermediates synthesized at multi-ton scale.</span>
          </div>
          <div class="vp-product-actions">
            <a href="${BASE_PREFIX}intermediates.html" class="vp-product-btn vp-btn-view">Browse Intermediates</a>
            <button type="button" class="vp-product-btn vp-btn-quote" data-product="Intermediate Requirement" data-category="intermediates">Request RFQ</button>
          </div>
        </div>

        <div class="vp-product-card">
          <div class="vp-product-head">
            <span class="vp-product-title">Pellets &amp; MUPS</span>
            <span class="vp-category-tag">56 Products</span>
          </div>
          <div class="vp-product-meta">
            <span>Controlled release, enteric coated, and sustained release micro-pellets and MUPS formulations.</span>
          </div>
          <div class="vp-product-actions">
            <a href="${BASE_PREFIX}pellets.html" class="vp-product-btn vp-btn-view">Browse Pellets</a>
            <button type="button" class="vp-product-btn vp-btn-quote" data-product="Pellet Requirement" data-category="pellets">Request RFQ</button>
          </div>
        </div>

        <div class="vp-product-card">
          <div class="vp-product-head">
            <span class="vp-product-title">Piperidone Derivatives</span>
            <span class="vp-category-tag">31 Products</span>
          </div>
          <div class="vp-product-meta">
            <span>Global market leader in piperidone building blocks (N-Methyl-4-piperidone, 4-Hydroxypiperidine, etc.).</span>
          </div>
          <div class="vp-product-actions">
            <a href="${BASE_PREFIX}piperidone-derivatives.html" class="vp-product-btn vp-btn-view">Browse Piperidones</a>
            <button type="button" class="vp-product-btn vp-btn-quote" data-product="Piperidone Requirement" data-category="piperidones">Request RFQ</button>
          </div>
        </div>
      </div>
      <p style="margin-top:10px; font-size:12px; color:var(--vp-bot-text-muted);">
        💡 <em>You can also search directly by typing any generic chemical name or CAS number (e.g., "Aripiprazole", "Rivaroxaban", "549-18-8").</em>
      </p>
    `;
    appendMessageToDOM('bot', html, true);
  }

  // Pre-fill & Mount In-Chat RFQ Form
  function mountInChatRFQForm(defaultMolecule = '', defaultCategory = '') {
    const html = `
      <div class="vp-rfq-container">
        <div class="vp-rfq-title">
          <span>📋 Request Commercial Quotation (RFQ)</span>
        </div>
        <div class="vp-rfq-subtitle">Submit your commercial or sample requirement for prompt priority response.</div>
        <form class="vp-rfq-form">
          <div class="vp-rfq-group">
            <label>Product / Molecule Name <span class="req">*</span></label>
            <input type="text" class="vp-rfq-input" name="molecule" value="${escapeHtml(defaultMolecule)}" placeholder="e.g. Clopidogrel Bisulphate, Rivaroxaban" required>
          </div>
          <div class="vp-rfq-group">
            <label>Required Quantity &amp; Grade <span class="req">*</span></label>
            <input type="text" class="vp-rfq-input" name="quantity" placeholder="e.g. 50 kg Commercial / 1 kg Pilot / 100g Analytical" required>
          </div>
          <div class="vp-rfq-group">
            <label>Your Full Name <span class="req">*</span></label>
            <input type="text" class="vp-rfq-input" name="contact_name" placeholder="First &amp; Last Name" required>
          </div>
          <div class="vp-rfq-group">
            <label>Company / Organization <span class="req">*</span></label>
            <input type="text" class="vp-rfq-input" name="company" placeholder="e.g. Acme Pharmaceuticals Ltd" required>
          </div>
          <div class="vp-rfq-group">
            <label>Work Email Address <span class="req">*</span></label>
            <input type="email" class="vp-rfq-input" name="email" placeholder="name@company.com" required>
          </div>
          <div class="vp-rfq-group">
            <label>Phone / WhatsApp Number</label>
            <input type="text" class="vp-rfq-input" name="phone" placeholder="+1 / +91 / Country Code &amp; Number">
          </div>
          <div class="vp-rfq-group">
            <label>Target Destination / Market</label>
            <input type="text" class="vp-rfq-input" name="market" placeholder="e.g. USA, EU, India, Japan, Latin America">
          </div>
          <div class="vp-rfq-group">
            <label>Regulatory Specs / Notes</label>
            <textarea class="vp-rfq-textarea" name="notes" placeholder="Specify pharmacopoeia grade (USP/BP/EP), DMF required, or timeline..."></textarea>
          </div>
          <button type="submit" class="vp-rfq-submit-btn">
            <span>Submit Quotation Request</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </form>
      </div>
    `;
    appendMessageToDOM('bot', html, true);
  }

  // Handle RFQ Form Submission
  function handleRFQSubmission(form) {
    const formData = new FormData(form);
    const molecule = formData.get('molecule') || 'Unspecified';
    const quantity = formData.get('quantity') || 'Unspecified';
    const contactName = formData.get('contact_name') || 'Valued Customer';
    const company = formData.get('company') || '';
    const email = formData.get('email') || '';
    const phone = formData.get('phone') || '';
    const market = formData.get('market') || 'Global';
    const notes = formData.get('notes') || '';
    const ticketId = generateTicketId();

    const leadRecord = {
      id: ticketId,
      timestamp: new Date().toISOString(),
      dateStr: new Date().toLocaleString(),
      molecule,
      quantity,
      contactName,
      company,
      email,
      phone,
      market,
      notes,
      status: 'New / Pending Review',
      source: 'Vasudha Virtual Assistant'
    };

    // Save to localStorage for client offline testing & Staff Portal sync
    try {
      const existing = JSON.parse(localStorage.getItem('vp_bot_leads') || '[]');
      existing.unshift(leadRecord);
      localStorage.setItem('vp_bot_leads', JSON.stringify(existing.slice(0, 100)));
    } catch (e) {
      console.warn('Could not store lead to localStorage:', e);
    }

    // Disable form to prevent double submission
    const submitBtn = form.querySelector('.vp-rfq-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Request Logged &amp; Verified</span>';
      submitBtn.style.opacity = '0.7';
    }

    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      playNotificationChime();

      const successHtml = `
        <div class="vp-rfq-success-card">
          <div class="vp-rfq-success-header">
            <span>✅ Quotation Request Received</span>
          </div>
          <div>Thank you, <strong>${escapeHtml(contactName)}</strong>. Your request for <strong>${escapeHtml(molecule)} (${escapeHtml(quantity)})</strong> has been logged in our Commercial Pipeline.</div>
          <div class="vp-rfq-ticket-pill">Ticket Reference: #${ticketId}</div>
          <p style="font-size:12px; margin:6px 0 0 0; color:#166534;">
            Our Marketing &amp; Sales Directorate will review your specifications and email you an official quote at <strong>${escapeHtml(email)}</strong> within 24 business hours.
          </p>
        </div>
        <div class="vp-chips-container" style="margin-top:10px;">
          <button type="button" class="vp-chip" data-action="explore-products">🔍 Browse More Molecules</button>
          <button type="button" class="vp-chip" data-action="ask-contact">📞 Call Marketing Office</button>
        </div>
      `;
      appendMessageToDOM('bot', successHtml, true);
    }, 600);
  }

  // Render Facilities Info
  function renderFacilitiesInfo() {
    const html = `
      <p><strong>Vasudha Pharma Chem Limited</strong> operates multi-purpose manufacturing campuses across Andhra Pradesh and Telangana, India:</p>
      <ul style="padding-left:18px; margin:6px 0; font-size:13px; line-height:1.55;">
        <li><strong>Unit 1:</strong> Jeedimetla, Hyderabad, Telangana (Specialized R&amp;D &amp; API scale-up).</li>
        <li><strong>Unit 2, 3, 4 &amp; 5:</strong> Jawaharlal Nehru Pharma City (JNPC), Parawada, Visakhapatnam, Andhra Pradesh (US FDA approved mega-complex).</li>
        <li><strong>Shriram Chlorochem:</strong> Chlorination &amp; specialized chemistry infrastructure.</li>
      </ul>
      <p>Key Capabilities: <strong>1,500+ KL Total Reactor Volume</strong>, Class 100,000 / ISO Class 8 Cleanrooms, and Zero Liquid Discharge (ZLD) environmental systems.</p>
      <div class="vp-chips-container">
        <a href="${BASE_PREFIX}manufacturing.html" class="vp-chip" style="text-decoration:none;">🏭 View Manufacturing Tour</a>
        <button type="button" class="vp-chip" data-action="ask-regulatory">📜 Regulatory Accreditations</button>
      </div>
    `;
    appendMessageToDOM('bot', html, true);
  }

  // Render Regulatory Info
  function renderRegulatoryInfo() {
    const html = `
      <p>Vasudha Pharma's manufacturing sites operate in stringent compliance with <strong>current Good Manufacturing Practices (cGMP)</strong> and hold accreditations from tier-1 global agencies:</p>
      <ul style="padding-left:18px; margin:6px 0; font-size:13px; line-height:1.55;">
        <li>🇺🇸 <strong>US FDA:</strong> Regularly inspected with Zero 483 / clean compliance history.</li>
        <li>🇪🇺 <strong>EDQM / CEP:</strong> Multiple active Certificates of Suitability in Europe.</li>
        <li>🇯🇵 <strong>PMDA:</strong> Approved for pharmaceutical supply to Japan.</li>
        <li>🇰🇷 <strong>KFDA &amp; WHO-GMP:</strong> Certified manufacturing practices.</li>
        <li>🛡️ <strong>ISO Accreditations:</strong> ISO 9001 (Quality), ISO 14001 (Environment), and ISO 45001 (Occupational Health &amp; Safety).</li>
      </ul>
      <div class="vp-chips-container">
        <a href="${BASE_PREFIX}statutory-regulations.html" class="vp-chip" style="text-decoration:none;">📜 Regulatory &amp; Compliance Details</a>
        <button type="button" class="vp-chip" data-action="request-quote">📋 Request DMF Dossier / Quote</button>
      </div>
    `;
    appendMessageToDOM('bot', html, true);
  }

  // Render CDMO Info
  function renderCdmoInfo() {
    const html = `
      <p><strong>Contract Development &amp; Manufacturing (CDMO / CMO):</strong></p>
      <p>Vasudha Pharma provides end-to-end partner services ranging from milligram-scale route scouting in our DSIR-recognized R&amp;D center to multi-ton commercial production in our US FDA compliant plants.</p>
      <ul style="padding-left:18px; margin:6px 0; font-size:13px; line-height:1.55;">
        <li>Complex multistep organic synthesis (15+ steps)</li>
        <li>High-pressure catalytic hydrogenation (up to 50 bar)</li>
        <li>Cryogenic reactions down to -80°C</li>
        <li>Piperidone &amp; Heterocyclic specialized chemistries</li>
        <li>Chiral resolution &amp; polymorph characterization</li>
      </ul>
      <div class="vp-chips-container">
        <a href="${BASE_PREFIX}cmo-cdmo.html" class="vp-chip" style="text-decoration:none;">🧪 Explore CDMO Capabilities</a>
        <button type="button" class="vp-chip" data-action="request-quote">📋 Submit CDMO Project Scope</button>
      </div>
    `;
    appendMessageToDOM('bot', html, true);
  }

  // Render Careers Info
  function renderCareersInfo() {
    const html = `
      <p><strong>Join the Vasudha Pharma Team:</strong></p>
      <p>We are constantly seeking dynamic talent across Production, Quality Control (QC), Quality Assurance (QA), Regulatory Affairs, R&amp;D, and Global Business Development.</p>
      <p>You can view current vacancies and submit your application directly on our Careers Portal, or email your CV to our Talent Acquisition desk at <a href="mailto:hr@vasudhapharma.com"><strong>hr@vasudhapharma.com</strong></a>.</p>
      <div class="vp-chips-container">
        <a href="${BASE_PREFIX}careers.html#openings" class="vp-chip" style="text-decoration:none;">💼 View Open Vacancies</a>
        <a href="${BASE_PREFIX}apply.html" class="vp-chip" style="text-decoration:none;">📝 Submit Job Application</a>
      </div>
    `;
    appendMessageToDOM('bot', html, true);
  }

  // Render Contact Info
  function renderContactInfo() {
    const html = `
      <p><strong>Vasudha Pharma Chem Limited Contact Directory:</strong></p>
      <ul style="padding-left:18px; margin:6px 0; font-size:13px; line-height:1.55;">
        <li><strong>Corporate Office:</strong> Plot No. 78, Jawaharlal Nehru Pharma City, Parawada, Visakhapatnam - 531021, A.P., India.</li>
        <li><strong>Admin &amp; Marketing Office:</strong> Hyderabad, Telangana, India.</li>
        <li><strong>Phone:</strong> <a href="tel:+914044778899">+91-40-44778899</a></li>
        <li><strong>Domestic Sales:</strong> <a href="mailto:domesticsales@vasudhapharma.com">domesticsales@vasudhapharma.com</a></li>
        <li><strong>Global Exports:</strong> <a href="mailto:internationalsales@vasudhapharma.com">internationalsales@vasudhapharma.com</a></li>
        <li><strong>HR / Recruitment:</strong> <a href="mailto:hr@vasudhapharma.com">hr@vasudhapharma.com</a></li>
      </ul>
      <div class="vp-chips-container">
        <a href="${BASE_PREFIX}contact.html" class="vp-chip" style="text-decoration:none;">📍 Open Contact Form &amp; Map</a>
        <button type="button" class="vp-chip" data-action="request-quote">📋 Request Fast Quotation</button>
      </div>
    `;
    appendMessageToDOM('bot', html, true);
  }

  // Product Card Renderer for Search Matches
  function renderProductCardHtml(p) {
    const pageUrl = BASE_PREFIX + (p.page || 'products.html');
    return `
      <div class="vp-product-card">
        <div class="vp-product-head">
          <span class="vp-product-title">${escapeHtml(p.name)}</span>
          <span class="vp-category-tag">${escapeHtml(p.category_label || p.category)}</span>
        </div>
        <div class="vp-product-meta">
          <div class="vp-product-cas">
            <span>CAS:</span>
            <span class="vp-cas-badge">${escapeHtml(p.cas || 'N/A')}</span>
            ${p.cas ? `<button type="button" class="vp-copy-cas-btn" data-cas="${escapeHtml(p.cas)}">Copy</button>` : ''}
          </div>
          <div>Specs: <strong>${escapeHtml(p.specs || 'In-House / Standard')}</strong></div>
          <div>DMF / Filings: <strong>${escapeHtml(p.filings || 'Available on Request')}</strong></div>
        </div>
        <div class="vp-product-actions">
          <a href="${pageUrl}" class="vp-product-btn vp-btn-view">View Specs &amp; Page</a>
          <button type="button" class="vp-product-btn vp-btn-quote" data-product="${escapeHtml(p.name)}" data-category="${escapeHtml(p.category)}">Request Quote</button>
        </div>
      </div>
    `;
  }

  // Natural Language & Search Engine
  function handleUserQuery(query) {
    appendMessageToDOM('user', query, true);
    showTypingIndicator();

    setTimeout(() => {
      hideTypingIndicator();
      playNotificationChime();

      const q = query.trim().toLowerCase();
      const qTokens = q.replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(Boolean);

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
      if (/(quote|quotation|price|pricing|cost|rfq|buy|purchase|sample|order)/i.test(q) && !/(cas|spec|facility|plant|who|what)/i.test(q)) {
        mountInChatRFQForm('', '');
        return;
      }

      // 4. Check for Careers Intent
      if (/(career|careers|job|jobs|hiring|vacancy|vacancies|recruit|internship|resume|cv|apply)/i.test(q)) {
        renderCareersInfo();
        return;
      }

      // 5. Check for Regulatory Intent
      if (/(regulatory|approval|fda|usfda|pmda|edqm|cep|cgmp|gmp|audit|inspections|certificate|iso)/i.test(q)) {
        renderRegulatoryInfo();
        return;
      }

      // 6. Check for Facilities Intent
      if (/(facility|facilities|plant|plants|unit|units|vizag|visakhapatnam|hyderabad|jeedimetla|jnpc|capacity|reactors)/i.test(q)) {
        renderFacilitiesInfo();
        return;
      }

      // 7. Check for CDMO / CMO Intent
      if (/(cdmo|cmo|custom\s+synthesis|contract\s+mfg|contract\s+manufacturing|route\s+scouting|r&d|rnd)/i.test(q)) {
        renderCdmoInfo();
        return;
      }

      // 8. Check for Contact Intent
      if (/(contact|phone|email|call|address|office|location|headquarters|reach)/i.test(q)) {
        renderContactInfo();
        return;
      }

      // 9. Search Products Database (CAS Number or Name)
      const matchingProducts = [];

      for (let i = 0; i < VP_PRODUCTS.length; i++) {
        const p = VP_PRODUCTS[i];
        const pNameLower = p.name.toLowerCase();
        const pCas = (p.cas || '').toLowerCase();
        const pCat = (p.category || '').toLowerCase();
        const pCatLabel = (p.category_label || '').toLowerCase();

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

        // Name starts with query or query contained in name
        if (pNameLower.indexOf(q) !== -1) {
          matchingProducts.push({ product: p, score: 85 });
          continue;
        }

        // Token match
        let tokenScore = 0;
        for (let t = 0; t < qTokens.length; t++) {
          const tok = qTokens[t];
          if (tok.length < 3) continue;
          if (pNameLower.indexOf(tok) !== -1) tokenScore += 30;
          if (pCas.indexOf(tok) !== -1) tokenScore += 40;
          if (pCat.indexOf(tok) !== -1 || pCatLabel.indexOf(tok) !== -1) tokenScore += 10;
        }

        if (tokenScore >= 30) {
          matchingProducts.push({ product: p, score: tokenScore });
        }
      }

      // If matches found
      if (matchingProducts.length > 0) {
        matchingProducts.sort((a, b) => b.score - a.score);
        const topMatches = matchingProducts.slice(0, 4).map(m => m.product);

        let responseHtml = `
          <p>Found <strong>${matchingProducts.length}</strong> commercial product${matchingProducts.length > 1 ? 's' : ''} matching "<strong>${escapeHtml(query)}</strong>":</p>
          <div class="vp-products-list">
            ${topMatches.map(p => renderProductCardHtml(p)).join('')}
          </div>
        `;

        if (matchingProducts.length > 4) {
          responseHtml += `
            <p style="margin-top:8px; font-size:12px; color:var(--vp-bot-text-muted);">
              Showing top 4 matches. Browse all on our <a href="${BASE_PREFIX}products.html">Complete 265+ Products Directory</a>.
            </p>
          `;
        }

        appendMessageToDOM('bot', responseHtml, true);
        return;
      }

      // 10. Search Knowledge Base FAQs
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
          if (tok.length < 3) continue;
          if (fQ.indexOf(tok) !== -1) score += 25;
          if (fK.indexOf(tok) !== -1) score += 20;
          if (fA.indexOf(tok) !== -1) score += 10;
        }

        if (score > highestFaqScore) {
          highestFaqScore = score;
          bestFaq = faq;
        }
      }

      if (bestFaq && highestFaqScore >= 20) {
        // Convert URLs in Answer to clickable links
        const formattedAnswer = bestFaq.Answer.replace(
          /(https?:\/\/[^\s]+)/g,
          '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );

        const faqHtml = `
          <p><strong>${escapeHtml(bestFaq.Question)}</strong></p>
          <p>${formattedAnswer}</p>
          <div class="vp-chips-container" style="margin-top:8px;">
            <button type="button" class="vp-chip" data-action="request-quote">📋 Request a Quote</button>
            <button type="button" class="vp-chip" data-action="explore-products">🔍 Search Another Molecule</button>
            <button type="button" class="vp-chip" data-action="ask-contact">📞 Contact Us</button>
          </div>
        `;
        appendMessageToDOM('bot', faqHtml, true);
        return;
      }

      // 11. Intelligent Fallback
      const fallbackHtml = `
        <p>I couldn't find an exact match for "<strong>${escapeHtml(query)}</strong>" in our commercial database.</p>
        <p>You can browse our categories, ask our Commercial team directly, or submit a custom inquiry:</p>
        <div class="vp-chips-container">
          <button type="button" class="vp-chip" data-action="explore-products">🔍 Browse 265+ Products</button>
          <button type="button" class="vp-chip" data-action="request-quote">📋 Request Custom Quotation (RFQ)</button>
          <button type="button" class="vp-chip" data-action="ask-cdmo">🧪 Custom Synthesis (CDMO)</button>
          <button type="button" class="vp-chip" data-action="ask-contact">📞 Speak with Marketing Office</button>
        </div>
      `;
      appendMessageToDOM('bot', fallbackHtml, true);
    }, 450);
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderBotUI);
  } else {
    renderBotUI();
  }
})();
