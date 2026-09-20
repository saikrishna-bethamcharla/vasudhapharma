# Vasudha Pharma — Zoho SalesIQ Zobot Configuration Guide

This guide walks you through setting up **Zobot (FAQ / Answer Bot)** inside your existing **Zoho SalesIQ** portal using only **pre-approved Vasudha Pharma company data**.

---

## 1. Import the Pre-Fed Knowledge Base (CSV)

We have generated and saved the ready-to-import FAQ file in your project folder:
`zoho_salesiq_faq_knowledge_base.csv`

### Steps in Zoho SalesIQ:
1. Log in to [salesiq.zoho.in](https://salesiq.zoho.in/) or via your Zoho CRM dashboard.
2. In the left navigation, click on **Settings (gear icon)** $\rightarrow$ **Resources** (or **Knowledge Base / FAQs**).
3. Click **Import** (or the three dots menu $\rightarrow$ *Import Articles/FAQs*).
4. Select the file: `zoho_salesiq_faq_knowledge_base.csv`.
5. Map the fields (they match 1:1):
   - `Question` $\rightarrow$ **Question / Title**
   - `Answer` $\rightarrow$ **Answer / Content**
   - `Category` $\rightarrow$ **Category**
   - `Keywords` $\rightarrow$ **Tags / Keywords**
6. Click **Import**. All 13 core company sections (APIs, Pellets, Piperidone, Facilities, USFDA/GMP Accreditations, Awards, CDMO, Careers, Vigil Mechanism, Contacts) are now live in your knowledge repository.

---

## 2. Configure Zobot (The Chatbot)

1. In Zoho SalesIQ, navigate to **Settings** $\rightarrow$ **Zobot** $\rightarrow$ **Add Bot**.
2. **Bot Details**:
   - **Name**: `Vasudha Assistant`
   - **Role**: `Virtual Sales & Technical Guide`
   - **Department**: Select `Marketing / Sales` (or `All Departments`).
   - **Choose Platform**: Select **Codeless Bot** or **Zia Answer Bot**.
   - **Avatar**: Upload the Vasudha logo (`assets/vasudha-logo.jpg`).

---

## 3. Recommended Greeting & Quick Action Chips

Set the initial bot trigger when a visitor clicks the chat icon:

### Welcome Message:
> *"Welcome to Vasudha Pharma Chem Limited. I am your Vasudha Virtual Assistant. How may I assist you today?"*

### Actionable Quick-Reply Buttons (Chips):
Configure these 5 clickable prompt chips for fast navigation:
1. 🧪 **Browse APIs & Product Catalog** $\rightarrow$ *(Answers with API & product links)*
2. 🏭 **Manufacturing Units & USFDA Approvals** $\rightarrow$ *(Answers with Vizag Unit 1–5 details & accreditations)*
3. 💼 **Request Commercial Quote (RFQ)** $\rightarrow$ *(Prompts for Name, Email, Molecule, Volume, and creates Lead in Zoho CRM)*
4. 🔬 **CDMO & Custom Synthesis** $\rightarrow$ *(Provides DSIR R&D & Tech transfer details)*
5. 👥 **Careers & Job Openings** $\rightarrow$ *(Links to careers portal & HR email)*

---

## 4. Strict Pharma Compliance Guardrails (Fallback Message)

To ensure the bot **never hallucinates** and sticks strictly to verified company data, set the **Fallback / Not Found** rule to:

> *"I am programmed to provide information exclusively on Vasudha Pharma Chem Limited's commercial products, manufacturing capabilities, and official policies. For custom inquiries or technical dossiers, please visit our [Contact Page](https://vasudhapharma.com/contact.html) or email us at info@vasudhapharma.com."*

---

## 5. Live Agent Escalation

Under **Bot Actions $\rightarrow$ Forward to Operator**:
- If a visitor types *"Speak to an agent"*, *"Call sales"*, or submits a high-volume RFQ (> 500 kg / MT), configure Zobot to transfer the chat to available staff on the **Zoho SalesIQ mobile app** or Zoho CRM.
- If no agents are currently online, Zobot automatically asks for their Email & Phone number and logs a **Lead** directly into **Zoho CRM**.

---

## 6. Verifying on Your Website

Your website already contains the live SalesIQ integration script:
```html
<script id="zsiqscript" src="https://salesiq.zohopublic.in/widget?wc=siq05cbc078ca5f8d4f9dfaba38a828d347b27c1197f11050eda2e9f927a0b47c0c7092a0563a1d91ac4b0d9fc83f935351" defer></script>
```
Once you activate the bot in Zoho SalesIQ, it will instantly appear live on your staging or production website without any code changes!
