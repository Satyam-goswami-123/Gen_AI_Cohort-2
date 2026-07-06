DECISION_SYSTEM_PROMPT = """You are DecisionAI, an expert Community Decision Intelligence System built to help governments, NGOs, schools, communities, and city administrators make better, evidence-based decisions using data and artificial intelligence.

Your role is to:
1. Analyze community data, reports, surveys, complaints, budgets, and other documents
2. Identify patterns, risks, and opportunities
3. Generate structured, actionable recommendations
4. Explain your reasoning transparently (Explainable AI)
5. Provide realistic confidence assessments based on data quality
6. Model collaborative, multi-agent digital teammates performing autonomous sub-analysis (Equity, Operations, and Finance)

CRITICAL: You MUST respond with ONLY valid JSON. Do not include any text before or after the JSON object.

Required JSON structure:
{
  "executive_summary": "2-3 sentence overview of the situation and key finding",
  "key_insights": [
    "Specific insight 1 with data reference",
    "Specific insight 2 with data reference",
    "Specific insight 3 with data reference",
    "Specific insight 4 with data reference",
    "Specific insight 5 with data reference"
  ],
  "risks_and_challenges": [
    {
      "risk": "Risk name",
      "description": "Detailed description",
      "severity": "Low|Medium|High|Critical",
      "mitigation": "How to address this risk"
    }
  ],
  "priority_score": "Low|Medium|High|Critical",
  "priority_justification": "Why this priority level was assigned",
  "recommended_actions": [
    {
      "action": "Action title",
      "description": "Detailed steps to take",
      "timeline": "Immediate|Short-term (1-3 months)|Medium-term (3-12 months)|Long-term (1+ years)",
      "responsible_party": "Who should take this action",
      "estimated_impact": "Expected outcome"
    }
  ],
  "community_impact": {
    "affected_population": "Estimated number/percentage of people affected",
    "positive_outcomes": ["Outcome 1", "Outcome 2", "Outcome 3"],
    "negative_consequences_if_ignored": "What happens if no action is taken",
    "equity_considerations": "Impact on vulnerable or marginalized groups"
  },
  "confidence_level": 75,
  "confidence_factors": {
    "data_quality": "Assessment of the data quality provided",
    "data_completeness": "Assessment of data completeness",
    "analytical_certainty": "How certain the analysis is"
  },
  "agent_deliberations": [
    {
      "agent_name": "Vulnerability & Social Equity Agent",
      "focus": "Demographics, underserved sectors, marginalized group protections",
      "findings": "Analytical findings specific to vulnerability & social equity based on data",
      "recommendation": "Social impact recommendation",
      "status": "APPROVED|READY"
    },
    {
      "agent_name": "Infrastructure & Operations Agent",
      "focus": "Logistical feasibility, asset deployment, engineering bottlenecks",
      "findings": "Analytical findings specific to infrastructure and operational deployment",
      "recommendation": "Operational logistics recommendation",
      "status": "APPROVED|READY"
    },
    {
      "agent_name": "Financial & Resource Analyst Agent",
      "focus": "Budget allocation, cost-benefit ratios, resource sustainability",
      "findings": "Analytical findings specific to financial parameters and cost optimization",
      "recommendation": "Fiscal efficiency recommendation",
      "status": "APPROVED|READY"
    }
  ],
  "ai_reasoning": "Detailed explanation of how you analyzed the data, what patterns you identified, and why you made these specific recommendations. This should be 3-5 sentences explaining your thought process.",
  "data_gaps": ["Gap 1 that would improve analysis", "Gap 2"],
  "follow_up_questions": ["Question 1 to gather more data", "Question 2"],
  "category": "disaster_preparedness|waste_management|education|healthcare|public_safety|budget|complaints|environmental|general"
}

Guidelines:
- Be specific and quantitative where data allows
- Reference specific data points from uploaded files
- Confidence level should be 40-95% based on data quality
- Recommended actions should be realistic and actionable
- Always explain your reasoning transparently
- Consider equity and impact on vulnerable populations
- Flag data gaps that would improve the analysis"""


def build_analysis_prompt(user_query: str, file_context: str = "", use_case: str = "") -> str:
    """Build the complete user prompt for Gemini."""
    
    parts = []
    
    if use_case:
        parts.append(f"USE CASE CATEGORY: {use_case}")
        parts.append("")
    
    parts.append(f"USER QUERY: {user_query}")
    parts.append("")
    
    if file_context:
        parts.append("UPLOADED DATA / CONTEXT:")
        parts.append("=" * 60)
        parts.append(file_context)
        parts.append("=" * 60)
        parts.append("")
    
    parts.append(
        "Please analyze the above information and provide a comprehensive Decision Intelligence analysis "
        "following the required JSON format. Be specific, data-driven, and explain your reasoning clearly."
    )
    
    return "\n".join(parts)


def get_use_case_examples():
    """Return predefined use case examples with sample data."""
    return [
        {
            "id": "disaster_preparedness",
            "title": "Disaster Preparedness Assessment",
            "icon": "🌊",
            "category": "disaster_preparedness",
            "color": "blue",
            "description": "Assess community readiness for floods, earthquakes, and extreme weather events",
            "sample_query": "Our coastal district has 45,000 residents. Last monsoon season caused 3 major floods affecting 8,000 people. We have 2 emergency shelters with capacity for 500 each. Only 23% of residents have participated in disaster drills. Medical supplies at the district hospital last only 72 hours. Roads to 3 villages become impassable during floods. Analyze our disaster preparedness and recommend improvements.",
            "sample_data": "District: Coastal Bay Area\nPopulation: 45,000\nFlood events (last 3 years): 8\nPeople displaced last year: 8,200\nEmergency shelters: 2 (capacity: 1,000 total)\nDisaster drill participation: 23%\nHospital emergency supplies: 72-hour capacity\nIsolated villages during floods: 3\nEmergency response time average: 4.5 hours\nEvacuation routes: 2 (1 flood-prone)\nCommunity first-aid trained: 340 people"
        },
        {
            "id": "waste_management",
            "title": "Waste Management Optimization",
            "icon": "🗑️",
            "category": "waste_management",
            "color": "green",
            "description": "Optimize waste collection routes, reduce costs, and improve recycling rates",
            "sample_query": "Our city generates 250 tons of waste daily across 12 zones. Recycling rate is only 18% while our target is 45%. We have 8 collection trucks but 3 are frequently under maintenance. Landfill capacity will be exhausted in 18 months. Citizen complaints about missed collections have increased 40% this year. Monthly waste management budget is $180,000. Analyze and recommend improvements.",
            "sample_data": "City: Metro Green City\nDaily waste generated: 250 tons\nCurrent recycling rate: 18%\nTarget recycling rate: 45%\nCollection trucks: 8 (3 frequently in repair)\nLandfill capacity remaining: 18 months\nCollection zones: 12\nMonthly budget: $180,000\nMissed collection complaints this year: 847\nCompost facilities: 1\nRecycling centers: 3\nInformal waste pickers: ~200"
        },
        {
            "id": "education",
            "title": "Education Access Planning",
            "icon": "🏫",
            "category": "education",
            "color": "purple",
            "description": "Analyze school enrollment, dropout rates, and resource allocation for better outcomes",
            "sample_query": "Our district has 23 government schools serving 18,500 students. Dropout rate is 12% in grades 6-8 (primarily girls). Student-to-teacher ratio is 52:1 against a recommended 30:1. 6 schools have no functional toilets, causing girls to stay home. 4 schools have no electricity for digital learning. Free lunch program coverage is 67%. Analyze and provide recommendations to improve education outcomes.",
            "sample_data": "District: Rural Education District 7\nTotal schools: 23\nTotal students: 18,500\nDropout rate (grades 6-8): 12%\nGirl dropout rate: 18%\nStudent-teacher ratio: 52:1\nSchools without toilets: 6\nSchools without electricity: 4\nFree lunch program coverage: 67%\nSchools with digital devices: 8 out of 23\nTeacher vacancies: 87\nAnnual education budget: $2.1M\nLiteracy rate: 68%"
        },
        {
            "id": "healthcare",
            "title": "Healthcare Access Analysis",
            "icon": "🏥",
            "category": "healthcare",
            "color": "red",
            "description": "Evaluate healthcare facility distribution, patient load, and service gaps",
            "sample_query": "Our region of 120,000 people has 1 district hospital and 8 primary health centers. Average wait time at the hospital is 3.5 hours. 3 PHCs have no resident doctor. Maternal mortality rate is 320 per 100,000 live births (national average: 113). Vaccination coverage for children under 5 is 71%. 2 remote villages are 45+ km from any facility. Analyze healthcare access gaps and recommend interventions.",
            "sample_data": "Region: Mountain Health District\nPopulation: 120,000\nDistrict hospitals: 1\nPrimary health centers: 8\nPHCs without resident doctor: 3\nAverage hospital wait time: 3.5 hours\nMaternal mortality rate: 320/100,000\nNational average MMR: 113/100,000\nChild vaccination coverage: 71%\nRemote villages (45+ km): 2\nAnnual health budget: $4.8M\nMobile health units: 1\nTraditional birth attendants trained: 45"
        },
        {
            "id": "public_safety",
            "title": "Public Safety Intelligence",
            "icon": "🚔",
            "category": "public_safety",
            "color": "yellow",
            "description": "Analyze crime patterns, response times, and community safety improvements",
            "sample_query": "Our city has seen a 28% increase in petty theft over the last 6 months, concentrated in 3 market areas. Response time for non-emergency calls averages 18 minutes. Street lighting coverage in high-crime areas is only 45%. Community policing program has only 12 active volunteers. CCTV coverage in main market: 34%. Women report feeling unsafe in 6 key transit areas after 8 PM. Analyze and recommend public safety improvements.",
            "sample_data": "City: Commerce Hub City\nPetty theft increase (6 months): +28%\nHigh-crime zones: 3 market areas\nAverage emergency response time: 18 minutes\nAverage non-emergency response time: 18 min\nStreet lighting coverage (high-crime areas): 45%\nCCTV coverage (main market): 34%\nCommunity policing volunteers: 12\nUnsafe transit areas (women's report): 6\nPolice stations: 4\nOfficers per 1000 residents: 1.8\nYouth unemployment rate: 34%"
        },
        {
            "id": "budget",
            "title": "Municipal Budget Allocation",
            "icon": "💰",
            "category": "budget",
            "color": "amber",
            "description": "Optimize budget allocation across departments for maximum community benefit",
            "sample_query": "Our municipal budget for next year is $12 million. Current allocation: Roads 35%, Education 20%, Healthcare 15%, Sanitation 12%, Parks 8%, Administration 10%. Citizen satisfaction survey shows: Roads 4.2/10, Public Parks 6.1/10, Healthcare 3.8/10, Sanitation 4.5/10. Infrastructure backlog is $8M. Tourism revenue could increase 40% with park improvements. Analyze allocation efficiency and recommend rebalancing.",
            "sample_data": "Municipality: Greenfield City\nAnnual budget: $12,000,000\nRoads allocation: 35% ($4.2M)\nEducation: 20% ($2.4M)\nHealthcare: 15% ($1.8M)\nSanitation: 12% ($1.44M)\nParks: 8% ($960K)\nAdministration: 10% ($1.2M)\nCitizen satisfaction - Roads: 4.2/10\nCitizen satisfaction - Healthcare: 3.8/10\nCitizen satisfaction - Sanitation: 4.5/10\nInfrastructure backlog: $8,000,000\nTourism potential with park improvement: +40%"
        },
        {
            "id": "complaints",
            "title": "Citizen Complaints Analysis",
            "icon": "📣",
            "category": "complaints",
            "color": "orange",
            "description": "Analyze patterns in citizen grievances and prioritize systemic fixes",
            "sample_query": "We received 3,420 citizen complaints last quarter. Top categories: Water supply issues (34%), Road damage (22%), Garbage collection (18%), Streetlights (12%), Noise pollution (8%), Others (6%). Resolution rate is only 41%. Average resolution time: 23 days. 67% of unresolved complaints are older than 30 days. Ward 5 and Ward 9 account for 48% of all complaints. Analyze patterns and recommend systemic improvements.",
            "sample_data": "Quarter: Q3 2025\nTotal complaints: 3,420\nWater supply: 34% (1,163)\nRoad damage: 22% (752)\nGarbage collection: 18% (616)\nStreetlights: 12% (410)\nNoise pollution: 8% (274)\nOthers: 6% (205)\nResolution rate: 41%\nAverage resolution time: 23 days\nComplaints older than 30 days (unresolved): 67%\nHigh complaint wards: Ward 5 (28%), Ward 9 (20%)\nOnline complaints: 34%\nPhone complaints: 66%"
        },
        {
            "id": "environmental",
            "title": "Environmental Monitoring",
            "icon": "🌿",
            "category": "environmental",
            "color": "emerald",
            "description": "Assess air quality, water contamination, deforestation, and climate risks",
            "sample_query": "Our industrial city's AQI has been above 200 (Very Unhealthy) for 45 days this year. PM2.5 levels average 89 μg/m³ (WHO limit: 15 μg/m³). River water E.coli count is 2400 MPN/100mL (safe limit: 0). 340 hectares of forest lost to development in 5 years. Respiratory disease hospital admissions up 67%. 3 illegal dump sites identified near residential areas. Analyze environmental risks and recommend urgent interventions.",
            "sample_data": "City: Industrial Metro\nDays with AQI > 200: 45 this year\nAverage PM2.5: 89 μg/m³\nWHO PM2.5 limit: 15 μg/m³\nRiver E.coli count: 2400 MPN/100mL\nSafe E.coli limit: 0 MPN/100mL\nForest loss (5 years): 340 hectares\nRespiratory admissions increase: +67%\nIllegal dump sites: 3\nActive industries near residential: 12\nGreen cover: 8% (target: 25%)\nWastewater treatment capacity: 60% of need"
        }
    ]
